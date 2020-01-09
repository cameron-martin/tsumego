import React from 'react';

type Props<T> = {
  page(): Promise<{ default: React.ComponentType<T> }>;
} & ({} extends T ? { props?: {} } : { props: T });

export default function RouterPage<T>(props: Props<T>) {
  return React.createElement(React.lazy(props.page), props.props as any);
}
