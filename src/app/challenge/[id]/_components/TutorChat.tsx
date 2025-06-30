
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { Challenge, ChatMessage } from "@/types";
import { tutorChat } from "@/ai/flows/tutor-chat-flow";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Loader2, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const MAX_MESSAGES = 10; // 5 questions from user, 5 from AI

export function TutorChat({ challenge }: { challenge: Challenge }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const chatHistoryKey = `streakcode-chat-history-${challenge.id}`;

  const saveHistory = useCallback((newMessages: ChatMessage[]) => {
    setMessages(newMessages);
    try {
      localStorage.setItem(chatHistoryKey, JSON.stringify(newMessages));
    } catch (error) {
      console.error("Failed to save chat history:", error);
    }
  }, [chatHistoryKey]);

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(chatHistoryKey);
      if (savedHistory) {
        setMessages(JSON.parse(savedHistory));
      } else {
        const initialMessage: ChatMessage = { role: "model", content: "Olá! Se tiver qualquer dúvida sobre este desafio, pode me perguntar. Estou aqui para ajudar a guiar você até a solução!" };
        saveHistory([initialMessage]);
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
      setMessages([]);
    }
  }, [challenge.id, chatHistoryKey, saveHistory]);

  useEffect(() => {
    if (isOpen && scrollAreaRef.current) {
        setTimeout(() => {
            if (scrollAreaRef.current) {
              scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth',
              });
            }
        }, 100);
    }
  }, [messages, isOpen]);
  
  const trackTutorUsage = () => {
    const tutorUsedKey = `streakcode-tutor-used-${challenge.id}`;
    if (!localStorage.getItem(tutorUsedKey)) {
        try {
            fetch('/api/stats/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isTutorUsed: true })
            });
            localStorage.setItem(tutorUsedKey, 'true');
        } catch (error) {
            console.error('Failed to track tutor usage:', error);
        }
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || messages.length >= MAX_MESSAGES) return;

    trackTutorUsage();

    const newUserMessage: ChatMessage = { role: "user", content: input };
    const updatedMessages = [...messages, newUserMessage];
    saveHistory(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await tutorChat({
        question: input,
        challenge: {
          title: challenge.title,
          description: challenge.description,
          starterCode: challenge.starterCode,
          solutionHint: challenge.solutionHint
        },
        history: messages,
      });
      
      const aiMessage: ChatMessage = { role: "model", content: response };
      saveHistory([...updatedMessages, aiMessage]);

    } catch (error) {
      console.error("Error calling AI tutor:", error);
      toast({
        variant: 'destructive',
        title: "Erro no Tutor",
        description: "Não foi possível obter uma resposta da IA. Tente novamente."
      });
      saveHistory(messages);
    } finally {
      setIsLoading(false);
    }
  };
  
  const messagesSent = messages.filter(m => m.role === 'user').length;
  const messagesRemaining = Math.floor((MAX_MESSAGES / 2) - messagesSent);
  const isChatDisabled = messages.length >= MAX_MESSAGES;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
            variant="default"
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-40"
        >
            <MessageCircle className="h-7 w-7" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" align="end" className="w-[400px] h-[500px] mr-2 flex flex-col p-0">
         <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-headline text-lg flex items-center gap-2">
                <Sparkles className="text-accent h-5 w-5"/>
                StreakCode AI
            </h3>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4"/>
            </Button>
         </div>

        <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
           <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-3",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "model" && (
                  <Avatar className="h-8 w-8 bg-accent flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-accent-foreground" />
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg p-3 text-sm",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {message.content}
                </div>
                 {message.role === "user" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="font-code text-xs">{'>_'}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {isLoading && (
                <div className="flex items-start gap-3 justify-start">
                    <Avatar className="h-8 w-8 bg-accent flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-accent-foreground" />
                    </Avatar>
                    <div className="bg-muted rounded-lg p-3">
                        <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                </div>
            )}
           </div>
        </ScrollArea>
        <div className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
            <Input
                id="message"
                placeholder={isChatDisabled ? "Você atingiu o limite de mensagens." : "Pergunte sobre o desafio..."}
                className="flex-1"
                autoComplete="off"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading || isChatDisabled}
            />
            <Button type="submit" size="icon" disabled={isLoading || isChatDisabled}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Enviar mensagem</span>
            </Button>
            </form>
            <p className="text-xs text-muted-foreground text-center mt-2 px-2">
                {isChatDisabled
                ? "Você usou todas as suas ajudas. Tente resolver sozinho, use uma dica ou veja a solução."
                : `Você pode enviar mais ${messagesRemaining} ${messagesRemaining === 1 ? 'mensagem' : 'mensagens'}.`}
            </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
