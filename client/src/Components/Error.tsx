import * as React from 'react';
import { Alert } from 'antd';
import { css } from 'react-emotion';

const alertStyles = css`
  margin: 25px;
`

export const ErrorMessage = ({ message } : { message: string}) => (
  <Alert
    message={message}
    description="Nastąpił błąd. Spróbuj ponownie lub zgłoś problem do administratora."
    type="error"
    className={alertStyles}
  />
);
