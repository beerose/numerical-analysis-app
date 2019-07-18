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
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { DeepRequired } from 'utility-types';

import { Flex, Table, theme } from '../../../components';
import { LocaleContext } from '../../../components/locale';
import { ArrowRightButton } from '../../../components/ArrowRightButton';
import { gradesToCsv, isSafari, showMessage, usePromise } from '../../../utils';
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

const SuggestedGrade: React.FC<GradeDisplayProps> = ({
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

const mergedResultsToTableItem = (
  groupId: GroupDTO['id'],
  student: UserWithGroups,
  results?: UserResultsDTO
) => {
  const final = student.groups_grades
    ? student.groups_grades.find(g => g.group_id === groupId)
    : undefined;

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
  Pick<RouteComponentProps, 'history'> & {
    editable: boolean;
  };

export const GradesSection = ({
  actions,
  currentGroup,
  currentGroupStudents,
  editable,
}: // tslint:disable-next-line:no-big-function
Props) => {
  const [tableData, setTableData] = useState<UserResultsModel[]>([]);
  const gradeSettings = currentGroup && currentGroup.data;

  useEffect(() => {
    if (!currentGroup) {
      actions.getGroup();
    }
    if (!currentGroupStudents) {
      actions.listStudentsInGroup();
    } else if (currentGroup) {
      actions.getResults().then(usersResults => {
        const data = currentGroupStudents.map(s => {
          const results = usersResults.find(r => Number(r.user_id) === s.id);
          return mergedResultsToTableItem(currentGroup.id, s, results);
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

        newTableData.forEach(({ userId, finalGrade }) =>
          actions.setFinalGrade(userId, finalGrade)
        );

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
    omittedKeys: editable ? [] : ['confirm_grade'],
  });

  return (
    <LocaleContext.Consumer>
      {({ texts }) => (
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
      )}
    </LocaleContext.Consumer>
  );
};

export function makeGradesSectionColumns({
  currentGroup,
  confirmGrade,
  confirmAllGrades,
  editable,
  setGrade,
  omittedKeys,
}: {
  currentGroup?: GroupDTO;
  confirmGrade?: (studentResults: UserResultsModel) => Promise<void>;
  confirmAllGrades?: () => Promise<void>;
  editable?: boolean;
  setGrade?: (studentId: number, grade: Grade) => void;
  omittedKeys: readonly string[];
}) {
  const omittedKeysSet = new Set(omittedKeys);

  return [
    {
      dataIndex: 'userName',
      key: 'name',
      sorter: (a: UserResultsModel, b: UserResultsModel) =>
        Number(a.userName < b.userName),
      title: 'Imię i nazwisko',
      width: 200,
    },
    {
      dataIndex: 'index',
      key: 'index',
      sorter: (a: UserResultsModel, b: UserResultsModel) =>
        Number((a.index || 0) < (b.index || 0)),
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
      sorter: (a: UserResultsModel, b: UserResultsModel) =>
        Number(a.tasksPoints < b.tasksPoints),
      title: `Testy i zadania`,
      width: 120,
    },
    {
      align: 'center' as const,
      key: 'meetings_grade',
      render: (item: UserResultsModel) => item.presences + item.activity,
      sorter: (a: UserResultsModel, b: UserResultsModel) =>
        Number(a.presences + a.activity < b.presences + b.activity),
      title: 'Obecności i aktywności',
      width: 120,
    },
    {
      align: 'center' as const,
      key: 'suggested_grade',
      render: (item: UserResultsModel) => (
        <SuggestedGrade userResults={item} currentGroup={currentGroup} />
      ),
      title: 'Proponowana ocena',
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
      title: `Wystawiona ocena`,
      width: 150,
    },
  ].filter(col => !omittedKeysSet.has(col.key));
}
