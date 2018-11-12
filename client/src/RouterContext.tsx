import * as React from 'react';

type RouterContext = {
  routerActions: {
    goBack: () => void;
    goToGroup: (id: string) => void;
    goToNewGroup: () => void;
    goToGroupsPage: () => void;
    goToMainPage: () => void;
    goToUsersList: () => void;
  };
};

export const { Consumer: RouterConsumer, Provider: RouterProvider } = React.createContext<
  RouterContext
>({} as RouterContext);
