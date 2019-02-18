import { Breadcrumb, Icon } from 'antd';
import * as React from 'react';
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
  replace?: (s: string) => string;
};

export const Breadcrumbs = withRouter(
  ({ location, className, replace = identity }: BreadcrumbsProps) => {
    const pathSnippets = location.pathname.split('/').filter(Boolean);

    return (
      <LocaleContext.Consumer>
        {({ getText }) => (
          <Breadcrumb className={className}>
            {homeBreadcrumb}
            {pathSnippets.map((token, index) => (
              <Breadcrumb.Item key={token + index}>
                <Link to={`/${pathSnippets.slice(0, index + 1).join('/')}`}>
                  {replace(getText(token) || token)}
                </Link>
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>
        )}
      </LocaleContext.Consumer>
    );
  }
);
