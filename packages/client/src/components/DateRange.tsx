/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { Colors } from '../utils';
export const DateRange = ({ start, end }: { start: string; end: string }) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const now = new Date();
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
        {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
      </p>
    </span>
  );
};
