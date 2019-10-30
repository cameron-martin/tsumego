import Board from './Board';
import React, { useState } from 'react';
import { GoGame } from '../model/GoGame';

export default function App() {
  const [game, setGame] = useState(GoGame.create(9));

  return <Board game={game} setGame={setGame} />;
}
