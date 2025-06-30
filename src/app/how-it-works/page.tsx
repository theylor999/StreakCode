
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckSquare, BrainCircuit, Sparkles, Share2, User } from 'lucide-react';

export default function AboutPage() {
    const features = [
        {
            icon: <BrainCircuit className="h-8 w-8 text-accent" />,
            title: "Explicações Detalhadas",
            description: "Cada desafio vem com uma explicação completa que detalha o raciocínio por trás da solução, ajudando a entender os conceitos, não apenas decorar o código."
        },
        {
            icon: <Sparkles className="h-8 w-8 text-accent" />,
            title: "Desafios Personalizados com IA",
            description: "Cansado dos mesmos problemas? Gere desafios únicos sobre qualquer tópico de programação em segundos, permitindo uma prática infinita e direcionada."
        },
        {
            icon: <CheckSquare className="h-8 w-8 text-accent" />,
            title: "Streak Diário",
            description: "Mantenha a consistência com o Desafio Diário. A prática regular é a chave para a maestria, e o StreakCode ajuda você a criar esse hábito."
        },
        {
            icon: <Share2 className="h-8 w-8 text-accent" />,
            title: "Compartilhe seu Progresso",
            description: "Mostre suas conquistas para a comunidade! Compartilhe os desafios que você completou e seu progresso de streaks nas redes sociais."
        },
    ];

    return (
        <div className="max-w-4xl mx-auto py-12">
            <div className="text-center mb-16">
                 {/* Passo 1: Adicione sua foto na pasta /public com este nome. */}
                 {/* Passo 2: Se o nome do seu arquivo for diferente, altere o `src` abaixo. */}
                 <Image 
                    src="/creator-photo.jpg"
                    alt="Foto do criador" 
                    width={480} 
                    height={480} 
                    className="rounded-full mx-auto mb-6 border-4 border-accent/30"
                />
                <h1 className="text-4xl font-bold font-headline text-primary">A Ferramenta que Eu Gostaria de Ter Tido</h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                    Criei o StreakCode por uma necessidade pessoal. Ao participar de um processo seletivo com live coding, percebi que precisava estudar mais, mas de uma forma diferente.
                </p>
                 <p className="mt-2 text-lg text-muted-foreground max-w-3xl mx-auto">
                    Muitos sites de programação te levam a decorar respostas para os mesmos algoritmos de sempre. Eu queria algo que me ajudasse a **entender de verdade**. Assim nasceu a ideia de uma plataforma com foco em aprendizado, e não em memorização.
                </p>
                <Button asChild variant="outline" className="mt-8">
                    <a href="https://theylor.vercel.app" target="_blank" rel="noopener noreferrer">
                        <User className="mr-2 h-4 w-4" /> Conheça meu portfólio
                    </a>
                </Button>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {features.map((feature, index) => (
                    <Card key={index} className="bg-card/50 border-accent/10 shadow-lg shadow-accent/5">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                {feature.icon}
                                <CardTitle className="font-headline text-2xl">{feature.title}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
