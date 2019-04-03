/** @jsx jsx */
import { css, jsx, keyframes } from '@emotion/core';
import VisuallyHidden from '@reach/visually-hidden';
import { Button, Icon, Select, Spin } from 'antd';
import {
  ApiResponse,
  GroupDTO,
  UserDTO,
  UserResultsDTO,
  UserResultsModel,
  UserWithGroups,
} from 'common';
import { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';

import { Flex, Table, Theme } from '../../../components';
import { LocaleContext } from '../../../components/locale';
import { ResetButton } from '../../../components/ResetButton';
import { gradesToCsv, isSafari } from '../../../utils/';
import { tresholdsKeys } from '../components/GradeTresholdsList';
import { GroupApiContextState } from '../GroupApiContext';

const pointRight = keyframes`
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(5px);
  }
  100% {
    transform: translateX(0);
  }
`;

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
export const GradesSection = (props: Props) => {
  const [usersResults, setUsersResults] = useState<UserResultsDTO[] | null>(
    null
  );
  const [tableData, setTableData] = useState<UserResultsModel[]>([]);

  useEffect(() => {
    const { currentGroupStudents, currentGroup } = props;
    if (!currentGroupStudents) {
      props.actions.listStudentsWithGroup();
    }
    if (!usersResults) {
      props.actions.getResults().then(res => {
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
  }, [usersResults, props.currentGroupStudents]);

  const handleGradesCsvDownload = () => {
    const mimeType = isSafari() ? 'application/csv' : 'text/csv';
    const blob = new Blob([gradesToCsv(tableData)], { type: mimeType });

    saveAs(blob, `students-results-group-${props.currentGroup!.id}.csv`);
  };

  const getSuggestedGrade = (
    tasksPoints: number,
    maxTasksPoints: number,
    _presences: number,
    _activity: number
  ) => {
    if (!props.currentGroup || !props.currentGroup.data) {
      return <Spin />;
    }
    const tresholds = props.currentGroup.data.tresholds;
    if (!tresholds) {
      return 'Brak odpowiednich ustawień';
    }

    // TO DO: add meetings points
    const pointsPercentage = (tasksPoints / maxTasksPoints) * 100;

    switch (true) {
      case pointsPercentage >= tresholds[5]:
        return 5;
      case pointsPercentage >= tresholds['4.5']:
        return 4.5;
      case pointsPercentage >= tresholds[4]:
        return 4;
      case pointsPercentage >= tresholds['3.5']:
        return 3.5;
      case pointsPercentage >= tresholds[3]:
        return 3;
      default:
        return 2;
    }
  };

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
          {getSuggestedGrade(
            item.tasksPoints,
            item.maxTasksPoints,
            item.presences,
            item.activity
          )}
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
        <ResetButton
          css={css`
            width: 100%;
            height: 100%;
            background: inherit;
            border: 1px solid transparent;
            &:hover {
              animation: ${pointRight} 0.5s infinite;
            }
            &:focus-visible {
              border-color: currentColor;
            }
          `}
        >
          <VisuallyHidden>Zatwierdź</VisuallyHidden>
          <Icon aria-hidden type="right" />
        </ResetButton>
      ),
    },
    {
      title: `Wystawiona ocena`,
      key: 'set_grade',
      width: 150,
      render: (item: UserResultsModel) => (
        <SetGrade item={item} setFinalGrade={props.actions.setFinalGrade} />
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
