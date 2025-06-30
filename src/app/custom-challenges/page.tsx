"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Loader2, Info, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

import type { Challenge } from '@/types';
import { generateChallenge, type GenerateChallengeInput } from '@/ai/flows/generate-challenge-flow';
import { getCustomChallenges, addCustomChallenge, removeCustomChallenge } from '@/lib/challenges';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  topic: z.string().max(100, "O tópico deve ter no máximo 100 caracteres.").optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
});

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

export default function CustomChallengesPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [customChallenges, setCustomChallenges] = useState<Challenge[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  const refreshAndFilterChallenges = () => {
    const allCustom = getCustomChallenges();
    const filtered = allCustom.filter(c => !c.isDailyGenerated);
    setCustomChallenges(filtered);
  };

  useEffect(() => {
      refreshAndFilterChallenges();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
          topic: '',
          difficulty: 'easy',
      },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
      setIsLoading(true);
      try {
          const allCreatedChallenges = getCustomChallenges();
          const input: GenerateChallengeInput = {
              ...values,
              language: 'python',
              existingTitles: allCreatedChallenges.map(c => c.title),
          };
          const newChallenge = await generateChallenge(input);
          
          addCustomChallenge(newChallenge);
          refreshAndFilterChallenges();
          
          toast({
              title: "Desafio gerado com sucesso!",
              description: "Você será redirecionado para o seu novo desafio.",
          });

          router.push(`/challenge/${newChallenge.id}`);

      } catch (error) {
          console.error("Failed to generate challenge:", error);
          toast({
              variant: 'destructive',
              title: "Erro ao gerar desafio",
              description: "A IA não conseguiu criar um desafio. Por favor, tente novamente em alguns instantes.",
          });
      } finally {
          setIsLoading(false);
      }
  }

  function handleDelete(challengeId: string) {
    removeCustomChallenge(challengeId);
    refreshAndFilterChallenges();
    toast({
        title: "Desafio removido",
        description: "O desafio personalizado foi removido da sua lista.",
    });
  }
  
  return (
      <div className="max-w-7xl mx-auto py-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
              <Card className="sticky top-24">
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                          <Sparkles className="text-accent" />
                          Gerador de Desafios
                      </CardTitle>
                      <CardDescription>
                          Crie um desafio de Python personalizado usando IA.
                      </CardDescription>
                  </CardHeader>
                  <CardContent>
                      <Form {...form}>
                          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                              <FormField
                                  control={form.control}
                                  name="topic"
                                  render={({ field }) => (
                                      <FormItem>
                                          <FormLabel>Tópico do Desafio (Opcional)</FormLabel>
                                          <FormControl>
                                              <Input placeholder="Ex: manipulação de strings, listas..." {...field} />
                                          </FormControl>
                                          <FormMessage />
                                      </FormItem>
                                  )}
                              />
                              <FormField
                                  control={form.control}
                                  name="difficulty"
                                  render={({ field }) => (
                                      <FormItem>
                                          <FormLabel>Dificuldade</FormLabel>
                                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                                              <FormControl>
                                                  <SelectTrigger>
                                                      <SelectValue placeholder="Selecione a dificuldade" />
                                                  </SelectTrigger>
                                              </FormControl>
                                              <SelectContent>
                                                  <SelectItem value="easy">Fácil</SelectItem>
                                                  <SelectItem value="medium">Médio</SelectItem>
                                                  <SelectItem value="hard">Difícil</SelectItem>
                                              </SelectContent>
                                          </Select>
                                          <FormMessage />
                                      </FormItem>
                                  )}
                              />
                              <div className="flex items-center gap-2">
                                <FormLabel>Linguagem</FormLabel>
                                 <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger type="button"><Info className="h-4 w-4 text-muted-foreground" /></TooltipTrigger>
                                        <TooltipContent>
                                            <p>Outras linguagens como SQL serão adicionadas em breve.</p>
                                        </TooltipContent>
                                    </Tooltip>
                                 </TooltipProvider>
                              </div>
                              <Button variant="outline" disabled className="bg-muted">Python</Button>

                              <Button type="submit" disabled={isLoading} className="w-full">
                                  {isLoading ? (
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  ) : (
                                      <Sparkles className="mr-2 h-4 w-4" />
                                  )}
                                  Gerar Desafio
                              </Button>
                          </form>
                      </Form>
                  </CardContent>
              </Card>
          </div>
          <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold font-headline text-primary mb-6">Seus Desafios Personalizados</h2>
              {customChallenges.length > 0 ? (
                  <div className="space-y-4">
                      {customChallenges.map(challenge => (
                            <Card key={challenge.id} className="hover:border-accent/80 transition-all duration-200">
                                <CardContent className="p-4 flex justify-between items-center gap-4">
                                    <Link href={`/challenge/${challenge.id}`} className="flex-grow">
                                        <span className="font-semibold hover:underline">{challenge.title}</span>
                                    </Link>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <Badge variant="outline" className={difficultyColors[challenge.difficulty]}>{difficultyTranslations[challenge.difficulty]}</Badge>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-7 w-7 text-muted-foreground" 
                                            onClick={() => handleDelete(challenge.id)}
                                            aria-label="Remover desafio"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                      ))}
                  </div>
              ) : (
                   <div className="text-center py-12 border-2 border-dashed rounded-lg">
                      <p className="text-muted-foreground">Você ainda não gerou nenhum desafio.</p>
                      <p className="text-sm text-muted-foreground mt-2">Use o gerador ao lado para começar!</p>
                  </div>
              )}
          </div>
      </div>
    )
}
