// lib/randomization.ts

// Types
export interface RandomizationItem {
  treatment: string;
  blockIndex: number;
  subjectIndex: number;
}

export interface RandomizationSuccess {
  sequence: RandomizationItem[];
  targetSampleSize: number;
  actualAllocationSize: number;
  numBlocks: number;
  blockSize: number;
  numTreatments: number;
  warning?: string;
}

export interface RandomizationError {
  sequence: never[];
  error: string;
}

export type RandomizationResult = RandomizationSuccess | RandomizationError;

// Simple Fisher-Yates (Knuth) shuffle algorithm
function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length;
  let randomIndex: number;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

// Function to generate treatment labels (A, B, C... up to J)
function generateTreatmentLabels(numTreatments: number): string[] {
  const labels: string[] = [];
  const count = Math.min(numTreatments, 10);
  for (let i = 0; i < count; i++) {
    labels.push(String.fromCharCode(65 + i)); // 65 is ASCII for 'A'
  }
  return labels;
}

/**
 * Generates a blocked randomization sequence, adjusting the total allocation
 * size upwards to the nearest multiple of the block size if necessary.
 *
 * @param targetNumSubjects The desired target number of subjects.
 * @param blockSize The desired number of subjects within each block.
 * Must be divisible by numTreatments.
 * @param numTreatments The number of treatment groups (2-10).
 * @returns An object containing the randomization sequence and details, or an error.
 */
export function generateBlockedRandomization(
  targetNumSubjects: number, // Renamed for clarity
  blockSize: number,
  numTreatments: number
): RandomizationResult {

  // --- Input Validation ---
  if (targetNumSubjects < 2 || targetNumSubjects > 500) { // Validate target size
     return { sequence: [], error: 'Target Sample Size must be between 2 and 500.' };
  }
  if (numTreatments < 2 || numTreatments > 10) {
    return { sequence: [], error: 'Number of Treatments must be between 2 and 10.' };
  }
  if (blockSize <= 0) {
     return { sequence: [], error: 'Block Size must be a positive number.' };
  }
  if (blockSize < numTreatments) {
    return { sequence: [], error: `Block Size (${blockSize}) must be greater than or equal to the number of treatments (${numTreatments}).` };
  }
  // Check: Block Size must be divisible by Number of Treatments
  if (blockSize % numTreatments !== 0) {
    return {
      sequence: [],
      error: `Block size (${blockSize}) must be divisible by the number of treatments (${numTreatments}) to ensure equal allocation within blocks.`,
    };
  }

  // --- Calculate Actual Allocation Size and Number of Blocks ---
  let warningMessage: string | undefined = undefined;
  // Calculate the number of blocks needed, rounding up
  const numBlocks = Math.ceil(targetNumSubjects / blockSize);
  // Calculate the actual total number of subjects to allocate for (a multiple of blockSize)
  const actualAllocationSize = numBlocks * blockSize;

  // Set a warning if the size was adjusted
  if (actualAllocationSize !== targetNumSubjects) {
      warningMessage = `Target sample size (${targetNumSubjects}) is not a multiple of block size (${blockSize}). Allocation generated for ${actualAllocationSize} subjects.`;
  }

  // --- Randomization Logic ---
  const treatmentLabels = generateTreatmentLabels(numTreatments);
  const assignmentsPerTreatmentPerBlock = blockSize / numTreatments;
  const fullSequence: RandomizationItem[] = [];
  let overallSubjectIndex = 0;

  // Generate each block using the calculated numBlocks
  for (let i = 0; i < numBlocks; i++) {
    const currentBlockTemplate: string[] = [];
    treatmentLabels.forEach((label) => {
      for (let j = 0; j < assignmentsPerTreatmentPerBlock; j++) {
        currentBlockTemplate.push(label);
      }
    });

    const shuffledBlock = shuffle(currentBlockTemplate);

    shuffledBlock.forEach((treatment) => {
      fullSequence.push({
        treatment: treatment,
        blockIndex: i,
        subjectIndex: overallSubjectIndex
      });
      overallSubjectIndex++;
    });
  }

  // --- Return Success Result ---
  // Ensure the sequence length matches the actual allocation size
  if (fullSequence.length !== actualAllocationSize) {
      // This should theoretically not happen if logic is correct, but good safeguard
      return { sequence: [], error: `Internal error: Generated sequence length (${fullSequence.length}) does not match calculated allocation size (${actualAllocationSize}).`};
  }

  const successResult: RandomizationSuccess = {
      sequence: fullSequence,
      targetSampleSize: targetNumSubjects,
      actualAllocationSize: actualAllocationSize,
      numBlocks: numBlocks,
      blockSize: blockSize,
      numTreatments: numTreatments,
  };

  // Add warning if applicable
  if (warningMessage) {
      successResult.warning = warningMessage;
  }

  return successResult;
}
