export interface ApiResponse {
    message?: string;
    error?: string;
}
export declare const ROUTES: {
    USERS: {
        list: string;
        add: string;
        update: string;
        delete: string;
    };
};
export declare type UserDTO = {
    id?: string;
    user_name?: string;
    email?: string;
    student_index?: string;
    user_role?: string;
};
