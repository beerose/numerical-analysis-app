/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Button, Select, Spin } from 'antd';
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

import { Flex, Table, Theme } from '../../../components';
import { LocaleContext } from '../../../components/locale';
import { ArrowRightButton } from '../../../components/ArrowRightButton';
import { gradesToCsv, isSafari, usePromise } from '../../../utils/';
import { evalEquation } from '../components/evalEquation';
import { tresholdsKeys } from '../components/GradeTresholdsList';
import { GroupApiContextState } from '../GroupApiContext';

async function computeGradeFromResults(
  studentResults: UserResultsModel,
  { tresholds, grade_equation: gradeEquation }: DeepRequired<GroupDTO>['data']
) {
  const { tasksPoints, presences, activity } = studentResults;

  const points = await evalEquation(
    {
      activity,
      presence: presences,
      tasks: tasksPoints,
    },
    gradeEquation
  );

  return getGradeFromTresholds(points, tresholds);
}

type GradeDisplayProps = {
  userResults: UserResultsModel;
  currentGroup?: GroupDTO;
};

const ComputedGrade: React.FC<Required<GradeDisplayProps>> = ({
  userResults,
  currentGroup,
}) => {
  const grade = usePromise(
    () =>
      computeGradeFromResults(userResults, currentGroup.data as DeepRequired<
        GroupDTO
      >['data']),
    '',
    []
  );

  return <Fragment>{grade}</Fragment>;
};

const SuggestedGrade: React.FC<GradeDisplayProps> = ({
  userResults,
  currentGroup,
}) => {
  if (!currentGroup || !currentGroup.data) {
    return <Spin />;
  }
  if (!currentGroup.data.tresholds || !currentGroup.data.grade_equation) {
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
    finalGrade: final && Grade(final.grade),
    index: student.student_index,
    maxTasksPoints: results ? results.max_tasks_grade : 0,
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
    {['2', ...tresholdsKeys].map(t => (
      <Select.Option key={t} value={Grade(Number(t))}>
        {t}
      </Select.Option>
    ))}
  </Select>
);

type Props = GroupApiContextState & Pick<RouteComponentProps, 'history'>;

export const GradesSection = ({
  actions,
  currentGroup,
  currentGroupStudents,
}: Props) => {
  const [tableData, setTableData] = useState<UserResultsModel[]>([]);
  const gradeSettings = currentGroup && currentGroup.data;

  useEffect(() => {
    if (!currentGroupStudents) {
      actions.listStudentsWithGroup();
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
    // TODO: Handle error, revert state change.
    actions.setFinalGrade(studentId, grade);

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
  }, []);

  const confirmGrade = useMemo(
    () =>
      gradeSettings &&
      (async (studentResults: UserResultsModel) => {
        const grade = await computeGradeFromResults(
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
            const grade = await computeGradeFromResults(
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
    [gradeSettings]
  );

  const handleGradesCsvDownload = useCallback(() => {
    const mimeType = isSafari() ? 'application/csv' : 'text/csv';
    const blob = new Blob([gradesToCsv(tableData)], { type: mimeType });

    saveAs(blob, `students-results-group-${currentGroup!.id}.csv`);
  }, [tableData, currentGroup]);

  const columns = [
    {
      dataIndex: 'userName',
      key: 'name',
      title: 'Imię i nazwisko',
      width: 200,
    },
    { title: 'Index', dataIndex: 'index', key: 'index', width: 100 },
    {
      key: 'tasks_grade',
      render: (item: UserResultsModel) => (
        <Flex justifyContent="center" flexDirection="row">
          {item.tasksPoints} /
          <b style={{ paddingLeft: 5 }}>{item.maxTasksPoints}</b>
        </Flex>
      ),
      title: `Testy i zadania`,
      width: 120,
    },
    {
      key: 'meetings_grade',
      render: (item: UserResultsModel) => (
        <Flex justifyContent="center">{item.presences + item.activity}</Flex>
      ),
      title: 'Obecności i aktywności',
      width: 120,
    },
    {
      key: 'suggested_grade',
      render: (item: UserResultsModel) => (
        <Flex justifyContent="center" fontWeight="bold">
          <SuggestedGrade userResults={item} currentGroup={currentGroup} />
        </Flex>
      ),
      title: `Proponowana ocena`,
      width: 100,
    },
    {
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
            text-align: center;
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
      render: (studentResults: UserResultsModel) => (
        <SetGrade
          value={studentResults.finalGrade}
          onChange={grade => setGrade(studentResults.userId, grade)}
        />
      ),
      title: `Wystawiona ocena`,
      width: 150,
    },
  ];

  return (
    <LocaleContext.Consumer>
      {({ texts }) => (
        <Flex padding={Theme.Padding.Standard} flexDirection="column">
          <Button
            type="primary"
            icon="download"
            onClick={handleGradesCsvDownload}
            aria-label={texts.exportCsv}
            style={{ width: 200, marginBottom: '10px' }}
          >
            {texts.exportCsv}
          </Button>
          <Table
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
