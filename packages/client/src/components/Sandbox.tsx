import React, { ComponentProps } from 'react';

type SandboxProps = Required<Pick<ComponentProps<'iframe'>, 'srcDoc'>>;
export const Sandbox: React.FC<SandboxProps> = ({ srcDoc }) => (
  // tslint:disable-next-line:react-a11y-iframes
  <iframe sandbox="allow-scripts" srcDoc={srcDoc} css={{ display: 'none' }} />
);
