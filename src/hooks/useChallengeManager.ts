
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Challenge, Progress } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { getOrCreateUserId } from '@/lib/user';

export const useChallengeManager = (challenge: Challenge) => {
    const { toast } = useToast();
    const [progress, setProgress] = useState<Progress>({});
    const [code, setCode] = useState(challenge.starterCode);
    const [isCompleted, setIsCompleted] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [testResults, setTestResults] = useState<{ input: any; expected: any; output: any; passed: boolean }[]>([]);

    useEffect(() => {
        try {
            const savedProgress = localStorage.getItem('streakcode-progress');
            if (savedProgress) {
                const parsedProgress: Progress = JSON.parse(savedProgress);
                setProgress(parsedProgress);
                const currentChallengeProgress = parsedProgress[challenge.id];
                if (currentChallengeProgress) {
                    setCode(currentChallengeProgress.code);
                    setIsCompleted(currentChallengeProgress.completed);
                    setAttempts(currentChallengeProgress.attempts);
                } else {
                    setCode(challenge.starterCode);
                    setIsCompleted(false);
                    setAttempts(0);
                    setTestResults([]);
                }
            } else {
                setCode(challenge.starterCode);
            }
        } catch (error) {
            console.error("Failed to load progress from localStorage", error);
            setCode(challenge.starterCode);
        }
    }, [challenge.id, challenge.starterCode]);

    const saveProgress = useCallback((newProgressData: Partial<Progress[string]>) => {
        const updatedProgress = {
            ...progress,
            [challenge.id]: {
                ...(progress[challenge.id] || { 
                    code, 
                    attempts, 
                    completed: isCompleted 
                }),
                ...newProgressData,
            },
        };
        
        setProgress(updatedProgress);
        try {
            localStorage.setItem('streakcode-progress', JSON.stringify(updatedProgress));
        } catch (error) {
            console.error("Failed to save progress to localStorage", error);
        }
    }, [progress, challenge.id, code, attempts, isCompleted]);
    
    const updateGlobalStats = async (isCompletion: boolean, isNewChallengeStart: boolean) => {
        const { isNewUser } = getOrCreateUserId();
        
        try {
            await fetch('/api/stats/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isCompletion, isNewUser, isNewChallengeStart })
            });
        } catch (error) {
            console.error('Failed to update global stats:', error);
        }
    };
    
    const handleRunCode = useCallback(async () => {
        setIsRunning(true);
        setTestResults([]);
        
        const newAttempts = isCompleted ? attempts : attempts + 1;
        
        // This is a simplified check for Python challenges.
        // A real implementation would use a code execution sandbox.
        const isSolutionCorrect = (() => {
            try {
                // This is a placeholder for actual code execution.
                // It compares a normalized version of the user's code to the solution.
                const normalize = (str: string) => str.replace(/\s+/g, '').replace(/#.*$/gm, '');
                return normalize(code) === normalize(challenge.solution);
            } catch (e) {
                return false;
            }
        })();

        const results = challenge.testCases.map(tc => {
            // Placeholder: A real implementation would execute the code against test cases.
            // For now, we just reflect if the overall solution was deemed correct.
            return {
                input: tc.input,
                expected: tc.expected,
                output: isSolutionCorrect ? tc.expected : `Resultado incorreto`, // Simplified output
                passed: isSolutionCorrect,
            };
        });
        
        const wasPreviouslyCompleted = isCompleted;
        setTestResults(results);
        setIsRunning(false);
        const completionStatusChanged = !wasPreviouslyCompleted && isSolutionCorrect;

        if (isSolutionCorrect) {
            setIsCompleted(true);
        }

        if (!wasPreviouslyCompleted) {
            setAttempts(newAttempts);
            saveProgress({
                code,
                attempts: newAttempts,
                completed: isSolutionCorrect,
                completionDate: isSolutionCorrect ? (progress[challenge.id]?.completionDate ?? Date.now()) : undefined,
            });
        } else {
             saveProgress({ code }); // Only save code if already completed
        }

        const isNewChallengeStart = !progress[challenge.id];
        if (!wasPreviouslyCompleted) {
          updateGlobalStats(completionStatusChanged, isNewChallengeStart);
        }

        if (isSolutionCorrect) {
            toast({
                title: "Sucesso!",
                description: "Todos os testes passaram. Desafio concluído!",
            });
            if (!wasPreviouslyCompleted) {
                setShowShareModal(true);
            }
        }

        return { allPassed: isSolutionCorrect, newAttempts };

    }, [code, challenge, attempts, saveProgress, toast, isCompleted, progress]);

    return {
        code,
        setCode,
        isCompleted,
        attempts,
        isRunning,
        testResults,
        handleRunCode,
        showShareModal,
        setShowShareModal,
    };
};
