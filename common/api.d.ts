import { GROUPS } from './groups';
export interface ApiResponse {
    message?: string;
    error?: string;
}
export declare const Routes: {
    Accounts: {
        Login: string;
        New: string;
    };
    Groups: {
        Create: string;
        Get: string;
        List: string;
        Meetings: {
            Create: string;
            Delete: string;
            List: string;
        };
        Students: {
            AddToGroup: string;
            List: string;
            RemoveFromGroup: string;
            UpdateStudent: string;
        };
        Upload: string;
    };
    Users: {
        Create: string;
        Delete: string;
        List: string;
        Update: string;
    };
};
export declare type UserDTO = {
    id: string;
    user_name: string;
    email: string;
    student_index?: string;
    user_role: string;
};
export declare type Pagination = {
    offset: number;
    limit: number;
};
export declare type GroupDTO = {
    id: string;
    group_name: string;
    group_type: GROUPS;
    academic_year?: string;
    class?: string;
    data?: Record<string, unknown>;
};
export declare enum GroupEnumUI {
    Exercise = "\u0106wiczenia",
    Lab = "Pracownia",
    Lecture = "Wyk\u0142ad"
}
export declare type MeetingDTO = {
    id: number;
    meeting_name: string;
    date: string;
    group_id: number;
};
