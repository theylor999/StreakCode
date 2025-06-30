
"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Challenge } from "@/types"
import { Check, Copy, Terminal } from "lucide-react"
import { RiTwitterXFill } from "react-icons/ri"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  challenge: Challenge
  attempts: number
  isDaily?: boolean
}

export function ShareModal({ isOpen, onClose, challenge, attempts, isDaily }: ShareModalProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  
  const siteUrl = "https://streak-code.vercel.app"
  let shareText: string;

  if (isDaily) {
    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleString('pt-BR', { month: 'long' });
    shareText = `Concluí o desafio diário de ${day} de ${month} em ${attempts} ${attempts > 1 ? 'tentativas' : 'tentativa'}! #StreakCode`
  } else {
    shareText = `🚀 Completei o desafio "${challenge.title}" do StreakCode em ${attempts} ${attempts > 1 ? 'tentativas' : 'tentativa'}! #StreakCode`
  }

  const fullShareText = `${shareText} ${siteUrl}`
  const twitterUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(fullShareText)}`

  const handleCopy = () => {
    navigator.clipboard.writeText(fullShareText).then(() => {
      setCopied(true)
      toast({ title: "Copiado!", description: "Texto copiado para a área de transferência." })
      setTimeout(() => setCopied(false), 2000)
    })
  }

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-center">Parabéns!</DialogTitle>
          <DialogDescription className="text-center">
            Você completou o desafio. Compartilhe seu progresso!
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div id="share-image" className="p-6 rounded-lg border-2 border-accent/50 bg-background text-foreground">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-6 h-6 text-accent" />
                <span className="font-bold font-headline text-lg">StreakCode</span>
              </div>
              <span className={cn("text-xs font-semibold px-2 py-1 rounded-full border", difficultyColors[challenge.difficulty])}>
                {difficultyTranslations[challenge.difficulty]}
              </span>
            </div>
            <div className="my-6 text-center">
              <p className="text-muted-foreground">{isDaily ? 'Desafio Diário Concluído' : 'Desafio Concluído'}</p>
              <h2 className="text-2xl font-bold font-headline mt-1">{challenge.title}</h2>
            </div>
            <div className="text-center">
              <p className="text-sm">Completo em <span className="font-bold text-accent">{attempts}</span> {attempts > 1 ? 'tentativas' : 'tentativa'}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center">Em breve: download da imagem para compartilhar.</p>

          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <p className="text-sm p-3 bg-muted rounded-md">{shareText}</p>
            </div>
            <Button type="button" size="icon" className="px-3" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <div className="flex justify-center">
            <Button asChild className="bg-foreground text-background hover:bg-foreground/90 w-full">
                <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
                    <RiTwitterXFill className="mr-2 h-4 w-4" /> Compartilhar no X
                </a>
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

    

    
