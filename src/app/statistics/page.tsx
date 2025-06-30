"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Target, CheckCircle, BarChart2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Stats } from '@/types';

const StatCard = ({ title, value, icon, description, loading }: { title: string, value: string | number, icon: React.ReactNode, description: string, loading?: boolean }) => {
    if (loading) {
        return <Skeleton className="h-28" />
    }
    return (
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
}

export default function StatisticsPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const response = await fetch('/api/stats');
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                } else {
                    console.error('Failed to fetch stats');
                    setStats(null); // Set to null to show an error or empty state
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
                setStats(null);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    const statValue = (value: number | undefined) => loading ? 0 : value?.toLocaleString() ?? '0';

    return (
        <div className="max-w-4xl mx-auto py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold font-headline text-primary">Estatísticas da Plataforma</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Progresso e engajamento da comunidade de desenvolvedores.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <StatCard 
                    title="Usuários Ativos" 
                    value={statValue(stats?.totalUsers)}
                    icon={<Users className="h-4 w-4 text-muted-foreground" />} 
                    description="Total de desenvolvedores na plataforma." 
                    loading={loading}
                />
                <StatCard 
                    title="Desafios Concluídos" 
                    value={statValue(stats?.totalCompleted)}
                    icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />} 
                    description="Resolvidos por toda a comunidade." 
                    loading={loading}
                />
                <StatCard 
                    title="Desafios Iniciados" 
                    value={statValue(stats?.startedChallenges)}
                    icon={<BarChart2 className="h-4 w-4 text-muted-foreground" />} 
                    description="Total de desafios que foram começados." 
                    loading={loading}
                />
                <StatCard 
                    title="Tentativas Totais" 
                    value={statValue(stats?.totalAttempts)}
                    icon={<Target className="h-4 w-4 text-muted-foreground" />} 
                    description="Execuções de código em toda a plataforma." 
                    loading={loading}
                />
            </div>
             { !loading && !stats && (
                <div className="text-center mt-8 text-muted-foreground">
                    Não foi possível carregar as estatísticas. Verifique a configuração do Firebase.
                </div>
            )}
        </div>
    );
}
