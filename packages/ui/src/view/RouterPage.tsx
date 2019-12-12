import { RouteComponentProps } from '@reach/router';

interface Props extends RouteComponentProps {
  element: React.ReactElement | null;
}

export default function RouterPage(props: Props) {
  return props.element;
}
