import { css, ObjectInterpolation } from '@emotion/core';
import {
  ComponentProps,
  CSSProperties,
  FC,
  forwardRef,
  ReactNode,
  ReactSVG,
  ReactType,
} from 'react';

import { Theme } from './Theme';

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

const _Flex = forwardRef(
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

type FlexUtilityComponent = typeof _Flex & {
  Spacer: FC<ComponentProps<typeof _Flex>>;
};
export const Flex: FlexUtilityComponent = _Flex as FlexUtilityComponent;
Flex.Spacer = () => <Flex size={Theme.Padding.Half} />;
