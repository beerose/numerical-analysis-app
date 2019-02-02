import { ComponentSelector } from '@emotion/core';
import { PropsOf } from '@emotion/styled-base/types/helper';

declare module '@emotion/styled' {
  export interface StyledComponent<
    InnerProps,
    StyleProps,
    Theme extends object
  >
    extends React.SFC<
        InnerProps & StyleProps & { theme?: Theme; as?: React.ReactType }
      >,
      ComponentSelector {
    /**
     * @desc this method is type-unsafe
     */
    withComponent<NewTag extends keyof JSX.IntrinsicElements>(
      tag: NewTag
    ): StyledComponent<JSX.IntrinsicElements[NewTag], StyleProps, Theme>;
    withComponent<Tag extends React.ComponentType<any>>(
      tag: Tag
    ): StyledComponent<PropsOf<Tag>, StyleProps, Theme>;
  }
}
