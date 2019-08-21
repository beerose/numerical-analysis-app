import { MeetingDetailsModel, MeetingDTO } from '../../../../dist/common';

const HEADER = 'name; index; presences; activities';

const renameKeys = (
  obj: Record<number, any>,
  newKeys: Record<number, string>
) => {
  const keyValues = Object.keys(obj).map((key: any) => {
    const newKey = newKeys[key] || key;
    return { [newKey]: obj[key] };
  });
  return Object.assign({}, ...keyValues);
};

const meetingsIdsToNames = (meetings: MeetingDTO[]) => {
  const meetingsIdsNamesMap: Record<number, string> = {};
  meetings.forEach(m => {
    meetingsIdsNamesMap[m.id] = `${new Date(m.date).toLocaleDateString()} ${
      m.meeting_name
    }`;
  });
  return meetingsIdsNamesMap;
};

const studentMeetingDetailsToCsvRow = (
  studentDetails: MeetingDetailsModel,
  meetingsMap: Record<number, string>
) => {
  const { user_name: name, student_index: index } = studentDetails.student;
  const presences: string[] = Array.from(studentDetails.data.presences).map(
    m => meetingsMap[m]
  );

  const presencesAndActivities = renameKeys(
    studentDetails.data.activities,
    meetingsMap
  );

  return [
    name,
    index,
    presences.join(','),
    JSON.stringify(presencesAndActivities),
  ].join(';');
};

export const meetingsDetailsToCsv = (
  meetingsDetails: MeetingDetailsModel[],
  meetings: MeetingDTO[]
) => {
  const meetingsMap = meetingsIdsToNames(meetings);

  return (
    HEADER +
    '\n' +
    meetingsDetails
      .map(m => studentMeetingDetailsToCsvRow(m, meetingsMap))
      .join('\n')
  );
};
