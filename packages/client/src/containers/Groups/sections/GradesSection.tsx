/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Button, Select, Spin } from 'antd';
import {
  ApiResponse,
  getGradeFromTresholds,
  GroupDTO,
  UserDTO,
  UserResultsDTO,
  UserResultsModel,
  UserWithGroups,
} from 'common';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';

import { Flex, Table, Theme } from '../../../components';
import { LocaleContext } from '../../../components/locale';
import { ArrowRightButton } from '../../../components/ArrowRightButton';
import { gradesToCsv, isSafari } from '../../../utils/';
import { tresholdsKeys } from '../components/GradeTresholdsList';
import { GroupApiContextState } from '../GroupApiContext';

const SuggestedGrade: React.FC<{
  userResults: UserResultsModel;
  currentGroup?: GroupDTO;
}> = ({ userResults, currentGroup }) => {
  if (!currentGroup || !currentGroup.data) {
    return <Spin />;
  }
  const tresholds = currentGroup.data.tresholds;
  if (!tresholds) {
    return <Fragment>'Brak odpowiednich ustawień'</Fragment>;
  }

  const { tasksPoints, maxTasksPoints } = userResults;

  // TO DO: add meetings points
  const pointsPercentage = (tasksPoints / maxTasksPoints) * 100;

  return (
    <Fragment>{getGradeFromTresholds(pointsPercentage, tresholds)}</Fragment>
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
  item,
  setFinalGrade,
}: {
  item: UserResultsModel;
  setFinalGrade: (userId: UserDTO['id'], grade: number) => Promise<ApiResponse>;
}) => {
  const [isEditing, setEditing] = useState<boolean>(false);
  const [gradeValue, setGradeValue] = useState<number | undefined>(
    item.finalGrade
  );

  const handleClick = () => {
    if (isEditing) {
      if (!gradeValue) {
        setGradeValue(2);
      }
      setFinalGrade(item.userId, gradeValue || 2);
      setEditing(false);
    } else {
      setEditing(true);
    }
  };

  return (
    <Flex justifyContent="center" alignItems="center">
      {isEditing ? (
        <Select
          mode="single"
          showArrow
          defaultValue={gradeValue || 2}
          onChange={e => setGradeValue(e)}
        >
          {['2', ...tresholdsKeys].map(t => (
            <Select.Option key={t} value={Number(t)}>
              {t}
            </Select.Option>
          ))}
        </Select>
      ) : (
        <b>{gradeValue || '-'}</b>
      )}
      <a role="button" style={{ paddingLeft: 20 }} onClick={handleClick}>
        {isEditing ? 'zapisz' : 'edytuj'}
      </a>
    </Flex>
  );
};

type Props = GroupApiContextState & Pick<RouteComponentProps, 'history'>;

// TODO FIXME
// tslint:disable-next-line:max-func-body-length
export const GradesSection = ({
  actions,
  currentGroup,
  currentGroupStudents,
}: Props) => {
  const [usersResults, setUsersResults] = useState<UserResultsDTO[] | null>(
    null
  );
  const [tableData, setTableData] = useState<UserResultsModel[]>([]);

  useEffect(() => {
    if (!currentGroupStudents) {
      actions.listStudentsWithGroup();
    }
    if (!usersResults) {
      actions.getResults().then(res => {
        setUsersResults(res);
      });
    }

    if (currentGroupStudents && currentGroup && usersResults) {
      const data = currentGroupStudents.map(s => {
        const results = usersResults.find(r => r.user_id === s.id);
        return mergedResultsToTableItem(currentGroup.id, s, results);
      });
      setTableData(data);
    }
  }, [usersResults, currentGroupStudents]);

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
      render: () => (
        <ArrowRightButton
          alt="Zatwierdź"
          onClick={() => console.log('zatwierdz')}
        />
      ),
    },
    {
      title: `Wystawiona ocena`,
      key: 'set_grade',
      width: 150,
      render: (item: UserResultsModel) => (
        <SetGrade item={item} setFinalGrade={actions.setFinalGrade} />
      ),
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
