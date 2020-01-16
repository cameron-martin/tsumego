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
import { UserRating } from '@tsumego/api-client';
import { useApiClient } from '../../src/apiClient';
import StandardTemplate from '../../src/view/StandardTemplate';

export default function Ratings() {
  const [ratings, setRatings] = useState<UserRating[]>([]);
  const apiClient = useApiClient();

  useEffect(() => {
    if (apiClient) {
      apiClient.userRatings.getAll().then(ratings => {
        setRatings(ratings);
      });
    }
  }, [apiClient]);

  return (
    <StandardTemplate>
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
    </StandardTemplate>
  );
}
