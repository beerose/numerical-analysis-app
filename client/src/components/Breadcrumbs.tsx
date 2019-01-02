import { Breadcrumb, Icon } from 'antd';
import React from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';

import { LocaleContext } from './locale';

const homeBreadcrumb = (
  <Breadcrumb.Item key="home">
    <Link to="/">
      <Icon type="home" />
    </Link>
  </Breadcrumb.Item>
);

type BreadcrumbsProps = RouteComponentProps & { className?: string };

export const Breadcrumbs = withRouter(
  ({ location, className }: BreadcrumbsProps) => {
    const pathSnippets = location.pathname.split('/').filter(Boolean);

    return (
      <Breadcrumb className={className}>
        {homeBreadcrumb}
        <LocaleContext.Consumer>
          {({ getText }) =>
            pathSnippets.map((token, index) => (
              <Breadcrumb.Item key={token + index}>
                <Link to={`/${pathSnippets.slice(0, index + 1).join('/')}`}>
                  {getText(token) || token}
                </Link>
              </Breadcrumb.Item>
            ))
          }
        </LocaleContext.Consumer>
      </Breadcrumb>
    );
  }
);
