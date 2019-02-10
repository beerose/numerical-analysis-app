/** @jsx jsx */
import { jsx } from '@emotion/core';

import { Fonts } from '../utils/fonts';

export type CodeProps = React.ComponentProps<'code'> & { inline?: boolean };

export const Code: React.FC<CodeProps> = ({ inline, ...rest }) => {
  const code = (
    <code
      css={{
        fontFamily: Fonts.Monospace,
      }}
      {...rest}
    />
  );

  return inline ? code : <pre>{code}</pre>;
};
