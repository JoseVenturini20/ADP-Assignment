import React from 'react';
import { Stepper, Step, StepLabel, Paper, Typography } from '@mui/material';

interface TaskStepperProps {
  steps: string[];
  activeStep: number;
  failedStep: number;
}

const TaskStepper: React.FC<TaskStepperProps> = ({ steps, activeStep, failedStep }) => {
  const isComplete = activeStep >= steps.length;
  const hasFailed = failedStep >= 0;

  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
        Execution Progress
      </Typography>
      <Stepper activeStep={hasFailed ? failedStep : activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label} completed={!hasFailed && index < activeStep}>
            <StepLabel error={index === failedStep}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {isComplete && (
        <Typography variant="body2" color="success.main" sx={{ mt: 2, textAlign: 'center' }}>
          All steps completed successfully.
        </Typography>
      )}
      {hasFailed && (
        <Typography variant="body2" color="error" sx={{ mt: 2, textAlign: 'center' }}>
          Execution failed at step: {steps[failedStep]}.
        </Typography>
      )}
    </Paper>
  );
};

export default TaskStepper;
