// app/components/DownloadButtons.tsx
import { Box, Typography, Button, Stack } from '@mui/material';
import { Download } from '@mui/icons-material';

interface DownloadButtonsProps {
  hasGenerated: boolean;
}

export default function DownloadButtons({ hasGenerated }: DownloadButtonsProps) {
  if (!hasGenerated) return null;

  return (
    <Box sx={{ mb: 3 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1.5, sm: 2 }}
        alignItems={{ xs: 'stretch', sm: 'center' }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontSize: { xs: '0.875rem', sm: '0.875rem' },
            textAlign: { xs: 'left', sm: 'left' }
          }}
        >
          Download code:
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1, sm: 1.5 }}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          <Button
            variant="outlined"
            size="small"
            startIcon={<Download />}
            href="/blockRandomization.py"
            download
            title="Download Python script"
            sx={{
              width: { xs: '100%', sm: 'auto' },
              justifyContent: { xs: 'flex-start', sm: 'center' },
              fontSize: { xs: '0.8rem', sm: '0.875rem' }
            }}
          >
            Python (.py)
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Download />}
            href="/blockRandomization.R"
            download
            title="Download R script"
            sx={{
              width: { xs: '100%', sm: 'auto' },
              justifyContent: { xs: 'flex-start', sm: 'center' },
              fontSize: { xs: '0.8rem', sm: '0.875rem' }
            }}
          >
            R (.R)
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
