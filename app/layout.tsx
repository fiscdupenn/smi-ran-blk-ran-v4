// app/layout.tsx
'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import Image from 'next/image';
import { theme } from '../lib/ui/theme/muiTheme';
import { ReactNode } from 'react';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const handleResetClick = () => {
    window.location.reload();
  };

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <title>Block Randomization Generator</title>
        <meta name="description" content="Learn block randomization interactively" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppBar position="fixed" color="default" elevation={1}>
            <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
              <IconButton
                edge="start"
                onClick={handleResetClick}
                title="Reset Application"
                sx={{
                  mr: { xs: 1, sm: 2 },
                  p: { xs: 0.5, sm: 1 }
                }}
              >
                <Image
                  src="/favicon.ico"
                  alt="Logo - Reset"
                  width={32}
                  height={32}
                  priority
                />
              </IconButton>
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  flexGrow: 1,
                  fontSize: { xs: '1.1rem', sm: '1.5rem', md: '2rem' },
                  fontWeight: 600
                }}
              >
                Block Randomization Generator
              </Typography>
            </Toolbar>
          </AppBar>
          <Box
            component="main"
            sx={{
              mt: { xs: 7, sm: 8 },
              p: { xs: 2, sm: 3 }
            }}
          >
            {children}
          </Box>
        </ThemeProvider>
      </body>
    </html>
  );
}
