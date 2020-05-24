import React, { useCallback } from 'react';
import { Paper, makeStyles, Container } from '@material-ui/core';
import { useDropzone } from 'react-dropzone';
import { useApiClient } from '../../src/apiClient';
import StandardTemplate from '../../src/view/StandardTemplate';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3, 2),
  },
}));

export default function Home() {
  const classes = useStyles();
  const apiClient = useApiClient();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (apiClient) {
        acceptedFiles.forEach((file) => {
          void apiClient.puzzle.create(file);
        });
      }
    },
    [apiClient],
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <StandardTemplate>
      <Container>
        <Paper {...getRootProps({ className: classes.root })}>
          <input {...getInputProps()} />

          <p>Drag SGFs here</p>
        </Paper>
      </Container>
    </StandardTemplate>
  );
}
