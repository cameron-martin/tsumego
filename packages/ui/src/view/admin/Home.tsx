import { useCallback } from 'react';
import {
  Paper,
  RootRef,
  makeStyles,
  createStyles,
  Container,
} from '@material-ui/core';
import { useDropzone } from 'react-dropzone';
import React from 'react';
import { ApiClient } from '@tsumego/api-client';

interface Props {
  apiClient: ApiClient;
}

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      padding: theme.spacing(3, 2),
    },
  }),
);

export default function Home({ apiClient }: Props) {
  const classes = useStyles();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      apiClient.puzzle.create(file);
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const { ref, ...rootProps } = getRootProps({ className: classes.root });

  return (
    <Container>
      <RootRef rootRef={ref}>
        <Paper {...rootProps}>
          <input {...getInputProps()} />

          <p>Drag SGFs here</p>
        </Paper>
      </RootRef>
    </Container>
  );
}
