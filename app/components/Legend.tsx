// app/components/Legend.tsx
import { Box, Typography, Stack, Chip } from '@mui/material';

interface LegendProps {
  generatedNumTreatments: number | null;
  treatmentColors: Record<string, string>;
}

export default function Legend({ generatedNumTreatments, treatmentColors }: LegendProps) {
  if (!generatedNumTreatments) return null;

  return (
    <Box
      sx={{
        mb: 3,
        p: { xs: 1.5, sm: 2 },
        border: 1,
        borderColor: 'grey.300',
        borderRadius: 1,
        bgcolor: 'background.paper'
      }}
    >
      <Typography
        variant="h3"
        gutterBottom
        sx={{
          fontSize: { xs: '1rem', sm: '1.25rem' },
          mb: { xs: 1, sm: 1.5 }
        }}
      >
        Legend
      </Typography>
      <Stack
        direction="row"
        spacing={{ xs: 1, sm: 2 }}
        flexWrap="wrap"
        useFlexGap
      >
        {Object.entries(treatmentColors)
          .slice(0, generatedNumTreatments)
          .map(([treatment, color]) => (
            <Chip
              key={treatment}
              label={`Treatment ${treatment}`}
              sx={{
                backgroundColor: color,
                border: 1,
                borderColor: 'grey.400',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                height: { xs: 28, sm: 32 },
                '& .MuiChip-label': {
                  fontWeight: 500,
                  px: { xs: 1, sm: 1.5 }
                },
              }}
            />
          ))}
      </Stack>
    </Box>
  );
}
