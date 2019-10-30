import { classes, vars } from './FixedAspectRatio.st.css';
import React from 'react';

interface Props {
  aspectRatio: number;
  children: React.ReactNode;
}

export default function FixedAspectRatio(props: Props) {
  return (
    <div
      className={classes.root}
      style={{ [vars.aspectRatio]: props.aspectRatio }}
    >
      <div className={classes.inner}>{props.children}</div>
    </div>
  );
}
