# StreakCode

StreakCode é uma plataforma de aprendizado de programação projetada para ajudar desenvolvedores a aprimorar suas habilidades em algoritmos e se preparar para entrevistas técnicas, com foco em aprendizado real em vez de memorização.

**[🎉 Veja o StreakCode em Ação (Live Demo no Firebase App Hosting)!](https://streakcode-app.web.app)**

## Visão Geral do Aplicativo (Funcionalidades Principais)

*   **Interface Terminal-Style**: Uma interface limpa e imersiva que simula um ambiente de codificação.
*   **Desafios Diários e Personalizados**: Mantenha a consistência com um desafio diário gerado por IA ou crie seus próprios desafios sob demanda.
*   **Tutor com IA**: Em cada desafio, um assistente de IA (StreakCode AI) está disponível para fornecer dicas e explicações, agindo como um professor particular.
*   **Acompanhamento de Progresso**: Acompanhe seu histórico, estatísticas e streaks de dias consecutivos para se manter motivado.
*   **Compartilhamento Social**: Compartilhe suas conquistas, desafios concluídos e estatísticas de progresso no X (antigo Twitter).

## Funcionalidades Detalhadas

- **Ambiente de Desafio**:
    - Editor de código integrado ao navegador para resolver desafios em Python.
    - Execução de código e testes automatizados contra casos de teste predefinidos.
    - Feedback instantâneo sobre o sucesso ou falha dos testes.
- **Geração de Desafios com IA**:
    - Crie desafios de Python ilimitados sobre qualquer tópico.
    - Selecione a dificuldade (Fácil, Médio, Difícil).
    - O sistema evita a geração de desafios duplicados, garantindo conteúdo sempre novo.
- **Desafio Diário e Streaks**:
    - Gere um desafio único por dia com base na sua dificuldade preferida.
    - Acompanhe os dias concluídos em um calendário visual.
    - Calcule e exiba sua "streak" (sequência de dias consecutivos) atual e a mais longa.
- **Tutor de IA (StreakCode AI)**:
    - Um chat integrado em cada desafio, alimentado pelo Gemini.
    - O tutor entende o contexto do desafio e ajuda com dicas e conceitos, sem dar a solução completa.
    - Limite de 10 mensagens por desafio para incentivar a resolução autônoma.
    - Histórico de chat salvo localmente (`localStorage`).
- **Histórico e Estatísticas**:
    - Uma página dedicada para visualizar todos os desafios iniciados e concluídos.
    - Estatísticas detalhadas: total de desafios concluídos, tentativas, streak atual e maior streak.
    - Opção para compartilhar seu progresso no X.
    - Funcionalidade para resetar todo o progresso local.
- **Experiência do Usuário**:
    - Persistência de dados locais usando `localStorage` (progresso, desafios customizados, tema, etc.).
    - Modo Claro e Escuro.
    - Design totalmente responsivo para desktop e mobile.

## Design e Estilo

O StreakCode foi projetado com uma estética de terminal moderna e minimalista:
- **Cores**: Paleta de cores inspirada em terminais de programação, com um azul escuro (`#37718E`) como cor primária, um fundo quase preto (`#212931`) e um laranja-amarelado (`#DCA043`) como cor de destaque.
- **Tipografia**:
    - **Títulos**: 'Space Grotesk'
    - **Corpo**: 'Inter'
    - **Código**: 'Source Code Pro' (monospaçada para clareza).
- **Iconografia**: Ícones limpos e consistentes da biblioteca `lucide-react`.
- **Componentes UI**: Utilização de componentes `ShadCN/UI`, customizados para seguir a identidade visual do projeto.

## Stack Tecnológica e Bibliotecas

- **Next.js (App Router)**: Framework React para desenvolvimento full-stack, utilizado por sua performance e roteamento baseado em arquivos.
- **React**: Biblioteca JavaScript para construção de interfaces de usuário.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática.
- **Tailwind CSS**: Framework CSS utility-first para estilização rápida e responsiva.
- **ShadCN/UI**: Coleção de componentes de UI reutilizáveis e acessíveis.
- **Genkit (Google AI)**: Toolkit para integração com modelos de IA (Gemini) para as funcionalidades de geração de desafios e tutor de IA.
- **Zod**: Biblioteca para validação de esquemas, usada nos fluxos do Genkit.
- **localStorage**: API do navegador utilizada para persistir todo o progresso e dados do usuário localmente.
- **date-fns**: Biblioteca para manipulação de datas, usada no calendário de desafios diários e cálculo de streaks.
- **React Hook Form**: Biblioteca para gerenciamento de formulários (usada no gerador de desafios).
- **Firebase (Admin SDK)**: Utilizado em rotas de API para coletar estatísticas de uso anônimas.

## Decisões Técnicas e Arquitetura

- **Estrutura do Projeto**: Organizado com o App Router do Next.js, com uma clara separação entre páginas, componentes de UI (`components/ui`), componentes de aplicação, hooks customizados (`hooks`), lógica de negócio (`lib`) e fluxos de IA (`ai/flows`).
- **Gerenciamento de Estado**: O estado é primariamente gerenciado no lado do cliente com os hooks do React (`useState`, `useEffect`, `useCallback`) e hooks customizados (`useChallengeManager`, `useTheme`). A persistência é garantida pelo uso extensivo de `localStorage`, tornando a aplicação funcional offline após o primeiro carregamento, sem a necessidade de um banco de dados de usuário.
- **Inteligência Artificial**: Toda a lógica de IA é encapsulada em "fluxos" do Genkit, que são Ações de Servidor do Next.js. Isso mantém o código de front-end limpo, delegando as chamadas à API do Gemini para o servidor.
- **Componentização**: A UI é construída com componentes reutilizáveis. Os componentes `ShadCN/UI` servem como base, com componentes de aplicação customizados para funcionalidades específicas.
- **Dados dos Desafios**: A aplicação utiliza uma lista de desafios estáticos (armazenados em `src/lib/challenges`) que servem de base, e permite que o usuário expanda essa lista com desafios gerados dinamicamente pela IA, que são salvos localmente.

## Uso de Inteligência Artificial no Desenvolvimento

Este projeto foi desenvolvido com o auxílio intensivo do **Firebase Studio**, uma ferramenta de desenvolvimento assistida por IA.

- **Geração de Código e Prototipagem**: Grande parte da estrutura inicial dos componentes de UI, a lógica de gerenciamento de estado (`useChallengeManager`) e a implementação de novas funcionalidades (como o Desafio Diário e o Tutor de IA) foram geradas ou significativamente aceleradas através de conversas com a IA.
- **Refatoração e Correção de Erros**: A IA foi fundamental para identificar e corrigir erros de runtime (como o erro de exportação em arquivos "use server") e para refatorar o código para maior clareza e performance.
- **Implementação de Funcionalidades Complexas**: Funcionalidades que envolviam múltiplos arquivos e lógicas, como a integração do calendário de streaks e o sistema de chat com o tutor, foram implementadas com a IA gerando a estrutura e a lógica base, que foram então refinadas.

## Ideias para Desenvolvimento Futuro

- **Autenticação de Usuários**: Implementar um sistema de login (ex: Firebase Auth) para salvar o progresso na nuvem.
- **Suporte a Mais Linguagens**: Expandir a plataforma para incluir desafios de SQL (já iniciado), JavaScript, etc.
- **Leaderboards**: Placar de líderes semanal/mensal com base em pontos ou streaks.
- **Gamificação**: Adicionar emblemas e recompensas por atingir marcos (ex: completar 10 desafios difíceis, manter uma streak de 30 dias).

## Como Rodar o Projeto Localmente

Siga os passos abaixo para configurar e rodar o StreakCode localmente.

### Pré-requisitos

- **Node.js**: Versão 18.x ou superior.
- **npm** ou **yarn**: Gerenciador de pacotes.
- **Git**: Para clonar o repositório.

### Instalação

1.  **Clone o repositório**:
    ```bash
    git clone https://github.com/theylor999/StreakCode
    cd StreakCode
    ```

2.  **Instale as dependências**:
    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente**:
    -   Renomeie o arquivo `.env.example` para `.env`.
    -   Preencha as variáveis de ambiente com suas chaves do Firebase e do Google AI (Genkit). Você precisará de um projeto Firebase e credenciais de serviço para as estatísticas e uma API key do Google AI para o Genkit.

### Rodando a Aplicação

1.  **Inicie o servidor de desenvolvimento do Next.js**:
    ```bash
    npm run dev
    ```
    A aplicação estará disponível em `http://localhost:9002`.

2.  **(Opcional) Inicie o inspetor do Genkit**:
    Para depurar os fluxos de IA, você pode rodar o Genkit Dev UI em um terminal separado:
    ```bash
    npm run genkit:dev
    ```
    Isso iniciará uma interface em `http://localhost:4000` para inspecionar as chamadas de IA.

## Como Implantar no Vercel

Implantar o StreakCode no Vercel é um processo simples, pois a plataforma é otimizada para projetos Next.js.

1.  **Repositório Git**:
    -   Certifique-se de que seu projeto está em um repositório Git (GitHub, GitLab, ou Bitbucket).

2.  **Crie um Projeto no Vercel**:
    -   Faça login na sua conta Vercel.
    -   Clique em "Add New..." -> "Project".
    -   Importe o repositório Git do seu projeto.

3.  **Configure o Projeto**:
    -   O Vercel detectará automaticamente que é um projeto Next.js e preencherá as configurações de build. Você não precisa alterar nada aqui.

4.  **Adicione as Variáveis de Ambiente**:
    -   Esta é a etapa mais importante. Na página de configuração do seu projeto no Vercel, vá para a aba "Settings" -> "Environment Variables".
    -   Copie todas as variáveis do seu arquivo `.env.example` e adicione seus valores correspondentes.
    -   **IMPORTANTE**: Para a variável `FIREBASE_PRIVATE_KEY`, copie e cole o valor completo da sua chave privada, incluindo `-----BEGIN PRIVATE KEY-----` e `-----END PRIVATE KEY-----`. O Vercel lida com chaves de múltiplas linhas corretamente.

5.  **Implante**:
    -   Clique no botão "Deploy". O Vercel irá construir e implantar sua aplicação. Após alguns minutos, seu StreakCode estará online!

## Estrutura do Projeto (Principais Pastas)

```
StreakCode/
├── public/                     # Arquivos estáticos
├── src/
│   ├── app/                    # Rotas e layouts do Next.js App Router
│   ├── ai/                     # Fluxos de IA (Genkit)
│   │   ├── flows/
│   │   └── genkit.ts           # Configuração do Genkit
│   ├── components/
│   │   ├── ui/                 # Componentes ShadCN/UI
│   │   └── ...                 # Outros componentes da aplicação
│   ├── hooks/                  # Hooks customizados (useChallengeManager, useToast, etc.)
│   ├── lib/                    # Utilitários, tipos, dados de desafios, etc.
│   └── types/                  # Definições de tipos TypeScript
├── .env.example                # Arquivo de exemplo para variáveis de ambiente
├── next.config.ts              # Configurações do Next.js
├── package.json
├── tailwind.config.ts          # Configurações do Tailwind CSS
└── tsconfig.json               # Configurações do TypeScript
```
