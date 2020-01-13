import React from 'react';
import clsx from 'clsx';
import { Typography, makeStyles, Paper, Button } from '@material-ui/core';
import { SvgIconComponent } from '@material-ui/icons';

interface Props {
  title: string;
  description: string;
  icon: SvgIconComponent;
  ctaUrl: string;
  ctaText: string;
  className?: string;
}

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  icon: {
    fontSize: theme.typography.h1.fontSize,
    marginBottom: theme.spacing(4),
  },
  button: {
    marginTop: theme.spacing(4),
  },
  description: {
    flexGrow: 1,
  },
}));

export default function FeatureCard({
  title,
  icon: Icon,
  description,
  className,
  ctaText,
  ctaUrl,
}: Props) {
  const classes = useStyles();

  return (
    <Paper className={clsx(className, classes.root)} elevation={2}>
      <Icon fontSize="large" className={classes.icon} />
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" gutterBottom className={classes.description}>
        {description}
      </Typography>
      <Button
        href={ctaUrl}
        variant="contained"
        color="primary"
        className={classes.button}
      >
        {ctaText}
      </Button>
    </Paper>
  );
}
