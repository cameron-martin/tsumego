import React, { useEffect, useState } from 'react';
import {
  Paper,
  Container,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  Table,
  TableBody,
} from '@material-ui/core';
import { ApiClient, UserRating } from '@tsumego/api-client';

interface Props {
  apiClient: ApiClient;
}

export default function Ratings({ apiClient }: Props) {
  const [ratings, setRatings] = useState<UserRating[]>([]);

  useEffect(() => {
    apiClient.userRatings.getAll().then(ratings => {
      setRatings(ratings);
    });
  }, []);

  return (
    <Container>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Mean</TableCell>
              <TableCell>Deviation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ratings.map(rating => (
              <TableRow key={rating.id}>
                <TableCell>{rating.userId}</TableCell>
                <TableCell>{rating.mean}</TableCell>
                <TableCell>{rating.deviation}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
