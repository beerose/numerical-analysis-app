import React, { ComponentProps } from 'react';

type SandboxProps = Required<Pick<ComponentProps<'iframe'>, 'srcDoc'>>;
export const Sandbox: React.FC<SandboxProps> = ({ srcDoc }) => (
  <iframe sandbox="allow-scripts" srcDoc={srcDoc} style={{ display: 'none' }} />
);
