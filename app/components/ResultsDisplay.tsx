// app/components/ResultsDisplay.tsx
import { Box, Typography, Stack, Alert, Chip } from '@mui/material';
import { RandomizationItem } from '../../lib/randomization';

interface GenerationDetails {
  targetSampleSize: number;
  actualAllocationSize: number;
  numBlocks: number;
  blockSize: number;
  numTreatments: number;
}

interface ResultsDisplayProps {
  groupedSequence: Map<number, RandomizationItem[]>;
  generationDetails: GenerationDetails | null;
  getColorForTreatment: (treatment: string) => string;
  error: string | null;
  warning: string | null;
}

export default function ResultsDisplay({
  groupedSequence,
  generationDetails,
  getColorForTreatment,
  error,
  warning
}: ResultsDisplayProps) {
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (groupedSequence.size === 0 || !generationDetails) {
    return null;
  }

  return (
    <Box sx={{ mt: 3 }}>
      {warning && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {warning}
        </Alert>
      )}
      <Typography variant="h2" gutterBottom>
        Generated Sequence Details
      </Typography>

      <Box
        sx={{
          mb: 3,
          p: { xs: 1.5, sm: 2 },
          bgcolor: 'grey.50',
          borderRadius: 1,
          border: 1,
          borderColor: 'grey.300'
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 0.5, sm: 1 }}
          divider={
            <Box
              component="span"
              sx={{
                display: { xs: 'none', sm: 'inline' },
                color: 'text.secondary'
              }}
            >
              |
            </Box>
          }
          sx={{
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            color: 'text.secondary'
          }}
        >
          <Typography variant="body2" component="span">
            <strong>Target Sample Size:</strong> {generationDetails.targetSampleSize ?? 'N/A'}
          </Typography>
          <Typography variant="body2" component="span">
            <strong>Actual Allocation Size:</strong> {generationDetails.actualAllocationSize ?? 'N/A'}
          </Typography>
          <Typography variant="body2" component="span">
            <strong>Number of Blocks:</strong> {generationDetails.numBlocks ?? 'N/A'}
          </Typography>
          <Typography variant="body2" component="span">
            <strong>Block Size Used:</strong> {generationDetails.blockSize ?? 'N/A'}
          </Typography>
          <Typography variant="body2" component="span">
            <strong>Treatments:</strong> {generationDetails.numTreatments ?? 'N/A'}
          </Typography>
        </Stack>
      </Box>

      <Stack spacing={{ xs: 2, sm: 3 }}>
        {Array.from(groupedSequence.entries()).map(([blockIndex, blockItems]) => (
          <Box key={blockIndex}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 1, sm: 2 }}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  minWidth: { xs: 'auto', sm: 80 },
                  fontWeight: 600,
                  textAlign: { xs: 'left', sm: 'right' },
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                Block {blockIndex + 1}:
              </Typography>
              <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                {blockItems.map((item, itemIndex) => (
                  <Chip
                    key={`${blockIndex}-${itemIndex}`}
                    label={item.subjectIndex + 1}
                    size="small"
                    sx={{
                      backgroundColor: getColorForTreatment(item.treatment),
                      border: 1,
                      borderColor: 'grey.400',
                      minWidth: { xs: 36, sm: 40 },
                      height: { xs: 24, sm: 28 },
                      fontFamily: 'monospace',
                      fontWeight: 500,
                      fontSize: { xs: '0.7rem', sm: '0.8rem' }
                    }}
                    title={`Subject Index: ${item.subjectIndex + 1} | Treatment: ${item.treatment} | Block: ${item.blockIndex + 1}`}
                  />
                ))}
              </Stack>
            </Stack>
          </Box>
        ))}
      </Stack>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mt: 3,
          p: { xs: 1.5, sm: 2 },
          bgcolor: 'grey.50',
          borderRadius: 1,
          fontSize: { xs: '0.75rem', sm: '0.875rem' }
        }}
      >
        Each row represents a block. One of all the possible permutations of treatment allocations
        for this block size is randomly assigned for each block. Colors indicate the treatment.
      </Typography>
    </Box>
  );
}
