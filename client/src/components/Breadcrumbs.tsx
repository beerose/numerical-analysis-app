import { Breadcrumb } from 'antd';
import React from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';

const homeBreadcrumb = (
  <Breadcrumb.Item key="home">
    <Link to="/">Home</Link>
  </Breadcrumb.Item>
);

const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1);

type BreadcrumbsProps = RouteComponentProps;

export const Breadcrumbs = withRouter(({ location, className }: BreadcrumbsProps) => {
  const pathSnippets = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSnippets.map((token, index) => (
    <Breadcrumb.Item key={token + index}>
      <Link to={`/${pathSnippets.slice(0, index + 1).join('/')}`}>{capitalize(token)}</Link>
    </Breadcrumb.Item>
  ));

  return (
    <Breadcrumb className={className}>
      {homeBreadcrumb}
      {breadcrumbs}
    </Breadcrumb>
  );
});
