
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Progress, Challenge } from '@/types';
import { getAllChallenges } from '@/lib/challenges';
import { calculateStreaks } from '@/lib/streaks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, Edit3, Target, Sparkles, Trash2, Repeat, Flame, Calendar } from 'lucide-react';
import { RiTwitterXFill } from 'react-icons/ri';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

type HistoryItem = {
  challenge: Challenge;
  progress: Progress[string];
};

type UserStats = {
    totalAttempts: number;
    totalCompleted: number;
    startedChallenges: number;
    currentStreak: number;
    longestStreak: number;
};

const StatCard = ({ title, value, icon, description }: { title: string, value: string | number, icon: React.ReactNode, description: string }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
);

const defaultStats: UserStats = {
    totalAttempts: 0,
    totalCompleted: 0,
    startedChallenges: 0,
    currentStreak: 0,
    longestStreak: 0,
};

export default function HistoryPage() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const loadData = () => {
        setLoading(true);
        try {
            const savedProgress = localStorage.getItem('streakcode-progress');
            const allChallenges = getAllChallenges();

            if (savedProgress) {
                const progressData: Progress = JSON.parse(savedProgress);
                
                const historyItems = Object.entries(progressData)
                    .map(([challengeId, progress]) => {
                        const challenge = allChallenges.find(c => c.id === challengeId);
                        if (challenge) {
                            return { challenge, progress };
                        }
                        return null;
                    })
                    .filter((item): item is HistoryItem => item !== null)
                    .sort((a, b) => (b.progress.completionDate || 0) - (a.progress.completionDate || 0));
                
                setHistory(historyItems);

                const { currentStreak, longestStreak } = calculateStreaks(progressData);
                
                const calculatedStats: UserStats = { ...defaultStats };
                calculatedStats.totalAttempts = Object.values(progressData).reduce((sum, p) => sum + p.attempts, 0);
                calculatedStats.totalCompleted = Object.values(progressData).filter(p => p.completed).length;
                calculatedStats.startedChallenges = Object.keys(progressData).length;
                calculatedStats.currentStreak = currentStreak;
                calculatedStats.longestStreak = longestStreak;

                setStats(calculatedStats);

            } else {
                setStats(defaultStats);
            }
        } catch (error) {
            console.error("Failed to load data from localStorage", error);
            setStats(defaultStats);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleResetHistory = () => {
        try {
            localStorage.removeItem('streakcode-progress');
            localStorage.removeItem('streakcode-custom-challenges');
            localStorage.removeItem('streakcode-daily-progress');
            localStorage.removeItem('streakcode-daily-difficulty');

            // Clear all chat histories as well
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('streakcode-chat-history-')) {
                    localStorage.removeItem(key);
                }
            });
            
            // Reload data to reflect the changes
            loadData();

            toast({
                title: "Histórico Resetado",
                description: "Seu progresso e desafios personalizados foram apagados.",
            });
        } catch (error) {
             toast({
                variant: 'destructive',
                title: "Erro",
                description: "Não foi possível resetar seu histórico.",
            });
        }
    };

    const getShareUrl = () => {
        if (!stats) return "";
        const text = `Meu progresso no StreakCode:
✅ ${stats.totalCompleted} desafios concluídos
🔥 Streak atual: ${stats.currentStreak} dias
🏆 Maior streak: ${stats.longestStreak} dias

Vem treinar também! #StreakCode`;
        const siteUrl = "https://streak-code.vercel.app";
        return `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(siteUrl)}`;
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto py-12 space-y-16">
                 {/* Skeletons for stats */}
                 <Skeleton className="h-48 w-full" />
                 {/* Skeleton for table */}
                 <Skeleton className="h-64 w-full" />
            </div>
        );
    }
    
    return (
        <div className="max-w-4xl mx-auto py-12 space-y-16">
            {stats && (
                 <div>
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold font-headline text-primary">Suas Estatísticas</h1>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Acompanhe seu desempenho e progresso na plataforma.
                        </p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <StatCard title="Concluídos" value={stats.totalCompleted} icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />} description="Total de desafios resolvidos" />
                        <StatCard title="Streak Atual" value={stats.currentStreak} icon={<Flame className="h-4 w-4 text-muted-foreground" />} description="Dias seguidos completando desafios" />
                        <StatCard title="Maior Streak" value={stats.longestStreak} icon={<Target className="h-4 w-4 text-muted-foreground" />} description="Seu recorde de dias seguidos" />
                        <StatCard title="Tentativas" value={stats.totalAttempts} icon={<Repeat className="h-4 w-4 text-muted-foreground" />} description="Total de execuções de código" />
                    </div>
                </div>
            )}
           
            <div>
                 <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold font-headline text-primary">Seu Histórico</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Veja todos os desafios que você iniciou ou completou.
                    </p>
                </div>
                <div className="flex justify-center items-center gap-2 mb-12">
                     <Button asChild disabled={!stats || history.length === 0}>
                        <a href={getShareUrl()} target="_blank" rel="noopener noreferrer">
                            <RiTwitterXFill className="mr-2 h-4 w-4"/> Compartilhar no X
                        </a>
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" disabled={history.length === 0}>
                                <Trash2 className="mr-2 h-4 w-4" /> Resetar
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Essa ação não pode ser desfeita. Isso apagará permanentemente todo o seu progresso, incluindo desafios concluídos, tentativas e desafios personalizados.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={handleResetHistory}>
                                    Sim, apagar tudo
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
               
                {history.length > 0 ? (
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Desafio</TableHead>
                                        <TableHead className="text-center">Status</TableHead>
                                        <TableHead className="text-center">Tentativas</TableHead>
                                        <TableHead className="text-right">Data de Conclusão</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {history.map(({ challenge, progress }) => (
                                        <TableRow key={challenge.id}>
                                            <TableCell className="font-medium">
                                                <Link href={challenge.isDailyGenerated ? `/challenge/${challenge.id}?daily=true` : `/challenge/${challenge.id}`} className="hover:underline flex items-center gap-2">
                                                    {challenge.isDailyGenerated ? (
                                                        <Calendar className="h-4 w-4 text-accent flex-shrink-0" title="Desafio Diário" />
                                                    ) : challenge.id.startsWith('custom-') ? (
                                                        <Sparkles className="h-4 w-4 text-accent flex-shrink-0" title="Desafio Personalizado por IA" />
                                                    ) : null}
                                                    <span>{challenge.title}</span>
                                                </Link>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {progress.completed ? (
                                                    <Badge variant="default" className="bg-green-500/80 hover:bg-green-500/90">
                                                        <CheckCircle className="mr-1 h-3 w-3" />
                                                        Concluído
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary">
                                                        <Edit3 className="mr-1 h-3 w-3" />
                                                        Em Progresso
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">{progress.attempts}</TableCell>
                                            <TableCell className="text-right">
                                                {progress.completed && progress.completionDate
                                                    ? format(new Date(progress.completionDate), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                                                    : '-'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">Seu histórico está vazio.</p>
                        <p className="text-sm text-muted-foreground mt-2">Comece a resolver um desafio para ver seu progresso aqui!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
