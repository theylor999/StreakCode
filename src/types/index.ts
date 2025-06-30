export type TestCase = {
  input: any[];
  expected: any;
};

export type ChallengeType = 'python' | 'sql';

export type Challenge = {
  id: string; // e.g., "python-1", "sql-1"
  numericId: number;
  type: ChallengeType;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  starterCode: string;
  starterFunctionName?: string;
  testCases: TestCase[];
  solution: string;
  solutionHint?: string;
  youtubeLink?: string;
  explanation?: string;
  schemaImage?: string;
  example?: {
      input: string;
      output: string;
  };
  isDailyGenerated?: boolean;
};

export type Progress = {
  [challengeId: string]: {
    code: string;
    completed: boolean;
    attempts: number;
    completionDate?: number;
  }
};

export type Stats = {
    totalAttempts: number;
    pythonAttempts: number;
    sqlAttempts: number;
    totalCompleted: number;

    pythonCompleted: number;
    sqlCompleted: number;
    startedChallenges: number;
}

export type ChatMessage = {
  role: 'user' | 'model';
  content: string;
};
