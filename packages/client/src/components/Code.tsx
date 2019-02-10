/** @jsx jsx */
import { jsx } from '@emotion/core';

import { Fonts } from '../utils/fonts';

export type CodeProps = React.ComponentProps<'code'> & { inline?: boolean };

export const Code: React.FC<CodeProps> = props => {
  const code = (
    <code
      css={{
        fontFamily: Fonts.Monospace,
      }}
      {...props}
    />
  );

  return props.inline ? code : <pre>{code}</pre>;
};
