// app/components/RandomizationForm.tsx
import { Box, TextField, Button, Stack, Typography } from '@mui/material';
import { ChangeEvent } from 'react';

interface RandomizationFormProps {
  numSubjectsInput: string;
  setNumSubjectsInput: (value: string) => void;
  blockSizeInput: string;
  setBlockSizeInput: (value: string) => void;
  numTreatmentsInput: string;
  setNumTreatmentsInput: (value: string) => void;
  onGenerate: () => void;
}

export default function RandomizationForm({
  numSubjectsInput,
  setNumSubjectsInput,
  blockSizeInput,
  setBlockSizeInput,
  numTreatmentsInput,
  setNumTreatmentsInput,
  onGenerate
}: RandomizationFormProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
        When you are setting up block randomization, you have to know sample size, block size and number of treatments, and then standard code can randomize for you. Try it out!
      </Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'stretch', sm: 'flex-start' }}
        spacing={2}
        sx={{ width: '100%' }}
      >
        <TextField
          label="Sample Size"
          type="number"
          value={numSubjectsInput}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNumSubjectsInput(e.target.value)}
          placeholder="e.g., 24"
          inputProps={{ min: 2, max: 500 }}
          sx={{
            width: { xs: '100%', sm: 180 },
            flex: { xs: '1 1 100%', sm: '0 0 auto' }
          }}
        />
        <TextField
          label="Block Size"
          type="number"
          value={blockSizeInput}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setBlockSizeInput(e.target.value)}
          placeholder="e.g., 10"
          inputProps={{ min: 1 }}
          sx={{
            width: { xs: '100%', sm: 110 },
            flex: { xs: '1 1 100%', sm: '0 0 auto' }
          }}
        />
        <TextField
          label="Treatments"
          type="number"
          value={numTreatmentsInput}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNumTreatmentsInput(e.target.value)}
          placeholder="e.g., 2"
          inputProps={{ min: 2, max: 10 }}
          sx={{
            width: { xs: '100%', sm: 180 },
            flex: { xs: '1 1 100%', sm: '0 0 auto' }
          }}
        />
        <Button
          variant="contained"
          onClick={onGenerate}
          fullWidth
          sx={{
            width: { xs: '100%', sm: 'auto' },
            minWidth: { sm: 160 },
            mt: { xs: 1, sm: 0 }
          }}
        >
          Generate Sequence
        </Button>
      </Stack>
    </Box>
  );
}
