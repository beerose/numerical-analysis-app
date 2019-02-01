/** @jsx jsx */
import { css, jsx, ObjectInterpolation } from '@emotion/core';
import { CSSProperties, forwardRef, ReactNode, ReactType } from 'react';

type FlexProps = CSSProperties & {
  children?: ReactNode;
  theme?: object;
  // tslint:disable-next-line:no-reserved-keywords
  as?: ReactType<any>;
  className?: string;
  // shortcut props
  center?: boolean;
  inline?: boolean;
  size?: string | number;
};

export const Flex = forwardRef(
  (
    {
      children,
      theme,
      as: Element = 'div',
      className,
      // shortcut props
      center,
      inline,
      size,
      ...styles
    }: FlexProps,
    ref
  ) =>
    jsx(
      Element,
      {
        className,
        ref,
        css: css(
          styles as ObjectInterpolation<undefined>,
          { display: inline ? 'inline-flex' : 'flex' },
          size && { height: size, width: size },
          center && { justifyContent: 'center', alignItems: 'center' }
        ),
      },
      children
    )
);
