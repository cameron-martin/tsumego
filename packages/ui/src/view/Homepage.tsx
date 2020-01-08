import React from 'react';
import {
  Container,
  Typography,
  Button,
  makeStyles,
  CardContent,
  Card,
  CardActions,
} from '@material-ui/core';
import { ApiClient } from '@tsumego/api-client';
import { useAuth } from './auth/AuthProvider';
import { getSignupUrl } from './auth/urls';
import { AppConfig } from '../config';
import Puzzle from './Puzzle';

interface Props {
  apiClient: ApiClient;
  config: AppConfig;
}

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(2),
  },
}));

export default function Homepage({ apiClient, config }: Props) {
  const isLoggedIn = useAuth();
  const classes = useStyles();

  if (isLoggedIn) {
    return <Puzzle apiClient={apiClient} />;
  } else {
    return (
      <Container maxWidth="sm" className={classes.root}>
        <Card>
          <CardContent>
            <Typography variant="body1" gutterBottom>
              Tsumego.app gives you puzzles of the correct difficulty based on
              your previous results.
            </Typography>
            <Typography variant="body1" gutterBottom>
              For this, you&rsquo;ll need to create an account.
            </Typography>
          </CardContent>
          <CardActions>
            <Button href={getSignupUrl(config)} color="primary">
              Sign up
            </Button>
          </CardActions>
        </Card>
      </Container>
    );
  }
}
