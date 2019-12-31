import React from 'react';
import { Container } from '@material-ui/core';
import { Link } from '@reach/router';

export default function Home() {
  return (
    <Container>
      <ul>
        <li>
          <Link to="/admin/upload">Upload</Link>
        </li>
        <li>
          <Link to="/admin/ratings">Ratings</Link>
        </li>
      </ul>
    </Container>
  );
}
