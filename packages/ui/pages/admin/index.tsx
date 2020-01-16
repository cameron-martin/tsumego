import React from 'react';
import { Container } from '@material-ui/core';
import Link from 'next/link';
import StandardTemplate from '../../src/view/StandardTemplate';

export default function Home() {
  return (
    <StandardTemplate>
      <Container>
        <ul>
          <li>
            <Link href="/admin/upload">
              <a>Upload</a>
            </Link>
          </li>
          <li>
            <Link href="/admin/ratings">
              <a>Ratings</a>
            </Link>
          </li>
        </ul>
      </Container>
    </StandardTemplate>
  );
}
