import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';

import { GroupApiContextState } from '../GroupApiContext';
import { Flex, Table, Theme } from '../../../components';
import { Input, Select } from 'antd';
import {
  UserDTO,
  UserResultsDTO,
  ApiResponse,
} from '../../../../../../dist/common';
import { tresholdsKeys } from '../components/GradeTresholdsList';

type TableDataItem = {
  userId: UserDTO['id'];
  userName: UserDTO['user_name'];
  index: UserDTO['student_index'];
  finalGrade?: number;
  suggestedGrade: number;
  tasksPoints: number;
  maxTasksPoints: number;
  meetingsPoints: number;
};

const SetGrade = ({
  item,
  setFinalGrade,
}: {
  item: TableDataItem;
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
        <b>{(gradeValue && gradeValue) || '-'}</b>
      )}
      <a role="button" style={{ paddingLeft: 20 }} onClick={handleClick}>
        {isEditing ? 'zapisz' : 'edytuj'}
      </a>
    </Flex>
  );
};

type Props = GroupApiContextState & Pick<RouteComponentProps, 'history'>;
export const GradesSection = (props: Props) => {
  const [usersResults, setUsersResults] = useState<UserResultsDTO[] | null>(
    null
  );
  const [tableData, setTableData] = useState<TableDataItem[]>([]);

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
        const final = s.groups_grades
          ? s.groups_grades.find(g => g.group_id === currentGroup.id)
          : undefined;
        const results = usersResults.find(r => r.user_id === s.id);
        return {
          userId: s.id,
          userName: s.user_name,
          index: s.student_index,
          finalGrade: final && final.grade,
          suggestedGrade: 5, // TO DO
          tasksPoints: results ? results.tasks_grade : 0,
          maxTasksPoints: results ? results.max_tasks_grade : 0,
          meetingsPoints: results ? results.presences : 0, // TO DO
        };
      });
      setTableData(data);
    }
  }, [usersResults, props.currentGroupStudents]);

  const columns = [
    { title: 'Imię i nazwisko', dataIndex: 'userName', key: 'name' },
    { title: 'Index', dataIndex: 'index', key: 'index' },
    {
      title: `Testy i zadania`,
      key: 'tasks_grade',
      width: 120,
      render: (item: TableDataItem) => (
        <Flex justifyContent="center">
          {item.tasksPoints} / <b>{item.maxTasksPoints}</b>
        </Flex>
      ),
    },
    {
      title: 'Obecnośći i aktywnośći',
      key: 'meetings_grade',
      width: 120,
      render: (item: TableDataItem) => (
        <Flex justifyContent="center">{item.meetingsPoints}</Flex>
      ),
    },
    {
      title: `Proponowana ocena`,
      key: 'suggested_grade',
      width: 100,
      render: (item: TableDataItem) => (
        <Flex justifyContent="center" fontWeight="bold">
          {item.suggestedGrade}
        </Flex>
      ),
    },
    {
      title: `Wystawiona ocena`,
      key: 'set_grade',
      width: 150,
      render: (item: TableDataItem) => (
        <SetGrade item={item} setFinalGrade={props.actions.setFinalGrade} />
      ),
    },
  ];

  return (
    <Flex padding={Theme.Padding.Half}>
      <Table
        rowKey={(i: TableDataItem) => i.userId.toString()}
        columns={columns}
        dataSource={tableData}
        pagination={false}
        bordered
      />
    </Flex>
  );
};
