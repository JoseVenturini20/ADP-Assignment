import React from 'react';
import { Paper, Typography, Grid, Chip, Box } from '@mui/material';
import { FetchResponse } from '../types';

interface ResultSummaryProps {
  data: FetchResponse;
}

const ResultSummary: React.FC<ResultSummaryProps> = ({ data }) => (
  <Paper variant="outlined" sx={{ p: 3 }}>
    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
      Task Overview
    </Typography>
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Typography variant="caption" color="text.secondary">Task ID</Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
          {data.taskId}
        </Typography>
      </Grid>

      {data.result.topEarner && (
        <>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Typography variant="caption" color="text.secondary">Top Earner</Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {data.result.topEarner.name}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Typography variant="caption" color="text.secondary">Employee ID</Typography>
            <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
              {data.result.topEarner.id}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Typography variant="caption" color="text.secondary">Category</Typography>
            <Box><Chip label={data.result.topEarner.categoryCode} size="small" sx={{ mt: 0.5 }} /></Box>
          </Grid>
        </>
      )}

      <Grid size={{ xs: 6, sm: 3 }}>
        <Typography variant="caption" color="text.secondary">Total Transactions</Typography>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {data.transactions.length}
        </Typography>
      </Grid>

      <Grid size={{ xs: 6, sm: 3 }}>
        <Typography variant="caption" color="text.secondary">Alpha Transactions to Submit</Typography>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
          {data.result.alphaTransactionIDs.length}
        </Typography>
      </Grid>
    </Grid>
  </Paper>
);

export default ResultSummary;
