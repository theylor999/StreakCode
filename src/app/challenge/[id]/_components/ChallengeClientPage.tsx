
"use client";

import { useRef, useState, useEffect, type KeyboardEvent } from "react";
import Image from "next/image";
import type { Challenge } from "@/types";
import { useChallengeManager } from "@/hooks/useChallengeManager";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ChevronLeft, ChevronRight, Code, Lightbulb, Loader2, Lock, Youtube, XCircle } from "lucide-react";
import Link from "next/link";
import { ShareModal } from "./ShareModal";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TutorChat } from "./TutorChat";

export function ChallengeClientPage({ 
  challenge, 
  totalChallenges,
  prevChallengeId,
  nextChallengeId,
  isCustom,
  challengeIndex,
  isDaily
}: { 
  challenge: Challenge, 
  totalChallenges: number,
  prevChallengeId: string | null,
  nextChallengeId: string | null,
  isCustom?: boolean,
  challengeIndex?: number,
  isDaily?: boolean,
}) {
  const {
    code,
    setCode,
    isCompleted,
    attempts,
    isRunning,
    testResults,
    handleRunCode,
    showShareModal,
    setShowShareModal,
  } = useChallengeManager(challenge);

  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);

  const [isSolutionRevealed, setIsSolutionRevealed] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [accordionValue, setAccordionValue] = useState("");
  const [showTutorHint, setShowTutorHint] = useState(false);

  const difficultyTranslations: { [key in 'easy' | 'medium' | 'hard']: string } = {
    easy: 'Fácil',
    medium: 'Médio',
    hard: 'Difícil'
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea && cursorPosition !== null) {
      requestAnimationFrame(() => {
        textarea.selectionStart = cursorPosition;
        textarea.selectionEnd = cursorPosition;
        setCursorPosition(null);
      });
    }
  }, [code, cursorPosition]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const { value, selectionStart, selectionEnd } = e.currentTarget;
      
      const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
      const currentLine = value.substring(lineStart, selectionStart);
      const indentationMatch = currentLine.match(/^\s*/);
      const currentIndentation = indentationMatch ? indentationMatch[0] : '';
      
      let newIndentation = currentIndentation;
      if (challenge.type === 'python' && currentLine.trim().endsWith(':')) {
        newIndentation += '  ';
      }

      const newValue = 
        value.substring(0, selectionStart) +
        '\n' + newIndentation +
        value.substring(selectionEnd);
      
      setCode(newValue);
      
      const newCursorPos = selectionStart + 1 + newIndentation.length;
      setCursorPosition(newCursorPos);
    }
  };

  const handleShowHint = () => {
    if (challenge.solutionHint) {
      toast({
        title: "Dica",
        description: challenge.solutionHint,
      });
    }
  };

  const difficultyColors = {
    easy: "bg-green-500/20 text-green-400 border-green-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    hard: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  const onRunCode = async () => {
    const { allPassed, newAttempts } = await handleRunCode();
    if (!allPassed && newAttempts === 1) {
        setShowTutorHint(true);
        setTimeout(() => setShowTutorHint(false), 4000);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-row items-start justify-between">
            <div>
                 <p className="text-sm text-accent font-headline">
                    {isDaily
                        ? `Desafio Diário - ${difficultyTranslations[challenge.difficulty]}`
                        : isCustom 
                          ? `Desafio Personalizado ${challengeIndex} de ${totalChallenges}`
                          : `Desafio Python ${challenge.numericId} de ${totalChallenges}`
                    }
                </p>
                <h1 className="font-headline text-3xl mt-1">{challenge.title}</h1>
            </div>
            <Badge variant="outline" className={cn("flex-shrink-0", difficultyColors[challenge.difficulty])}>{difficultyTranslations[challenge.difficulty]}</Badge>
        </div>

        {/* Question */}
        <Card className="border-accent/20 shadow-lg shadow-accent/5">
            <CardContent className="p-6">
                <p className="text-muted-foreground whitespace-pre-wrap">{challenge.description}</p>
                {challenge.youtubeLink && (
                    <Button asChild variant="outline" className="mt-6 border-red-500/50 hover:bg-red-500/10 hover:text-red-400">
                    <a href={challenge.youtubeLink} target="_blank" rel="noopener noreferrer">
                        <Youtube className="mr-2 h-4 w-4" /> Ver tutorial no YouTube
                    </a>
                    </Button>
                )}
            </CardContent>
        </Card>
        
        {/* Example */}
        {challenge.example && (
            <Card className="border-accent/20 shadow-lg shadow-accent/5">
                <CardHeader>
                    <CardTitle className="font-headline text-xl">Exemplo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-muted-foreground">Input:</h4>
                        <pre className="mt-2 p-3 bg-muted rounded-md font-code text-sm"><code>{challenge.example.input}</code></pre>
                    </div>
                    <div>
                        <h4 className="font-semibold text-muted-foreground">Output Esperado:</h4>
                        <pre className="mt-2 p-3 bg-muted rounded-md font-code text-sm"><code>{challenge.example.output}</code></pre>
                    </div>
                </CardContent>
            </Card>
        )}

        {/* Code Editor */}
        <div className="w-full">
            <h2 className="font-headline text-2xl mb-4">Sua Solução</h2>
            <div className="bg-card border rounded-lg shadow-lg relative font-code">
                <div className="px-4 py-2 border-b flex justify-between items-center">
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <Code className="w-4 h-4 text-accent"/>
                        <span>solution.py</span>
                    </p>
                    {isCompleted && <span className="text-xs text-green-400 flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Concluído</span>}
                </div>
                <Textarea
                    ref={textareaRef}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/#@/g, '  '))}
                    onKeyDown={handleKeyDown}
                    placeholder={`Seu código Python aqui...`}
                    className="h-80 w-full bg-transparent border-0 rounded-none focus-visible:ring-0 resize-none font-code text-base"
                />
                <div className="px-4 py-3 border-t flex items-center gap-2">
                    <Button onClick={onRunCode} disabled={isRunning} className="flex-grow bg-primary hover:bg-primary/90">
                        {isRunning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {isRunning ? 'Executando...' : 'Executar & Testar'}
                    </Button>
                    {challenge.solutionHint && (
                        <Button onClick={handleShowHint} variant="outline" disabled={isRunning} title="Obter Dica">
                            <Lightbulb className="mr-2 h-4 w-4" />
                            Dica
                        </Button>
                    )}
                </div>
            </div>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div>
            <h3 className="font-headline text-lg mb-2">Resultados dos Testes ({attempts} {attempts > 1 ? 'tentativas' : 'tentativa'})</h3>
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div key={index} className={`p-4 rounded-md ${result.passed ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                  <div className="flex items-center">
                    {result.passed ? <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0"/> : <XCircle className="w-5 h-5 mr-3 flex-shrink-0"/>}
                    <p className="font-semibold">Teste {index + 1}: {result.passed ? 'Passou' : 'Falhou'}</p>
                  </div>
                  {!result.passed && (
                    <div className="mt-3 pl-8 text-sm text-muted-foreground font-code">
                        Input: <span className="text-card-foreground">{JSON.stringify(result.input)}</span> | Esperado: <span className="text-card-foreground">{JSON.stringify(result.expected)}</span> | Recebido: <span className="text-red-400">{JSON.stringify(result.output)}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Explanation & Solution */}
        {challenge.explanation && (
          <>
            <Accordion 
              type="single" 
              collapsible 
              className="w-full"
              value={accordionValue}
              onValueChange={setAccordionValue}
            >
              <AccordionItem value="item-1" className="border-accent/20">
                <AccordionTrigger 
                  className="text-xl font-headline hover:no-underline"
                  onClick={(e) => {
                    if (!isCompleted && !isSolutionRevealed) {
                      if (accordionValue !== 'item-1') {
                        e.preventDefault();
                        setShowConfirmDialog(true);
                      }
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    {!isCompleted && !isSolutionRevealed && <Lock className="w-5 h-5" />}
                    Explicação e Solução
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-muted-foreground leading-relaxed">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        pre: ({node, ...props}) => (
                          <div className="my-4 overflow-auto w-full rounded-md bg-muted font-code p-4">
                            <pre {...props} className="text-sm whitespace-pre-wrap" />
                          </div>
                        ),
                        code: ({node, inline, className, children, ...props}) => {
                          return !inline ? (
                            <code className={cn("whitespace-pre-wrap", className)} {...props}>
                              {children}
                            </code>
                          ) : (
                            <code className="font-code bg-muted px-1.5 py-1 rounded-md" {...props}>
                              {children}
                            </code>
                          )
                        },
                        p: ({node, ...props}) => <p className="mb-4" {...props} />,
                        h3: ({node, ...props}) => <h3 className="font-headline text-lg mt-6 mb-2 text-card-foreground" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-bold text-card-foreground" {...props} />,
                      }}
                    >{challenge.explanation}</ReactMarkdown>
                  </div>
                  <div className="mt-6">
                      <h4 className="font-semibold mb-2 text-card-foreground">Solução Final:</h4>
                      <div className="p-4 bg-muted rounded-md font-code">
                          <pre><code className="text-sm whitespace-pre-wrap">{challenge.solution}</code></pre>
                      </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Ver a solução pode impactar sua experiência de aprendizado. Recomendamos que tente resolver o desafio por conta própria primeiro. Deseja continuar?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => {
                    setIsSolutionRevealed(true);
                    setAccordionValue('item-1');
                    setShowConfirmDialog(false);
                  }}>
                    Ver Solução
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>

      <TutorChat challenge={challenge} />

      {showTutorHint && (
        <div className="fixed bottom-24 right-4 bg-accent text-accent-foreground p-3 rounded-lg shadow-lg z-50 animate-in fade-in zoom-in-95">
            <p>Precisa de uma mãozinha? Pergunte para a nossa IA!</p>
        </div>
      )}
      
      {/* Navigation */}
      {!isDaily && (
        <div className="flex justify-between mt-12">
          {prevChallengeId ? (
            <Button asChild variant="outline">
              <Link href={`/challenge/${prevChallengeId}`}><ChevronLeft className="mr-2 h-4 w-4"/> Anterior</Link>
            </Button>
          ) : <div />}
          {nextChallengeId ? (
            <Button asChild variant="outline">
              <Link href={`/challenge/${nextChallengeId}`}>Próximo <ChevronRight className="ml-2 h-4 w-4"/></Link>
            </Button>
          ) : <div />}
        </div>
      )}

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        challenge={challenge}
        attempts={attempts}
        isDaily={isDaily}
      />
    </>
  );
}

    

    