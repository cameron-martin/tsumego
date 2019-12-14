import React from 'react';
import { RouteComponentProps } from '@reach/router';

interface Props<T> extends RouteComponentProps {
  page(): Promise<{ default: React.ComponentType<T> }>;
  props: T;
}

export default function RouterPage<T>(props: Props<T>) {
  return React.createElement(React.lazy(props.page), props.props as any);
}
