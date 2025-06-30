"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getChallengesByType } from '@/lib/challenges';
import type { Challenge, ChallengeType, Progress } from '@/types';
import { CheckCircle, Filter } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const difficultyTranslations: { [key in 'easy' | 'medium' | 'hard']: string } = {
  easy: 'Fácil',
  medium: 'Médio',
  hard: 'Difícil'
};

export default function ChallengesListPage() {
  const params = useParams<{ type: ChallengeType }>();
  const type = params.type;
  
  if (type !== 'python' && type !== 'sql') {
    notFound();
  }
  
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [progress, setProgress] = useState<Progress>({});
  const [loading, setLoading] = useState(true);
  
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const loadedChallenges = getChallengesByType(type);
      setChallenges(loadedChallenges);

      try {
        const savedProgress = localStorage.getItem('streakcode-progress');
        if (savedProgress) {
          setProgress(JSON.parse(savedProgress));
        }
      } catch (e) {
        console.error("Could not load progress", e);
      }
      setLoading(false);
    }
    if (type) {
      loadData();
    }
  }, [type]);

  const difficultyColors = {
    easy: "bg-green-500/20 text-green-400 border-green-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    hard: "bg-red-500/20 text-red-400 border-red-500/30",
  };
  
  const filteredChallenges = (challenges || [])
    .filter(challenge => difficultyFilter === 'all' || challenge.difficulty === difficultyFilter)
    .filter(challenge => {
      if (statusFilter === 'all') return true;
      const isCompleted = progress[challenge.id]?.completed;
      if (statusFilter === 'completed') return !!isCompleted;
      if (statusFilter === 'uncompleted') return !isCompleted;
      return true;
    });

  const challengeList = filteredChallenges.sort((a, b) => a.numericId - b.numericId);

  const renderFilters = () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filtros</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Filtros</h4>
            <p className="text-sm text-muted-foreground">
              Ajuste os filtros para encontrar desafios.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="flex flex-col gap-2">
                <Label>Dificuldade</Label>
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Dificuldade" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="easy">Fácil</SelectItem>
                        <SelectItem value="medium">Médio</SelectItem>
                        <SelectItem value="hard">Difícil</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex flex-col gap-2">
                <Label>Status</Label>
                <RadioGroup defaultValue="all" value={statusFilter} onValueChange={setStatusFilter} className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2"><RadioGroupItem value="all" id="r1" /><Label htmlFor="r1">Todos</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="completed" id="r2" /><Label htmlFor="r2">Concluídos</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="uncompleted" id="r3" /><Label htmlFor="r3">Não Concluídos</Label></div>
                </RadioGroup>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );

  const pageTitle = type === 'python' ? 'Python' : 'SQL';

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-12">
        <div>
          <h1 className="text-4xl font-bold font-headline text-primary">Desafios de {pageTitle}</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Escolha um desafio para começar a praticar.
          </p>
        </div>
        {renderFilters()}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
      ) : challengeList.length === 0 ? (
        <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum desafio encontrado com os filtros selecionados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {challengeList.map((challenge) => {
            const isCompleted = progress[challenge.id]?.completed;
            return (
              <Link href={`/challenge/${challenge.id}`} key={challenge.id}>
                <Card className="hover:border-accent/80 transition-all duration-200 h-full flex flex-col justify-between">
                  <CardHeader>
                    <CardTitle className="text-lg font-headline flex justify-between items-start">
                      <span>{challenge.numericId}. {challenge.title}</span>
                      {isCompleted && <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline" className={difficultyColors[challenge.difficulty]}>{difficultyTranslations[challenge.difficulty]}</Badge>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

    