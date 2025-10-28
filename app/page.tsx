// app/page.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { Container } from '@mui/material';
import { generateBlockedRandomization, RandomizationItem } from '../lib/randomization';
import { treatmentColors } from '../lib/ui/theme/muiTheme';
import RandomizationForm from './components/RandomizationForm';
import Legend from './components/Legend';
import DownloadButtons from './components/DownloadButtons';
import ResultsDisplay from './components/ResultsDisplay';

// --- Function to get color based on treatment ---
function getColorForTreatment(treatment: string): string {
  return treatmentColors[treatment] || treatmentColors.default;
}

interface GenerationDetails {
  targetSampleSize: number;
  actualAllocationSize: number;
  numBlocks: number;
  blockSize: number;
  numTreatments: number;
}

export default function Home() {
  // --- State Variables ---
  const [numSubjectsInput, setNumSubjectsInput] = useState<string>('24');
  const [blockSizeInput, setBlockSizeInput] = useState<string>('6');
  const [numTreatmentsInput, setNumTreatmentsInput] = useState<string>('3');

  const [randomizedSequence, setRandomizedSequence] = useState<RandomizationItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const [generatedNumTreatments, setGeneratedNumTreatments] = useState<number | null>(null);
  const [generationDetails, setGenerationDetails] = useState<GenerationDetails | null>(null);
  const [hasGenerated, setHasGenerated] = useState<boolean>(false);

  // --- Handle Generation ---
  const handleGenerate = () => {
    setHasGenerated(true);

    // Clear previous results/errors/warnings
    setError(null);
    setWarning(null);
    setRandomizedSequence([]);
    setGeneratedNumTreatments(null);
    setGenerationDetails(null);

    // --- Input Parsing ---
    const targetNumSubjects = parseInt(numSubjectsInput, 10);
    const blockSize = parseInt(blockSizeInput, 10);
    const numTreatments = parseInt(numTreatmentsInput, 10);

    // --- Frontend Input Validation (Basic Checks) ---
    if (isNaN(targetNumSubjects) || isNaN(blockSize) || isNaN(numTreatments)) {
      setError("Please ensure all inputs are valid numbers.");
      return;
    }

    if (targetNumSubjects < 2 || targetNumSubjects > 500) {
      setError('Target Sample Size must be between 2 and 500.');
      return;
    }
    if (blockSize <= 0) {
      setError('Block Size must be a positive number.');
      return;
    }
    if (numTreatments < 2 || numTreatments > 10) {
      setError('Number of Treatments must be between 2 and 10.');
      return;
    }

    // --- Call the randomization function ---
    const result = generateBlockedRandomization(
      targetNumSubjects,
      blockSize,
      numTreatments
    );

    // --- Process Result using Type Guard ---
    if ('error' in result) {
      setError(result.error);
      setRandomizedSequence([]);
      setWarning(null);
      setGeneratedNumTreatments(null);
      setGenerationDetails(null);
    } else {
      setError(null);
      setRandomizedSequence(result.sequence);
      setGeneratedNumTreatments(result.numTreatments);
      setGenerationDetails({
        targetSampleSize: result.targetSampleSize,
        actualAllocationSize: result.actualAllocationSize,
        numBlocks: result.numBlocks,
        blockSize: result.blockSize,
        numTreatments: result.numTreatments,
      });
      setWarning(result.warning || null);
    }
  };

  // Group sequence by block index using useMemo for optimization
  const groupedSequence = useMemo(() => {
    if (!randomizedSequence || randomizedSequence.length === 0) {
      return new Map<number, RandomizationItem[]>();
    }
    const map = new Map<number, RandomizationItem[]>();
    randomizedSequence.forEach((item) => {
      const blockList = map.get(item.blockIndex) || [];
      blockList.push(item);
      map.set(item.blockIndex, blockList);
    });
    // Sort blocks by index
    return new Map([...map.entries()].sort((a, b) => a[0] - b[0]));
  }, [randomizedSequence]);

  return (
    <Container
      maxWidth="md"
      sx={{
        px: { xs: 1, sm: 2, md: 3 }
      }}
    >
      <RandomizationForm
        numSubjectsInput={numSubjectsInput}
        setNumSubjectsInput={setNumSubjectsInput}
        blockSizeInput={blockSizeInput}
        setBlockSizeInput={setBlockSizeInput}
        numTreatmentsInput={numTreatmentsInput}
        setNumTreatmentsInput={setNumTreatmentsInput}
        onGenerate={handleGenerate}
      />

      <DownloadButtons hasGenerated={hasGenerated} />

      <Legend
        generatedNumTreatments={generatedNumTreatments}
        treatmentColors={treatmentColors}
      />

      <ResultsDisplay
        groupedSequence={groupedSequence}
        generationDetails={generationDetails}
        getColorForTreatment={getColorForTreatment}
        error={error}
        warning={warning}
      />
    </Container>
  );
}
