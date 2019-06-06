import { css } from '@emotion/core';

import { Colors } from '../utils';
export const DateRange = ({ start, end }: { start: string; end: string }) => {
  const startDate = new Date(Date.parse(start)).toLocaleString();
  const endDate = new Date(Date.parse(end)).toLocaleString();
  const now = new Date().toLocaleString();
  return (
    <span>
      <p
        css={css`
          font-weight: bold;
        `}
      >
        Oddawanie zadania:
      </p>
      <p
        css={css({
          color: startDate < now && endDate > now ? 'green' : Colors.Blackish,
        })}
      >
        {startDate} - {endDate}
      </p>
    </span>
  );
};
