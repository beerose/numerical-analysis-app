export interface ApiResponse {
    message?: string;
    error?: string;
}
export declare const ROUTES: {
    ACCOUNTS: {
        login: string;
        me: string;
    };
    GROUPS: {
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
