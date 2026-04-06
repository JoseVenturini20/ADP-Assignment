import React, { useState, useCallback } from 'react';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Alert,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import SendIcon from '@mui/icons-material/Send';
import TaskStepper from './components/TaskStepper';
import ResultSummary from './components/ResultSummary';
import TransactionTable from './components/TransactionTable';
import { FetchResponse, SubmitResponse } from './types';

const theme = createTheme({
  palette: {
    primary: { main: '#d40511' },
    success: { main: '#2e7d32' },
  },
  typography: { fontFamily: 'Roboto, sans-serif' },
});

const STEPS = ['Fetch task data', 'Review transactions', 'Submit result'];

const App: React.FC = () => {
  const [activeStep, setActiveStep] = useState(-1);
  const [failedStep, setFailedStep] = useState(-1);
  const [data, setData] = useState<FetchResponse | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmitResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setActiveStep(0);
    setFailedStep(-1);
    setData(null);
    setSubmitResult(null);
    setErrorMsg(null);
    setLoading(true);

    try {
      const response = await fetch('/api/task/fetch');
      const body = await response.json();

      if (!response.ok) {
        setFailedStep(0);
        setErrorMsg(body.error || 'Failed to fetch data');
      } else {
        setData(body as FetchResponse);
        setActiveStep(1);
      }
    } catch (err) {
      setFailedStep(0);
      setErrorMsg((err as Error).message);
    }

    setLoading(false);
  }, []);

  const submitData = useCallback(async () => {
    if (!data) return;

    setActiveStep(2);
    setFailedStep(-1);
    setSubmitResult(null);
    setErrorMsg(null);
    setLoading(true);

    try {
      const response = await fetch('/api/task/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: data.taskId,
          alphaTransactionIDs: data.result.alphaTransactionIDs,
        }),
      });
      const body: SubmitResponse = await response.json();

      if (!response.ok) {
        setFailedStep(2);
        setErrorMsg(body.error || 'Submission failed');
      } else {
        setSubmitResult(body);
        setActiveStep(3);
      }
    } catch (err) {
      setFailedStep(2);
      setErrorMsg((err as Error).message);
    }

    setLoading(false);
  }, [data]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 0.5 }}>
            Transaction Dashboard
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            ADP Ventures Brazil Labs
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

          {/* Stepper */}
          {activeStep >= 0 && (
            <TaskStepper steps={STEPS} activeStep={activeStep} failedStep={failedStep} />
          )}

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<DownloadIcon />}
              onClick={fetchData}
              disabled={loading}
              sx={{ px: 4 }}
            >
              {loading && activeStep === 0 ? 'Fetching...' : 'Fetch Data'}
            </Button>

            {data && !submitResult && (
              <Button
                variant="contained"
                color="success"
                size="large"
                startIcon={<SendIcon />}
                onClick={submitData}
                disabled={loading}
                sx={{ px: 4 }}
              >
                {loading && activeStep === 2 ? 'Submitting...' : 'Submit Result'}
              </Button>
            )}
          </Box>

          {/* Error */}
          {errorMsg && (
            <Alert severity="error" variant="outlined">{errorMsg}</Alert>
          )}

          {/* Success */}
          {submitResult && (
            <Alert severity="success" variant="outlined">
              {submitResult.message} (Status: {submitResult.status})
            </Alert>
          )}

          {/* Result summary */}
          {data && <ResultSummary data={data} />}

          {/* Transactions table */}
          {data && <TransactionTable transactions={data.transactions} />}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
