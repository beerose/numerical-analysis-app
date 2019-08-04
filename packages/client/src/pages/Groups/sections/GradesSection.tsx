/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Button, Select, Spin } from 'antd';
import { SortOrder } from 'antd/lib/table';
import {
  getGradeFromTresholds,
  Grade,
  GroupDTO,
  GroupGradeSettings,
  UserDTO,
  UserResultsDTO,
  UserResultsModel,
  UserWithGroups,
} from 'common';
import {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  RouteChildrenProps,
  RouteComponentProps,
  RouterChildContext,
} from 'react-router';
import { DeepRequired } from 'utility-types';

import { ApiResponse2 } from '../../../api/authFetch';
import { Flex, Table, theme } from '../../../components';
import { Locale, LocaleContext } from '../../../components/locale';
import { ArrowRightButton } from '../../../components/ArrowRightButton';
import { gradesToCsv, isSafari, showMessage, usePromise } from '../../../utils';
import { makeTableSorter } from '../../../utils/makeTableSorter';
import { evalEquation } from '../components/evalEquation';
import { GroupApiContextState } from '../GroupApiContext';

export const sortDirections = ['descend', 'ascend'] as SortOrder[];

async function computeGradeFromResults(
  studentResults: UserResultsModel,
  { tresholds, grade_equation: gradeEquation }: DeepRequired<GroupDTO>['data']
): Promise<[Grade, number]> {
  const { tasksPoints, presences, activity } = studentResults;

  const points = await evalEquation(
    {
      activity,
      presence: presences,
      tasks: tasksPoints,
    },
    gradeEquation
  );
  const grade = getGradeFromTresholds(points, tresholds);

  return [grade, points];
}

type GradeDisplayProps = {
  userResults: UserResultsModel;
  currentGroup?: GroupDTO;
};

const ComputedGrade: React.FC<Required<GradeDisplayProps>> = ({
  userResults,
  currentGroup,
}) => {
  const [grade, points] = usePromise(
    () =>
      computeGradeFromResults(userResults, currentGroup.data as DeepRequired<
        GroupDTO
      >['data']),
    '',
    []
  );

  return <b title={`${points} pkt.`}>{grade}</b>;
};

export const SuggestedGrade: React.FC<GradeDisplayProps> = ({
  userResults,
  currentGroup,
}) => {
  if (!currentGroup) {
    return <Spin />;
  }
  if (
    !currentGroup.data ||
    !currentGroup.data.tresholds ||
    !currentGroup.data.grade_equation
  ) {
    return <Fragment>Brak odpowiednich ustawień</Fragment>;
  }

  return (
    <ComputedGrade userResults={userResults} currentGroup={currentGroup} />
  );
};

export const mergedResultsToTableItem = (
  student: UserWithGroups,
  results?: UserResultsDTO
) => {
  const final = student.groups_grades ? student.groups_grades[0] : undefined;

  return {
    activity: results ? results.sum_activity : 0,
    finalGrade: final && final.grade ? Grade(final.grade) : undefined,
    index: student.student_index,
    maxTasksPoints: (results && results.max_tasks_grade) || 0,
    presences: results ? results.presences : 0,
    tasksPoints: results ? results.tasks_grade : 0,
    userId: student.id,
    userName: student.user_name,
  };
};

const SetGrade = ({
  value,
  onChange,
}: {
  value?: Grade;
  onChange: (grade: Grade) => void;
}) => (
  <Select
    mode="single"
    showSearch
    filterOption={(input, option) =>
      String(option.props.children).startsWith(input)
    }
    value={value}
    onChange={onChange}
    css={css`
      width: 8em;
      max-width: 100%;
    `}
  >
    {Grade.grades.map(t => (
      <Select.Option key={t} value={t}>
        {t}
      </Select.Option>
    ))}
  </Select>
);

type Props = GroupApiContextState &
  RouteChildrenProps<{ id: string }> & {
    editable: boolean;
  };

