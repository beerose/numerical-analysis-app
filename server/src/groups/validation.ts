import { NextFunction, Request, Response } from 'express';
import * as codes from 'http-status-codes';

import { apiMessages } from 'common';

export const validateUploadRequest = (req: Request, res: Response, next: NextFunction) => {
  if (req.body && req.body.data && req.body.group_id) {
    return next();
  }
  return res.status(codes.BAD_REQUEST).send({ error: apiMessages.invalidUserData });
};

export const validateListStudentsForGroupRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.query && req.query.group_id) {
    return next();
  }
  return res.status(codes.BAD_REQUEST).send({ error: apiMessages.invalidListStudentsForGroupReq });
};

export const validateDeleteStudentFromGroupRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body && req.body.user_id) {
    return next();
  }
  return res
    .status(codes.BAD_REQUEST)
    .send({ error: apiMessages.invalidDeleteStudentFromGroupReq });
};

export const validateUpdateStudentRequest = (req: Request, res: Response, next: NextFunction) => {
  const user = req.body;
  if (user && user.user_name && user.email && user.id) {
    return next();
  }
  return res.status(codes.BAD_REQUEST).send({ error: apiMessages.invalidUserData });
};

export const validateAddStudentToGroupRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req.body;
  if (user && user.user_name && user.email && req.body.group_id) {
    return next();
  }

  return res.status(codes.BAD_REQUEST).send({ error: apiMessages.invalidStudentData });
};

export const validateAddMeetingRequest = (req: Request, res: Response, next: NextFunction) => {
  if (req.body && req.body.meeting.meeting_name && req.body.meeting.date) {
    return next();
  }
  return res.status(codes.BAD_REQUEST).send({ error: apiMessages.invalidAddMeetingRequest });
};

export const validateUpdateMeetingRequest = (req: Request, res: Response, next: NextFunction) => {
  if (req.body && req.body.meeting.meeting_name && req.body.meeting.date && req.body.meeting.id) {
    return next();
  }
  return res.status(codes.BAD_REQUEST).send({ error: apiMessages.invalidRequest });
};

export const validateDeleteMeetingRequest = (req: Request, res: Response, next: NextFunction) => {
  if (req.body && req.body.meeting_id) {
    return next();
  }
  return res.status(codes.BAD_REQUEST).send({ error: apiMessages.meetingIdRequired });
};

export const validateDeleteGroupRequest = (req: Request, res: Response, next: NextFunction) => {
  if (req.body && req.body.group_id) {
    return next();
  }
  return res.status(codes.BAD_REQUEST).send({ error: apiMessages.groupIdRequired });
};

export const validateCreateGroupRequest = (req: Request, res: Response, next: NextFunction) => {
  if (req.body && req.body.group_name && req.body.group_type && req.body.academic_year) {
    return next();
  }
  return res.status(codes.BAD_REQUEST).send({ error: apiMessages.invalidCreateGroupRequest });
};

export const validateGetMeetingsDetailsRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body && req.query.group_id) {
    return next();
  }
  return res.status(codes.BAD_REQUEST).send({ error: apiMessages.invalidRequest });
};

export const validateAddPresenceRequest = (req: Request, res: Response, next: NextFunction) => {
  if (req.body && req.body.meeting_id && req.body.student_id) {
    return next();
  }
  return res.status(codes.BAD_REQUEST).send({ error: apiMessages.invalidRequest });
};

export const validateDeletePresenceRequest = (req: Request, res: Response, next: NextFunction) => {
  if (req.body && req.body.meeting_id && req.body.student_id) {
    return next();
  }
  return res.status(codes.BAD_REQUEST).send({ error: apiMessages.invalidRequest });
};

export const validateSetActivityRequest = (req: Request, res: Response, next: NextFunction) => {
  if (req.body && req.body.meeting_id && req.body.student_id && req.body.points !== undefined) {
    return next();
  }
  return res.status(codes.BAD_REQUEST).send({ error: apiMessages.invalidRequest });
};
