export interface ApiResponse {
    message?: string;
    error?: string;
}
export declare const ROUTES: {
    ACCOUNTS: {
        login: string;
        new: string;
    };
    GROUPS: {
        add: string;
        add_meetings: string;
        add_student: string;
        delete_student: string;
        details: string;
        list: string;
        list_meetings: string;
        students: string;
        update_student: string;
        upload: string;
    };
    USERS: {
        add: string;
        delete: string;
        list: string;
        update: string;
    };
};
export declare type UserDTO = {
    id?: string;
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
    group_type: GroupEnum;
    academic_year?: string;
    class?: number;
    data?: Record<string, any>;
};
export declare enum GroupEnum {
    Exercise = "\u0106wiczenia",
    Lab = "Pracownia",
    Lecture = "Wyk\u0142ad"
}
export declare type MeetingDTO = {
    id: number;
    meeting_name: string;
    date: string;
    group_id?: number;
    created_at?: number;
    updated_at?: number;
};
