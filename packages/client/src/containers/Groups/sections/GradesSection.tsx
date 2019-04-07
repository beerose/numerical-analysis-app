/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Button, Select, Spin } from 'antd';
import {
  ApiResponse,
  getGradeFromTresholds,
  Grade,
  GroupDTO,
  Tresholds,
  UserDTO,
  UserResultsDTO,
  UserResultsModel,
  UserWithGroups,
} from 'common';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { RouteComponentProps } from 'react-router';

import { Flex, Table, Theme } from '../../../components';
import { LocaleContext } from '../../../components/locale';
import { ArrowRightButton } from '../../../components/ArrowRightButton';
import { gradesToCsv, isSafari } from '../../../utils/';
import { tresholdsKeys } from '../components/GradeTresholdsList';
import { GroupApiContextState } from '../GroupApiContext';

// TODO Use Grade Equation, add meetings points
function computeGradeFromResults(
  studentResults: UserResultsModel,
  tresholds: Tresholds
) {
  const { tasksPoints, maxTasksPoints } = studentResults;

  const pointsPercentage = (tasksPoints / maxTasksPoints) * 100;
  return getGradeFromTresholds(pointsPercentage, tresholds);
}

const SuggestedGrade: React.FC<{
  userResults: UserResultsModel;
  currentGroup?: GroupDTO;
}> = ({ userResults, currentGroup }) => {
  if (!currentGroup || !currentGroup.data) {
    return <Spin />;
  }
  const tresholds = currentGroup.data.tresholds;
  if (!tresholds) {
    return <Fragment>Brak odpowiednich ustawień</Fragment>;
  }

  return <Fragment>{computeGradeFromResults(userResults, tresholds)}</Fragment>;
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
    finalGrade: final && final.grade,
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
  value?: UserResultsModel['finalGrade'];
  onChange: (grade: number) => void;
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
      <Select.Option key={t} value={Number(t)}>
        {t}
      </Select.Option>
    ))}
  </Select>
);

type Props = GroupApiContextState & Pick<RouteComponentProps, 'history'>;

// TODO FIXME
// tslint:disable-next-line:max-func-body-length
export const GradesSection = ({
  actions,
  currentGroup,
  currentGroupStudents,
}: Props) => {
  const [tableData, setTableData] = useState<UserResultsModel[]>([]);

  useEffect(() => {
    if (!currentGroupStudents) {
      actions.listStudentsWithGroup();
    } else if (currentGroup) {
      actions.getResults().then(usersResults => {
        const data = currentGroupStudents.map(s => {
          const results = usersResults.find(r => r.user_id === s.id);
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
      currentGroup &&
      currentGroup.data &&
      currentGroup.data.tresholds &&
      ((studentResults: UserResultsModel) => {
        const grade = computeGradeFromResults(
          studentResults,
          currentGroup!.data!.tresholds!
        );
        const studentId = studentResults.userId;
        setGrade(studentId, grade);
      }),
    [currentGroup]
  );

  const handleGradesCsvDownload = useCallback(() => {
    const mimeType = isSafari() ? 'application/csv' : 'text/csv';
    const blob = new Blob([gradesToCsv(tableData)], { type: mimeType });

    saveAs(blob, `students-results-group-${currentGroup!.id}.csv`);
  }, [tableData, currentGroup]);

  const columns = [
    {
      title: 'Imię i nazwisko',
      dataIndex: 'userName',
      key: 'name',
      width: 200,
    },
    { title: 'Index', dataIndex: 'index', key: 'index', width: 100 },
    {
      title: `Testy i zadania`,
      key: 'tasks_grade',
      width: 120,
      render: (item: UserResultsModel) => (
        <Flex justifyContent="center" flexDirection="row">
          {item.tasksPoints} /
          <b style={{ paddingLeft: 5 }}>{item.maxTasksPoints}</b>
        </Flex>
      ),
    },
    {
      title: 'Obecności i aktywności',
      key: 'meetings_grade',
      width: 120,
      render: (item: UserResultsModel) => (
        <Flex justifyContent="center">{item.presences + item.activity}</Flex>
      ),
    },
    {
      title: `Proponowana ocena`,
      key: 'suggested_grade',
      width: 100,
      render: (item: UserResultsModel) => (
        <Flex justifyContent="center" fontWeight="bold">
          <SuggestedGrade userResults={item} currentGroup={currentGroup} />
        </Flex>
      ),
    },
    {
      title: (
        <p
          css={css`
            text-align: center;
            margin: 0;
          `}
        >
          Zatwierdź
          <br />
          <a role="button" onClick={() => console.log('wszystkie')}>
            (wszystkie)
          </a>
        </p>
      ),
      key: 'confirm_grade',
      width: 50,
      render: (studentResults: UserResultsModel) => (
        <ArrowRightButton
          alt="Zatwierdź"
          disabled={!confirmGrade}
          onClick={confirmGrade && (() => confirmGrade(studentResults))}
        />
      ),
    },
    {
      title: `Wystawiona ocena`,
      key: 'set_grade',
      width: 150,
      render: (studentResults: UserResultsModel) => (
        <SetGrade
          value={studentResults.finalGrade}
          onChange={grade => setGrade(studentResults.userId, grade)}
        />
      ),
    },
  ];

  console.log({ tableData });
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
