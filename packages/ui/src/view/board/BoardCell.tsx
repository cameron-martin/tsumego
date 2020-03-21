import React from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import clsx from 'clsx';
import { CellState, GoPlayer } from '../../model/GoGame';
import Stone from './Stone';

interface Props {
  state: CellState;
  /**
   * null represents that no player can play
   */
  currentPlayer: GoPlayer | null;
  row: number;
  column: number;
  onClick(row: number, column: number): void;
  className?: string;
  top: boolean;
  bottom: boolean;
  left: boolean;
  right: boolean;
  lastPlaced: boolean;
}

const useStyles = makeStyles<Theme, Props>((theme) => ({
  root: (props) => ({
    position: 'relative',
    '&::before, &::after': {
      content: '" "',
      position: 'absolute',
      backgroundColor: theme.palette.grey[900],
    },
    '&::after': {
      width: 1,
      height: props.top || props.bottom ? '50%' : '100%',
      top: props.top ? '50%' : 0,
      left: '50%',
    },
    '&::before': {
      height: 1,
      width: props.left || props.right ? '50%' : '100%',
      left: props.left ? '50%' : 0,
      top: '50%',
    },
    '&:not(:hover) > [data-stone-shadow="true"]': {
      display: 'none',
    },
  }),
}));

export default React.memo(function BoardCell(props: Props) {
  const classes = useStyles(props);

  return (
    <div
      className={clsx(classes.root, props.className)}
      onClick={() => props.onClick(props.row, props.column)}
    >
      {props.state !== 'empty' ? (
        <Stone player={props.state} lastPlaced={props.lastPlaced} />
      ) : props.currentPlayer != null ? (
        <Stone player={props.currentPlayer} isShadow />
      ) : null}
    </div>
  );
});
