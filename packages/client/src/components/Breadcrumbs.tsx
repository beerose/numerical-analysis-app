import { Breadcrumb, Icon } from 'antd';
import React, { useContext, useMemo } from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';

import { identity } from '../utils/identity';

import { LocaleContext } from './locale';

const homeBreadcrumb = (
  <Breadcrumb.Item key="home">
    <Link to="/">
      <Icon type="home" />
    </Link>
  </Breadcrumb.Item>
);

type BreadcrumbsProps = RouteComponentProps & {
  className?: string;
  replaceTokens?: (s: string[]) => string[];
};

export const Breadcrumbs = withRouter(
  ({ location, className, replaceTokens = identity }: BreadcrumbsProps) => {
    const { getText } = useContext(LocaleContext);
    const { pathTokens, prettyPathTokens } = useMemo(() => {
      // tslint:disable-next-line:no-shadowed-variable
      const pathTokens = location.pathname.split('/').filter(Boolean);
      return {
        pathTokens,
        prettyPathTokens: replaceTokens(pathTokens).map(t => getText(t) || t),
      };
    }, [location, replaceTokens]);

    return (
      <Breadcrumb className={className}>
        {homeBreadcrumb}
        {pathTokens.map((token, index) => (
          <Breadcrumb.Item key={token + index}>
            <Link to={`/${pathTokens.slice(0, index + 1).join('/')}`}>
              {prettyPathTokens[index]}
            </Link>
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    );
  }
);
