import React from 'react';
import {
  makeStyles,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  DrawerProps,
  ListItemText,
  Divider,
} from '@material-ui/core';
import {
  SportsEsports as SportsEsportsIcon,
  Mail as MailIcon,
} from '@material-ui/icons';
import RouterLink from 'next/link';

interface Props {
  open: boolean;
  onClose: DrawerProps['onClose'];
}

const useStyles = makeStyles({
  list: {
    width: 250,
  },
});

export default function SideMenu({ open, onClose }: Props) {
  const classes = useStyles();

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <List className={classes.list}>
        <RouterLink href="/play" passHref>
          <ListItem button component="a">
            <ListItemIcon>
              <SportsEsportsIcon />
            </ListItemIcon>
            <ListItemText primary="Play" />
          </ListItem>
        </RouterLink>
      </List>
      <Divider />
      <List>
        <ListItem button component="a" href="mailto:cameronmartin123@gmail.com">
          <ListItemIcon>
            <MailIcon />
          </ListItemIcon>
          <ListItemText primary="Contact Us" />
        </ListItem>
      </List>
    </Drawer>
  );
}
