import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  makeStyles,
} from '@material-ui/core';
import { EmojiObjects, Loop } from '@material-ui/icons';
import { AppConfig } from '../../config';
import { getSignupUrl } from '../auth/urls';
import ResponsiveImage from '../ResponsiveImage';
import FeatureCard from './FeatureCard';
import heroImage from './hero.jpg';

const useStyles = makeStyles(theme => ({
  hero: {
    height: '70vh',
  },
  heroImage: {
    objectFit: 'cover',
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))',
  },
  featuresContainer: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  features: {
    display: 'flex',
    margin: theme.spacing(-2),
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  feature: {
    margin: theme.spacing(2),
    flex: '1 1 0',
  },
  tagLine: {
    textAlign: 'center',
    color: 'white',
    textShadow:
      '0px 1px 1px rgba(0,0,0,0.2), 0px 2px 2px rgba(0,0,0,0.14), 0px 1px 5px rgba(0,0,0,0.12)',
    [theme.breakpoints.down('xs')]: theme.typography.h3,
  },
}));

interface Props {
  config: AppConfig;
}

export default function SplashPage({ config }: Props) {
  const classes = useStyles();
  const signupUrl = getSignupUrl(config);

  return (
    <>
      <Box position="relative" className={classes.hero}>
        <ResponsiveImage image={heroImage} className={classes.heroImage} />
        <div className={classes.heroOverlay}>
          <Typography variant="h2" gutterBottom className={classes.tagLine}>
            Dead simple tsumego
          </Typography>
          <Button variant="contained" color="primary" href={signupUrl}>
            Start Playing
          </Button>
        </div>
      </Box>
      <Container maxWidth="md" className={classes.featuresContainer}>
        <div className={classes.features}>
          <FeatureCard
            title="Dynamic Difficulty"
            description="Tsumego.app learns your skill level and automatically gives you puzzles of the correct difficulty"
            icon={EmojiObjects}
            className={classes.feature}
            ctaText="Start playing"
            ctaUrl={signupUrl}
          />
          <FeatureCard
            title="Endless Puzzles"
            description="Thousands of puzzles, with more added regularly"
            icon={Loop}
            className={classes.feature}
            ctaText="Start playing"
            ctaUrl={signupUrl}
          />
        </div>
      </Container>
    </>
  );
}
