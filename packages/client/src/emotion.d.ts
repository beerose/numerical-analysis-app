import { ComponentSelector } from '@emotion/core';
import { PropsOf } from '@emotion/styled-base/types/helper';

declare module '@emotion/styled' {
  export interface StyledComponent<
    InnerProps,
    StyleProps,
    Theme extends object
  >
    extends React.SFC<
        /**
         *
         * @see https://github.com/emotion-js/emotion/blob/master/packages/styled-base/src/index.js#L78
         */
        InnerProps & StyleProps & { theme?: Theme; as?: React.ReactType }
      >,
      ComponentSelector {}
}

