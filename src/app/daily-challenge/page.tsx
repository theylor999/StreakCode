
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import type { Challenge, Progress as MainProgress } from '@/types';
import { generateChallenge, type GenerateChallengeInput } from '@/ai/flows/generate-challenge-flow';
import { addCustomChallenge, getChallengeById, getAllChallenges } from '@/lib/challenges';
import { BrainCircuit, Loader2, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type DailyProgress = {
    [date: string]: { // YYYY-MM-DD
        difficulty: 'easy' | 'medium' | 'hard';
        challengeId: string;
    }
}

const DAILY_DIFFICULTY_KEY = 'streakcode-daily-difficulty';
const DAILY_PROGRESS_KEY = 'streakcode-daily-progress';

const difficultyTranslations: { [key in 'easy' | 'medium' | 'hard']: string } = {
    easy: 'Fácil',
    medium: 'Médio',
    hard: 'Difícil'
};

const difficultyColors = {
    easy: "bg-green-500/20 text-green-400 border-green-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    hard: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function DailyChallengePage() {
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(null);
    const [todaysChallenge, setTodaysChallenge] = useState<Challenge | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [dailyProgress, setDailyProgress] = useState<DailyProgress>({});
    const [completedDays, setCompletedDays] = useState<Date[]>([]);
    const [isCompletedToday, setIsCompletedToday] = useState(false);
    
    const router = useRouter();
    const { toast } = useToast();
    const todayString = format(new Date(), 'yyyy-MM-dd');

    const loadData = useCallback(() => {
        setIsLoading(true);
        try {
            const savedDifficulty = localStorage.getItem(DAILY_DIFFICULTY_KEY) as 'easy' | 'medium' | 'hard' | null;
            const savedProgress = localStorage.getItem(DAILY_PROGRESS_KEY);
            const mainProgressStr = localStorage.getItem('streakcode-progress');
            
            const dp: DailyProgress = savedProgress ? JSON.parse(savedProgress) : {};
            const mainProgress: MainProgress = mainProgressStr ? JSON.parse(mainProgressStr) : {};

            setDailyProgress(dp);
            setDifficulty(savedDifficulty);

            const todaysEntry = dp[todayString];
            if (todaysEntry) {
                const foundChallenge = getChallengeById(todaysEntry.challengeId);
                if (foundChallenge) {
                    setTodaysChallenge(foundChallenge);
                    setIsCompletedToday(!!mainProgress[todaysEntry.challengeId]?.completed);
                } else {
                    console.error("Daily challenge ID found but challenge data is missing.");
                    delete dp[todayString]; // Clean up inconsistent state
                    localStorage.setItem(DAILY_PROGRESS_KEY, JSON.stringify(dp));
                    setTodaysChallenge(null);
                    setIsCompletedToday(false);
                }
            } else {
                 setTodaysChallenge(null);
                 setIsCompletedToday(false);
            }

            const completed = Object.entries(dp)
                .filter(([_, dailyEntry]) => mainProgress[dailyEntry.challengeId]?.completed)
                .map(([dateString]) => {
                    // Correctly parse YYYY-MM-DD to avoid timezone issues
                    const [year, month, day] = dateString.split('-').map(Number);
                    return new Date(year, month - 1, day);
                });
            setCompletedDays(completed);

        } catch (error) {
            console.error("Failed to load daily challenge data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [todayString]);
    
    // Rerun loadData when the window gains focus to ensure data is fresh
    useEffect(() => {
        loadData();
        const handleFocus = () => loadData();
        const handleStorage = (e: StorageEvent) => {
            if (e.key === 'streakcode-progress' || e.key === DAILY_PROGRESS_KEY || e.key === 'streakcode-custom-challenges') {
                loadData();
            }
        };

        window.addEventListener('focus', handleFocus);
        window.addEventListener('storage', handleStorage);

        return () => {
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('storage', handleStorage);
        };
    }, [loadData]);


    const handleGenerateChallenge = useCallback(async (selectedDifficulty: 'easy' | 'medium' | 'hard') => {
        setIsLoading(true);

        const allChallenges = getAllChallenges();
        const existingTitles = allChallenges.map(c => c.title);

        try {
            const input: GenerateChallengeInput = {
                difficulty: selectedDifficulty,
                language: 'python',
                topic: 'general programming puzzle',
                existingTitles: existingTitles,
            };
            const newChallenge = await generateChallenge(input);
            
            // Mark this challenge as a daily-generated one
            newChallenge.isDailyGenerated = true;

            addCustomChallenge(newChallenge);
            
            const newDailyProgress: DailyProgress = {
                ...dailyProgress,
                [todayString]: {
                    difficulty: selectedDifficulty,
                    challengeId: newChallenge.id,
                }
            };
            setDailyProgress(newDailyProgress);
            localStorage.setItem(DAILY_PROGRESS_KEY, JSON.stringify(newDailyProgress));

            setTodaysChallenge(newChallenge);

        } catch (error) {
            console.error("Failed to generate daily challenge:", error);
            toast({
                variant: 'destructive',
                title: "Erro ao Gerar Desafio",
                description: "Não foi possível criar o desafio diário. Tente recarregar a página.",
            });
            setDifficulty(null);
            localStorage.removeItem(DAILY_DIFFICULTY_KEY);
        } finally {
            setIsLoading(false);
        }
    }, [dailyProgress, todayString, toast]);

    useEffect(() => {
        // Trigger generation only if difficulty is set and no challenge exists for today
        if (difficulty && !todaysChallenge && !isLoading) {
            handleGenerateChallenge(difficulty);
        }
    }, [difficulty, todaysChallenge, isLoading, handleGenerateChallenge]);


    const handleSelectDifficulty = (value: 'easy' | 'medium' | 'hard') => {
        setDifficulty(value);
        localStorage.setItem(DAILY_DIFFICULTY_KEY, value);
    };
    
    const handleStartChallenge = () => {
        if (todaysChallenge) {
            router.push(`/challenge/${todaysChallenge.id}?daily=true`);
        }
    };

    const resetDifficulty = () => {
        setDifficulty(null);
        setTodaysChallenge(null);
        localStorage.removeItem(DAILY_DIFFICULTY_KEY);
    }
    
    if (isLoading && !difficulty) {
        return (
            <div className="max-w-2xl mx-auto py-12 text-center">
                <Skeleton className="h-12 w-3/4 mx-auto" />
                <Skeleton className="h-6 w-full mx-auto mt-4" />
                <Skeleton className="h-48 w-full mx-auto mt-12" />
            </div>
        )
    }

    if (!difficulty) {
        return (
             <div className="max-w-2xl mx-auto py-12 text-center">
                <h1 className="text-4xl font-bold font-headline text-primary">Desafio Diário</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Teste suas habilidades com um desafio único gerado por IA. Selecione uma dificuldade para começar.
                </p>
                <Card className="mt-12 text-left">
                    <CardHeader>
                        <CardTitle>Selecione a Dificuldade</CardTitle>
                        <CardDescription>Um novo desafio de Python será gerado para você.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Select onValueChange={handleSelectDifficulty}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Escolha um nível..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="easy">Fácil</SelectItem>
                                <SelectItem value="medium">Médio</SelectItem>
                                <SelectItem value="hard">Difícil</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    const translatedDifficulty = difficulty ? difficultyTranslations[difficulty] : '';

    const today = new Date();
    const day = format(today, "dd");
    const monthName = format(today, "MMMM", { locale: ptBR });
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    const formattedDate = `${day} de ${capitalizedMonth}`;

    return (
        <div className="max-w-4xl mx-auto py-12">
             <div className="flex justify-between items-start mb-8">
                 <div>
                    <h1 className="text-4xl font-bold font-headline text-primary">Desafio Diário</h1>
                    <p className="mt-2 text-muted-foreground">Seu desafio para hoje, {formattedDate}.</p>
                 </div>
                 <Button onClick={resetDifficulty} variant="outline">Mudar Dificuldade</Button>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-start">
                <div>
                    <h2 className="text-2xl font-headline mb-4">Seu Calendário</h2>
                    <Card className="w-fit p-0">
                        <Calendar
                            mode="multiple"
                            selected={completedDays}
                            onSelect={() => {}}
                            defaultMonth={new Date()}
                            locale={ptBR}
                            className="p-3"
                            classNames={{
                                cell: "relative h-9 w-9 text-center text-sm p-0 focus-within:relative focus-within:z-20",
                                day: cn("h-9 w-9 p-0 font-normal aria-selected:opacity-100"),
                                day_selected: "bg-green-500 text-primary-foreground rounded-full hover:bg-green-500/90 focus:bg-green-500/90",
                                day_today: "rounded-full bg-accent/50 text-accent-foreground aria-selected:bg-green-500 aria-selected:text-primary-foreground",
                                day_disabled: "text-muted-foreground opacity-50",
                                caption_label: "font-headline",
                            }}
                            ISOWeek
                            formatters={{
                                formatCaption: (month, options) => {
                                    const m = format(month, 'MMMM', { locale: options?.locale });
                                    const y = format(month, 'yyyy', { locale: options?.locale });
                                    return `${m.charAt(0).toUpperCase() + m.slice(1)} ${y}`;
                                }
                            }}
                        />
                    </Card>
                </div>

                <div>
                     <h2 className="text-2xl font-headline mb-4">Desafio de Hoje</h2>
                     {isLoading && !todaysChallenge ? (
                         <Card className="bg-muted/50 flex flex-col items-center justify-center p-8 min-h-[220px]">
                            <Loader2 className="h-8 w-8 animate-spin text-accent mb-4" />
                            <p className="text-muted-foreground">Gerando seu desafio personalizado...</p>
                         </Card>
                     ) : isCompletedToday ? (
                        <Card className="bg-green-500/10 border-green-500/20 text-center p-8 flex flex-col items-center justify-center min-h-[220px]">
                            <CardHeader>
                                <CardTitle className="font-headline text-2xl text-green-400">Parabéns!</CardTitle>
                                <CardDescription className="text-green-400/80">Você já completou o desafio de hoje.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-muted-foreground">Volte amanhã para continuar o seu StreakCode!</p>
                                <Button asChild>
                                    <Link href="/custom-challenges">
                                        <Sparkles className="mr-2 h-4 w-4"/>
                                        Gerar um desafio personalizado
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                     ) : todaysChallenge ? (
                         <Card className="bg-muted/50">
                             <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="font-headline text-xl pr-4">{todaysChallenge.title}</CardTitle>
                                    <Badge variant="outline" className={cn("flex-shrink-0", difficultyColors[todaysChallenge.difficulty])}>{translatedDifficulty}</Badge>
                                </div>
                                 <CardDescription className="line-clamp-3 pt-2">{todaysChallenge.description}</CardDescription>
                             </CardHeader>
                             <CardContent>
                                 <Button onClick={handleStartChallenge} className="w-full">
                                     <BrainCircuit className="mr-2" />
                                     Iniciar Desafio
                                 </Button>
                             </CardContent>
                         </Card>
                     ) : (
                        <Card className="bg-muted/50 flex flex-col items-center justify-center p-8 min-h-[220px]">
                           <p className="text-muted-foreground text-center">Não foi possível gerar um desafio. <br/>Tente recarregar a página.</p>
                        </Card>
                     )}
                </div>
            </div>
        </div>
    );
}