export const GradesSection = ({
  actions,
  currentGroup,
  currentGroupStudents,
  editable,
  match,
}: // tslint:disable-next-line:no-big-function
Props) => {
  const [tableData, setTableData] = useState<UserResultsModel[]>([]);
  const gradeSettings = currentGroup && currentGroup.data;
  const { texts } = useContext(LocaleContext);

  const groupId = Number(match && match.params.id);
  console.assert(!Number.isNaN(groupId));

  const fetching = useRef(false);
  useEffect(() => {
    if (!currentGroup || groupId !== currentGroup.id) {
      if (fetching.current) {
        return;
      }
      fetching.current = true;
      Promise.all([
        actions.getCurrentGroup(),
        actions.listStudentsInGroup(groupId),
      ]).then(() => {
        fetching.current = false;
      });
    } else if (!currentGroupStudents) {
      if (fetching.current) {
        return;
      }
      fetching.current = true;
      actions.listStudentsInGroup(groupId).then(() => {
        fetching.current = false;
      });
    } else if (
      currentGroup &&
      currentGroupStudents &&
      groupId === currentGroup.id
    ) {
      actions.getResults().then(usersResults => {
        if (ApiResponse2.isError(usersResults)) {
          throw usersResults;
        }
        const data = currentGroupStudents.map(s => {
          const results = usersResults.data.find(
            r => Number(r.user_id) === s.id
          );
          return mergedResultsToTableItem(s, results);
        });
        setTableData(data);
      });
    }
  }, [currentGroup, currentGroupStudents]);

  const setGrade = useCallback((studentId: UserDTO['id'], grade: Grade) => {
    actions.setFinalGrade(studentId, grade).then(res => {
      if ('error' in res) {
        showMessage(res);
        return;
      }
      setTableData(tData =>
        tData.map(results => {
          if (results.userId === studentId) {
            return {
              ...results,
              finalGrade: grade,
            };
          }
          return results;
        })
      );
    });
  }, []);

  const confirmGrade = useMemo(
    () =>
      gradeSettings &&
      (async (studentResults: UserResultsModel) => {
        const [grade] = await computeGradeFromResults(
          studentResults,
          gradeSettings as Required<GroupGradeSettings>
        );
        const studentId = studentResults.userId;
        setGrade(studentId, grade);
      }),
    [gradeSettings]
  );

  const confirmAllGrades = useMemo(
    () =>
      gradeSettings &&
      (async () => {
        const newTableData = await Promise.all(
          tableData.map(async studentResults => {
            const [grade] = await computeGradeFromResults(
              studentResults,
              gradeSettings as Required<GroupGradeSettings>
            );

            return {
              ...studentResults,
              finalGrade: grade,
            };
          })
        );

        newTableData.forEach(({ userId, finalGrade }) => {
          console.log('setting final grade', finalGrade, 'for', userId);
          actions.setFinalGrade(userId, finalGrade).then(res => {
            if (ApiResponse2.isError(res)) {
              console.error(res);
            } else {
              console.log('set final grade for', userId, res.data);
              return res;
            }
          });
        });

        setTableData(newTableData);
      }),
    [gradeSettings, tableData]
  );

  const handleGradesCsvDownload = useCallback(() => {
    const mimeType = isSafari() ? 'application/csv' : 'text/csv';
    const blob = new Blob([gradesToCsv(tableData)], { type: mimeType });

    saveAs(blob, `students-results-group-${currentGroup!.id}.csv`);
  }, [tableData, currentGroup]);

  const columns = makeGradesSectionColumns({
    confirmAllGrades,
    confirmGrade,
    currentGroup,
    editable,
    setGrade,
    texts,
    omittedKeys: editable ? [] : ['confirm_grade'],
  });

  return (
    <Flex padding={theme.Padding.Standard} flexDirection="column">
      <Button
        type="primary"
        icon="download"
        onClick={handleGradesCsvDownload}
        aria-label={texts.exportCsv}
        style={{ width: 200, marginBottom: '10px' }}
      >
        {texts.exportCsv}
      </Button>
      <Table<UserResultsModel>
        sortDirections={sortDirections}
        rowKey={(i: UserResultsModel) => i.userId.toString()}
        columns={columns}
        dataSource={tableData}
        pagination={false}
        bordered
      />
    </Flex>
  );
};

export function makeGradesSectionColumns({
  currentGroup,
  confirmGrade,
  confirmAllGrades,
  editable,
  setGrade,
  omittedKeys,
  texts,
}: {
  currentGroup?: GroupDTO;
  confirmGrade?: (studentResults: UserResultsModel) => Promise<void>;
  confirmAllGrades?: () => Promise<void>;
  editable?: boolean;
  setGrade?: (studentId: number, grade: Grade) => void;
  omittedKeys: readonly string[];
  texts: Locale;
}) {
  const omittedKeysSet = new Set(omittedKeys);

  return [
    {
      dataIndex: 'userName',
      key: 'name',
      sorter: makeTableSorter('userName'),
      title: 'Imię i nazwisko',
      width: 200,
    },
    {
      dataIndex: 'index',
      key: 'index',
      sorter: makeTableSorter<UserResultsModel>(x => x.index || 0),
      title: 'Index',
      width: 100,
    },
    {
      key: 'tasks_grade',
      render: (item: UserResultsModel) => (
        <Flex justifyContent="center" flexDirection="row">
          {item.tasksPoints} /
          <b style={{ paddingLeft: 5 }}>{item.maxTasksPoints}</b>
        </Flex>
      ),
      sorter: makeTableSorter('tasksPoints'),
      title: texts.testsAndTasks,
      width: 120,
    },
    {
      align: 'center' as const,
      key: 'meetings_grade',
      render: (item: UserResultsModel) => item.presences + item.activity,
      sorter: makeTableSorter<UserResultsModel>(x => x.presences + x.activity),
      title: texts.presenceAndActivity,
      width: 120,
    },
    {
      align: 'center' as const,
      key: 'suggested_grade',
      render: (item: UserResultsModel) => (
        <SuggestedGrade userResults={item} currentGroup={currentGroup} />
      ),
      title: texts.suggestedGrade,
      width: 100,
    },
    {
      align: 'center' as const,
      key: 'confirm_grade',
      render: (studentResults: UserResultsModel) => (
        <ArrowRightButton
          title="Zatwierdź ocenę"
          alt="Zatwierdź ocenę"
          disabled={!confirmGrade}
          onClick={confirmGrade && (() => confirmGrade(studentResults))}
        />
      ),
      title: (
        <p
          css={css`
            margin: 0;
          `}
        >
          Zatwierdź
          <br />
          <a role="button" onClick={confirmAllGrades}>
            (wszystkie)
          </a>
        </p>
      ),
      width: 50,
    },
    {
      key: 'set_grade',
      render: (studentResults: UserResultsModel) =>
        editable ? (
          <SetGrade
            value={studentResults.finalGrade}
            onChange={grade => setGrade!(studentResults.userId, grade)}
          />
        ) : (
          <Flex justifyContent="center">
            {studentResults.finalGrade || '-'}
          </Flex>
        ),
      sorter: (a: UserResultsModel, b: UserResultsModel) =>
        Number((a.finalGrade || 0) < (b.finalGrade || 0)),
      title: texts.finalGrade,
      width: 150,
    },
  ].filter(col => !omittedKeysSet.has(col.key));
}
