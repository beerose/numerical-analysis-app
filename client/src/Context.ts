import * as React from 'react';

export const { Consumer, Provider } = React.createContext({
    userAuth: false,
    userName: "",
    userRole: "",
    dispatch: ({}: any) => { null },
    error: false,
    errorMessage: "",
});
