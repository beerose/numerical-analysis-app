/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Alert } from 'antd';

const alertStyles = css`
  margin: 25px;
`;

export const ErrorMessage = ({ message }: { message: string }) => (
  <Alert
    message={message}
    description="Nastąpił błąd. Spróbuj ponownie lub zgłoś problem do administratora."
    type="error"
    className={alertStyles}
  />
);
