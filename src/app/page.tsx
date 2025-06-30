
import { Button } from "@/components/ui/button";
import { Code, Sparkles, Calendar } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <h1 className="text-5xl font-bold font-headline text-primary">
        Bem-vindo ao StreakCode
      </h1>
      <p className="mt-4 text-xl text-muted-foreground max-w-2xl">
        Aprimore suas habilidades de programação e prepare-se para entrevistas com nossos desafios diários.
      </p>
      <div className="mt-12 flex flex-col items-center gap-6">
          <Button asChild size="lg" className="w-64">
            <Link href="/daily-challenge">
              <Calendar className="mr-2" />
              Desafio Diário
            </Link>
          </Button>
          <Button asChild size="lg" className="w-64">
            <Link href="/challenges/python">
              <Code className="mr-2" />
              Desafios Python
            </Link>
          </Button>
          <Button asChild size="lg" className="w-64">
            <Link href="/custom-challenges">
              <Sparkles className="mr-2" />
              Desafios Personalizados
            </Link>
          </Button>
      </div>
    </div>
  );
}

    