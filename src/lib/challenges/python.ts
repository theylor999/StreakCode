import type { Challenge } from '@/types';

export const pythonChallenges: Challenge[] = [
  // --- Faceis (25) ---
  {
    id: 'python-1',
    numericId: 1,
    type: 'python',
    title: 'Soma de Dois Números',
    difficulty: 'easy',
    description: 'Escreva uma função em Python que receba dois números como entrada e retorne a soma deles.',
    starterCode: 'def soma(a, b):\n  # Seu código aqui\n  return',
    starterFunctionName: 'soma',
    testCases: [
      { input: [2, 3], expected: 5 },
      { input: [-1, 1], expected: 0 },
      { input: [10, 20], expected: 30 },
    ],
    solution: 'def soma(a, b):\n  return a + b',
    solutionHint: 'Use o operador de adição (+) para somar os dois números.',
    example: {
      input: 'a = 2, b = 3',
      output: '5',
    },
    explanation: `**Raciocínio:**
Este é um dos problemas mais fundamentais em programação. A ideia é simples: pegar dois valores numéricos e combiná-los usando a operação de adição.

**Código e Ferramentas:**
Em Python, o operador de adição é o símbolo \`+\`. A função deve simplesmente aplicar este operador aos dois argumentos de entrada (\`a\` e \`b\`) e usar a palavra-chave \`return\` para enviar o resultado de volta.

\`\`\`python
def soma(a, b):
  # A expressão 'a + b' calcula a soma.
  # 'return' envia o valor de volta para quem chamou a função.
  return a + b
\`\`\`

**Abordagens Erradas Comuns:**
É difícil errar neste problema, mas um iniciante poderia tentar converter os números para strings e concatená-los, o que resultaria em um resultado incorreto (ex: \`"2" + "3"\` se torna \`"23"\`, não \`5\`). É crucial garantir que as entradas sejam tratadas como números.`,
  },
  {
    id: 'python-2',
    numericId: 2,
    type: 'python',
    title: 'Encontrar o Maior Número',
    difficulty: 'easy',
    description: 'Escreva uma função que receba uma lista de números e retorne o maior número da lista.',
    starterCode: 'def maior_numero(numeros):\n  # Seu código aqui\n  return',
    starterFunctionName: 'maior_numero',
    testCases: [
      { input: [[1, 2, 3, 4, 5]], expected: 5 },
      { input: [[-1, -5, -3]], expected: -1 },
      { input: [[100, 1, 50]], expected: 100 },
    ],
    solution: 'def maior_numero(numeros):\n  return max(numeros)',
    solutionHint: 'Python tem uma função nativa chamada max() que pode ser usada em listas.',
    example: {
      input: 'numeros = [1, 5, 2, 9, 3]',
      output: '9',
    },
    explanation: `**Raciocínio:**
Para encontrar o maior valor em uma coleção, a abordagem mais direta é usar as ferramentas que a própria linguagem oferece. Python, sendo uma linguagem de "baterias inclusas", possui uma função para exatamente este propósito.

**Código e Ferramentas:**
A função nativa (built-in) \`max()\` é a ferramenta perfeita. Ela pode receber qualquer objeto iterável (como uma lista) e retornará o maior item.

\`\`\`python
def maior_numero(numeros):
  # A função max() faz todo o trabalho pesado por nós.
  return max(numeros)
\`\`\`

**Abordagens Alternativas:**
Se não pudéssemos usar \`max()\`, a abordagem manual seria:
1.  Inicializar uma variável, digamos \`maior_ate_agora\`, com o primeiro elemento da lista.
2.  Iterar pela lista a partir do segundo elemento.
3.  Para cada número, compará-lo com \`maior_ate_agora\`. Se o número atual for maior, atualizamos \`maior_ate_agora\`.
4.  Após o loop, \`maior_ate_agora\` conterá o maior valor.

\`\`\`python
def maior_numero(numeros):
  if not numeros: # Lida com o caso de lista vazia
    return None
  maior_ate_agora = numeros[0]
  for numero in numeros[1:]:
    if numero > maior_ate_agora:
      maior_ate_agora = numero
  return maior_ate_agora
\`\`\`
Esta abordagem manual é ótima para entender a lógica por trás da operação, mas a versão com \`max()\` é mais "pythônica": mais curta, mais legível e geralmente mais rápida por ser implementada em C.`,
  },
  {
    id: 'python-3',
    numericId: 3,
    type: 'python',
    title: 'Contar Vogais',
    difficulty: 'easy',
    description: 'Escreva uma função que receba uma string e retorne o número de vogais (a, e, i, o, u) que ela contém. A contagem não deve diferenciar maiúsculas de minúsculas.',
    starterCode: 'def contar_vogais(s):\n  # Seu código aqui\n  return 0',
    starterFunctionName: 'contar_vogais',
    testCases: [
        { input: ['hello world'], expected: 3 },
        { input: ['PYTHON'], expected: 1 },
        { input: ['AEIOUaeiou'], expected: 10 },
        { input: ['rhythm'], expected: 0 },
    ],
    solution: 'def contar_vogais(s):\n  contador = 0\n  vogais = "aeiou"\n  for char in s.lower():\n    if char in vogais:\n      contador += 1\n  return contador',
    solutionHint: 'Crie uma string ou conjunto de vogais e itere pela string de entrada (convertida para minúsculas), verificando se cada caractere está no seu conjunto de vogais.',
    example: {
        input: 's = "Ola Mundo"',
        output: '4',
    },
    explanation: `**Raciocínio:**
O objetivo é percorrer uma string e contar quantos caracteres são vogais. Como a contagem não diferencia maiúsculas de minúsculas, o primeiro passo deve ser padronizar a string de entrada, geralmente convertendo-a toda para minúsculas. Depois, para cada caractere, precisamos verificar se ele é uma das vogais ('a', 'e', 'i', 'o', 'u'). Uma variável de contagem será incrementada a cada vez que encontrarmos uma vogal.

**Código e Ferramentas:**
1.  **Contador**: Uma variável inicializada em 0.
2.  **Conjunto de Vogais**: Definir uma string ou um conjunto (set) com as vogais (\`"aeiou"\`) para facilitar a verificação. Usar um conjunto é tecnicamente mais eficiente para verificações de pertinência (\`in\`), mas para uma string tão pequena, a diferença é desprezível.
3.  **Loop \`for\`**: Para iterar por cada caractere da string.
4.  **Método \`.lower()\`**: Para padronizar a string de entrada.
5.  **Operador \`in\`**: Para verificar se um caractere está no nosso conjunto de vogais.

\`\`\`python
def contar_vogais(s):
  contador = 0
  vogais = "aeiou" # ou set("aeiou")
  # Convertemos a string para minúsculas para a verificação ser case-insensitive
  for char in s.lower():
    # Se o caractere atual é uma vogal...
    if char in vogais:
      # ...incrementamos o contador.
      contador += 1
  return contador
\`\`\`

**Abordagem Alternativa (Mais Concisa):**
É possível resolver isso em uma única linha usando uma expressão geradora e a função \`sum()\`. Esta é uma abordagem mais avançada, mas muito pythônica.

\`\`\`python
def contar_vogais(s):
  # Para cada caractere em s.lower(), ele gera 1 se for uma vogal, e 0 (implícito) se não for.
  # sum() então soma todos os 1s gerados.
  return sum(1 for char in s.lower() if char in "aeiou")
\`\`\`
Esta versão é funcionalmente idêntica à do loop, mas é mais compacta.`,
  },
    {
    id: 'python-4',
    numericId: 4,
    type: 'python',
    title: 'Verificar Palíndromo',
    difficulty: 'easy',
    description: 'Escreva uma função que verifique se uma dada string é um palíndromo. Um palíndromo é uma palavra que se lê da mesma forma de trás para frente. A verificação não deve diferenciar maiúsculas de minúsculas e deve ignorar espaços.',
    starterCode: 'def eh_palindromo(s):\n  # Seu código aqui\n  return False',
    starterFunctionName: 'eh_palindromo',
    testCases: [
        { input: ['arara'], expected: true },
        { input: ['python'], expected: false },
        { input: ['Ame a ema'], expected: true },
        { input: ['A sacada da casa'], expected: true },
    ],
    solution: "def eh_palindromo(s):\n  s_limpa = ''.join(filter(str.isalnum, s)).lower()\n  return s_limpa == s_limpa[::-1]",
    solutionHint: 'Primeiro, "limpe" a string removendo espaços e convertendo para minúsculas. Depois, compare a string limpa com sua versão invertida. A inversão pode ser feita com a técnica de slicing: `string[::-1]`.',
    example: {
        input: 's = "Radar"',
        output: 'True',
    },
    explanation: `**Raciocínio:**
O que é um palíndromo? É uma palavra ou frase que se lê da mesma forma de trás para frente, como "arara" ou "radar". A primeira ideia que vem à mente é: se eu pegar a string, invertê-la e compará-la com a original, elas devem ser idênticas.

No entanto, um desafio comum é lidar com letras maiúsculas, minúsculas e espaços/pontuação. A frase "Ame a ema" é um palíndromo, mas uma comparação direta com sua inversão falharia. Portanto, antes de comparar, precisamos "limpar" a string: remover tudo que não for letra ou número e padronizar para tudo minúsculo.

**Código e Ferramentas:**
Para implementar isso em Python, podemos usar alguns métodos de string muito úteis:
1.  **Limpeza**: Uma forma eficiente de remover caracteres não alfanuméricos é usar \`filter(str.isalnum, s)\` para filtrar apenas os caracteres que são letras ou números, e depois \`''.join(...)\` para juntá-los de volta em uma string.
2.  **\`.lower()\`**: Converte toda a string para letras minúsculas.

Depois de limpar a string, a parte mais "pythônica" entra em jogo. Para inverter uma string em Python, não precisamos de um loop. Podemos usar a sintaxe de fatiamento (slicing): \`string_limpa[::-1]\`. Essa expressão cria uma nova string que é uma cópia invertida da original.

O código final fica muito limpo:
\`\`\`python
def eh_palindromo(s):
  # 1. Filtra apenas caracteres alfanuméricos, junta e converte para minúsculo
  s_limpa = ''.join(filter(str.isalnum, s)).lower()
  # 2. Compara a string limpa com sua versão invertida
  return s_limpa == s_limpa[::-1]
\`\`\`

**Abordagens Alternativas (e por que são menos ideais):**
Você poderia resolver isso de forma mais manual, usando um loop. Por exemplo, comparar o primeiro caractere com o último, o segundo com o penúltimo, e assim por diante, usando dois ponteiros (um no início e um no fim) que se movem em direção ao centro.

\`\`\`python
# Abordagem com dois ponteiros
def eh_palindromo_manual(s):
    s_limpa = ''.join(filter(str.isalnum, s)).lower()
    esquerda, direita = 0, len(s_limpa) - 1
    while esquerda < direita:
        if s_limpa[esquerda] != s_limpa[direita]:
            return False
        esquerda += 1
        direita -= 1
    return True
\`\`\`
Embora essa abordagem funcione perfeitamente e seja eficiente (também O(n)), ela é mais verbosa. A solução com fatiamento (\`[::-1]\`) é preferida em Python por ser mais concisa e legível, o que chamamos de "pythônico".`,
  },
  {
    id: 'python-5',
    numericId: 5,
    type: 'python',
    title: 'FizzBuzz',
    difficulty: 'easy',
    description: 'Escreva uma função que imprima os números de 1 a 100. Mas para múltiplos de três, imprima "Fizz" em vez do número e para os múltiplos de cinco imprima "Buzz". Para números que são múltiplos de três e cinco, imprima "FizzBuzz". A função deve retornar uma lista de strings com o resultado.',
    starterCode: 'def fizzbuzz():\n  # Seu código aqui\n  return []',
    starterFunctionName: 'fizzbuzz',
    testCases: [
        { input: [], expected: ['1', '2', 'Fizz', '4', 'Buzz', 'Fizz', '7', '8', 'Fizz', 'Buzz', '11', 'Fizz', '13', '14', 'FizzBuzz'] } // Apenas os 15 primeiros
    ],
    solution: "def fizzbuzz():\n  resultado = []\n  for i in range(1, 101):\n    if i % 3 == 0 and i % 5 == 0:\n      resultado.append('FizzBuzz')\n    elif i % 3 == 0:\n      resultado.append('Fizz')\n    elif i % 5 == 0:\n      resultado.append('Buzz')\n    else:\n      resultado.append(str(i))\n  return resultado",
    solutionHint: 'Use um loop de 1 a 100. Dentro do loop, use `if/elif/else` e o operador de módulo (`%`) para verificar as condições. A ordem das verificações é importante!',
    example: {
        input: 'Nenhum (a função gera de 1 a 100)',
        output: 'Uma lista começando com: ["1", "2", "Fizz", "4", "Buzz", ...]',
    },
    explanation: `**Raciocínio:**
Este é um problema clássico de entrevista que testa a lógica básica de programação e o entendimento de condicionais. O processo é:
1.  Iterar pelos números de 1 a 100.
2.  Para cada número, verificar se ele se encaixa em uma de quatro categorias:
    a. Múltiplo de 3 e 5?
    b. Múltiplo de apenas 3?
    c. Múltiplo de apenas 5?
    d. Nenhuma das anteriores?
3.  Adicionar a string apropriada ("FizzBuzz", "Fizz", "Buzz", ou o próprio número) a uma lista de resultados.

A parte mais crucial é a ordem das verificações. Se você verificar se um número é múltiplo de 3 *antes* de verificar se é múltiplo de 3 e 5, um número como 15 seria identificado como "Fizz" e a verificação pararia por aí. Portanto, a condição mais específica (múltiplo de ambos) deve vir primeiro.

**Código e Ferramentas:**
-   **\`range(1, 101)\`**: Para gerar os números de 1 a 100.
-   **Operador Módulo (\`%\`)**: \`numero % divisor == 0\` é a forma de verificar se \`numero\` é perfeitamente divisível por \`divisor\`.
-   **Estrutura \`if/elif/else\`**: Para lidar com as múltiplas condições de forma ordenada.
-   **\`str()\`**: Para converter os números em strings antes de adicioná-los à lista de resultado.

\`\`\`python
def fizzbuzz():
  resultado = []
  for i in range(1, 101):
    # A condição mais específica (múltiplo de 15) vem primeiro.
    if i % 15 == 0: # ou i % 3 == 0 and i % 5 == 0
      resultado.append('FizzBuzz')
    elif i % 3 == 0:
      resultado.append('Fizz')
    elif i % 5 == 0:
      resultado.append('Buzz')
    else:
      resultado.append(str(i))
  return resultado
\`\`\`

**Abordagens Erradas Comuns:**
O erro mais comum é a ordem das condições.
\`\`\`python
# Exemplo ERRADO
if i % 3 == 0:
  resultado.append('Fizz')
elif i % 5 == 0:
  resultado.append('Buzz')
# Esta condição nunca será alcançada, pois i % 3 == 0 já captura os múltiplos de 15.
elif i % 3 == 0 and i % 5 == 0: 
  resultado.append('FizzBuzz')
\`\`\`
Este código nunca imprimirá "FizzBuzz", pois qualquer número divisível por 15 (como 15, 30, etc.) também é divisível por 3, e a primeira condição \`if i % 3 == 0\` será satisfeita primeiro.`,
  },

  // --- Medios (60) ---
  {
    id: 'python-6',
    numericId: 6,
    type: 'python',
    title: 'Inverter uma String',
    difficulty: 'medium',
    description: 'Escreva uma função que receba uma string e retorne a string invertida.',
    starterCode: 'def inverter_string(s):\n  # Seu código aqui\n  return',
    starterFunctionName: 'inverter_string',
    testCases: [
      { input: ['hello'], expected: 'olleh' },
      { input: ['StreakCode'], expected: 'edoCkcaertS' },
      { input: ['a'], expected: 'a' },
    ],
    solution: 'def inverter_string(s):\n  return s[::-1]',
    solutionHint: 'Você pode usar a técnica de "slicing" (fatiamento) com um passo de -1 para inverter a string.',
    example: {
      input: 's = "hello"',
      output: '"olleh"',
    },
    explanation: `**Raciocínio:**
O objetivo é criar uma nova string cujos caracteres estão na ordem oposta da string original. Poderíamos fazer isso manualmente, percorrendo a string original de trás para frente e construindo uma nova string. No entanto, Python oferece uma maneira muito mais elegante e eficiente.

**Código e Ferramentas:**
A principal ferramenta aqui é o **fatiamento de string (string slicing)**. A sintaxe de fatiamento em Python é \`[início:fim:passo]\`.
-   Se omitirmos \`início\` e \`fim\`, ele considera a string inteira.
-   Um \`passo\` de \`-1\` diz ao Python para percorrer a string de trás para frente.

Combinando isso, \`s[::-1]\` se torna uma instrução poderosa que significa "pegue a string inteira, mas percorra-a com um passo de -1", o que resulta em uma cópia invertida da string.

\`\`\`python
def inverter_string(s):
  # A sintaxe de fatiamento [::-1] é a forma mais pythônica de inverter uma sequência.
  return s[::-1]
\`\`\`

**Abordagens Alternativas:**
1.  **Usando \`reversed()\` e \`join()\`**:
    A função \`reversed()\` retorna um iterador que percorre uma sequência ao contrário. Como ela retorna um iterador, precisamos usar \`''.join()\` para juntar os caracteres de volta em uma string.

    \`\`\`python
    def inverter_string_join(s):
      return "".join(reversed(s))
    \`\`\`
    Esta abordagem também é muito boa e legível, mas geralmente \`s[::-1]\` é considerado um pouco mais rápido para strings.

2.  **Loop Manual**:
    A abordagem clássica em outras linguagens seria usar um loop.

    \`\`\`python
    def inverter_string_loop(s):
      string_invertida = ""
      for char in s:
        string_invertida = char + string_invertida
      return string_invertida
    \`\`\`
    Isso funciona, mas é ineficiente em Python porque strings são imutáveis. A cada iteração, uma nova string é criada na memória, levando a uma performance ruim (complexidade O(n^2)) para strings grandes.`,
  },
  {
    id: 'python-7',
    numericId: 7,
    type: 'python',
    title: 'Fatorial de um Número',
    difficulty: 'medium',
    description: 'Escreva uma função que calcule o fatorial de um número inteiro não-negativo. O fatorial de n (denotado por n!) é o produto de todos os inteiros positivos menores ou iguais a n. O fatorial de 0 é 1.',
    starterCode: 'def fatorial(n):\n  # Seu código aqui\n  return 1',
    starterFunctionName: 'fatorial',
    testCases: [
        { input: [5], expected: 120 }, // 5*4*3*2*1
        { input: [0], expected: 1 },
        { input: [1], expected: 1 },
        { input: [10], expected: 3628800 },
    ],
    solution: "def fatorial(n):\n  if n < 0:\n    return None # Fatorial não definido para negativos\n  if n == 0:\n    return 1\n  resultado = 1\n  for i in range(1, n + 1):\n    resultado *= i\n  return resultado",
    solutionHint: 'Use um loop que vai de 1 até o número (inclusive). Em cada iteração, multiplique o resultado atual pelo número da iteração. Lembre-se do caso base: o fatorial de 0 é 1.',
    example: {
        input: 'n = 4',
        output: '24',
    },
    explanation: `**Raciocínio:**
O fatorial de um número \`n\` é \`n * (n-1) * (n-2) * ... * 1\`. A ideia é multiplicar uma sequência de números. Isso nos leva a pensar em um loop. Precisaremos de uma variável para acumular o produto, que deve começar em 1 (o elemento neutro da multiplicação). O loop deve então iterar de 1 até \`n\`, multiplicando o acumulador pelo número atual a cada passo.

Também precisamos lidar com casos especiais (chamados de "casos de base" ou "edge cases"):
-   O fatorial de 0 é definido como 1.
-   O fatorial não é definido para números negativos (podemos retornar \`None\` ou levantar um erro).

**Código e Ferramentas (Abordagem Iterativa):**
-   **Acumulador**: Uma variável, digamos \`resultado\`, inicializada em 1.
-   **Loop \`for\` com \`range(1, n + 1)\`**: Para iterar de 1 até \`n\`.
-   **Operador \`*=\`**: Para multiplicar o acumulador pelo valor atual do loop (\`resultado = resultado * i\`).

\`\`\`python
def fatorial(n):
  # Lida com o caso de entrada inválida
  if n < 0:
    raise ValueError("Fatorial não é definido para números negativos")
  
  # Caso base
  if n == 0:
    return 1
  
  resultado = 1
  # Itera de 1 até n
  for i in range(1, n + 1):
    resultado *= i
  return resultado
\`\`\`

**Abordagem Alternativa (Recursiva):**
O fatorial é um problema classicamente usado para ensinar recursão, pois sua definição é naturalmente recursiva: \`n! = n * (n-1)!\`. Uma função recursiva é uma função que chama a si mesma.

\`\`\`python
def fatorial_recursivo(n):
  if n < 0:
    raise ValueError("Fatorial não é definido para números negativos")
  
  # Caso base: A condição que para a recursão.
  if n == 0:
    return 1
  # Passo recursivo: A função chama a si mesma com um problema menor.
  else:
    return n * fatorial_recursivo(n - 1)
\`\`\`
Esta abordagem é elegante e reflete a definição matemática, mas tem desvantagens: pode ser mais lenta devido à sobrecarga de chamadas de função e pode atingir o limite de profundidade de recursão do Python para números grandes, causando um \`RecursionError\`. Para a maioria dos cenários práticos, a versão iterativa é mais robusta.`,
  },
    {
    id: 'python-8',
    numericId: 8,
    type: 'python',
    title: 'Agrupar Anagramas',
    difficulty: 'medium',
    description: 'Dada uma lista de strings, agrupe as strings que são anagramas umas das outras. Anagramas são palavras formadas pela reorganização das letras de outra palavra.',
    starterCode: 'def agrupar_anagramas(palavras):\n  # Seu código aqui\n  return []',
    starterFunctionName: 'agrupar_anagramas',
    testCases: [
        { input: [['eat', 'tea', 'tan', 'ate', 'nat', 'bat']], expected: [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']] },
        { input: [['']], expected: [['']] },
        { input: [['a']], expected: [['a']] },
    ],
    solution: "from collections import defaultdict\n\ndef agrupar_anagramas(palavras):\n  grupos = defaultdict(list)\n  for palavra in palavras:\n    chave = ''.join(sorted(palavra))\n    grupos[chave].append(palavra)\n  return list(grupos.values())",
    solutionHint: 'Use um dicionário. A chave para cada grupo de anagramas pode ser a versão ordenada da palavra. Itere pela lista de entrada, ordene cada palavra para criar a chave, e adicione a palavra original à lista de valores do dicionário para aquela chave.',
    example: {
        input: 'palavras = ["cab", "abc", "bac", "bar"]',
        output: '[["cab", "abc", "bac"], ["bar"]]',
    },
    explanation: `**Raciocínio:**
Como podemos identificar se duas palavras são anagramas? Se reorganizarmos as letras de ambas em ordem alfabética, o resultado será idêntico. Por exemplo, "eat", "tea", e "ate" todas se tornam "aet" quando ordenadas. Esta forma ordenada pode servir como uma "chave" ou "assinatura" única para um grupo de anagramas.

A estratégia, então, é:
1.  Criar uma estrutura de dados para agrupar as palavras, como um dicionário (hash map).
2.  Iterar sobre cada palavra na lista de entrada.
3.  Para cada palavra, criar sua chave (a versão ordenada da palavra).
4.  Usar essa chave para armazenar a palavra original no dicionário. O valor do dicionário será uma lista de todas as palavras que compartilham a mesma chave.
5.  No final, os valores do nosso dicionário serão as listas de anagramas agrupados.

**Código e Ferramentas:**
-   **\`defaultdict(list)\`**: Do módulo \`collections\`, é uma ferramenta extremamente útil. É um dicionário que, ao tentar acessar uma chave que não existe, cria automaticamente um valor padrão para ela (neste caso, uma lista vazia, \`[]\`), evitando a necessidade de verificar se a chave já existe antes de adicionar um item.
-   **\`sorted(palavra)\`**: Retorna uma lista dos caracteres da palavra, ordenados alfabeticamente.
-   **\`''.join(...)\`**: Junta os caracteres da lista ordenada de volta em uma string para ser usada como chave do dicionário.
-   **\`.values()\`**: Método de dicionário que retorna uma visão de todos os valores.

\`\`\`python
from collections import defaultdict

def agrupar_anagramas(palavras):
  # O defaultdict simplifica o código. Não precisamos de um 'if chave in grupos:'.
  grupos = defaultdict(list)
  
  for palavra in palavras:
    # 'eat' -> ['a', 'e', 't'] -> 'aet' (esta é a chave)
    chave = "".join(sorted(palavra))
    
    # Adiciona a palavra original ('eat') à lista da chave 'aet'
    grupos[chave].append(palavra)
    
  # Retornamos apenas os valores (as listas de anagramas)
  return list(grupos.values())
\`\`\`

**Abordagens Erradas Comuns:**
Uma abordagem de força bruta seria comparar cada palavra com todas as outras palavras na lista. Para cada par, verificar se são anagramas (por exemplo, contando a frequência de cada caractere em ambas). Isso levaria a uma complexidade de tempo muito alta (pelo menos O(N^2 * K), onde N é o número de palavras e K é o comprimento da palavra mais longa), tornando-a inviável para listas de entrada grandes. A abordagem com dicionário e chave ordenada é muito mais eficiente, geralmente O(N * K log K), dominada pelo tempo de ordenação de cada palavra.`,
  },
  
  // --- Dificeis (15) ---
  {
    id: 'python-9',
    numericId: 9,
    type: 'python',
    title: 'Soma Máxima de Subarray (Kadane)',
    difficulty: 'hard',
    description: 'Dada uma lista de inteiros, encontre o subarray contíguo com a maior soma e retorne essa soma. Um subarray é uma parte contígua da lista.',
    starterCode: 'def max_subarray_sum(nums):\n  # Seu código aqui\n  return 0',
    starterFunctionName: 'max_subarray_sum',
    testCases: [
        { input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 }, // subarray [4, -1, 2, 1]
        { input: [[1]], expected: 1 },
        { input: [[5, 4, -1, 7, 8]], expected: 23 }, // o subarray é a lista inteira
        { input: [[-1, -2, -3]], expected: -1 }, // o maior é o menos negativo
    ],
    solution: "def max_subarray_sum(nums):\n  max_global = nums[0]\n  max_atual = nums[0]\n  for i in range(1, len(nums)):\n    max_atual = max(nums[i], max_atual + nums[i])\n    if max_atual > max_global:\n      max_global = max_atual\n  return max_global",
    solutionHint: "Este é um problema clássico resolvido pelo Algoritmo de Kadane. Mantenha duas variáveis: uma para a soma máxima do subarray terminando na posição atual e outra para a soma máxima global encontrada até agora.",
    example: {
        input: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]',
        output: '6',
    },
    explanation: `**Raciocínio (Algoritmo de Kadane):**
Este problema parece simples, mas uma solução de força bruta (testar todos os subarrays possíveis) é muito lenta (O(n^2)). A solução elegante e eficiente é o Algoritmo de Kadane, que tem complexidade O(n).

A ideia chave é iterar pela lista mantendo o controle de duas coisas:
1.  **\`max_atual\`**: A soma máxima de um subarray que **termina na posição atual**.
2.  **\`max_global\`**: A soma máxima encontrada em **qualquer subarray** até agora.

Para cada número na lista, tomamos uma decisão:
-   Começamos um novo subarray aqui? (Nesse caso, a soma do subarray atual é apenas o número atual).
-   Ou continuamos o subarray anterior, adicionando o número atual a ele? (Nesse caso, a soma é \`max_atual + numero_atual\`).

Nós escolhemos a opção que der o maior valor para \`max_atual\`. Depois de atualizar \`max_atual\`, nós o comparamos com \`max_global\` e atualizamos \`max_global\` se encontrarmos uma nova soma máxima.

**Código e Ferramentas:**
-   **\`max_atual\`**: Guarda a soma do melhor subarray terminando na posição \`i\`.
-   **\`max_global\`**: Guarda a melhor soma encontrada em qualquer lugar da lista.
-   **\`max()\`**: A função nativa é usada para tomar a decisão em cada passo.

\`\`\`python
def max_subarray_sum(nums):
  # Inicializamos ambas as variáveis com o primeiro elemento.
  # max_global guardará a resposta final.
  max_global = nums[0]
  # max_atual é a mágica do algoritmo.
  max_atual = nums[0]

  # Começamos do segundo elemento
  for i in range(1, len(nums)):
    numero_atual = nums[i]
    
    # Decisão: vale a pena estender o subarray anterior ou começar um novo aqui?
    # Se max_atual for negativo, é melhor começar de novo com o numero_atual.
    max_atual = max(numero_atual, max_atual + numero_atual)
    
    # O máximo global foi superado pelo máximo que termina aqui?
    if max_atual > max_global:
      max_global = max_atual
      
  return max_global
\`\`\`

**Abordagem Errada Comum (Força Bruta):**
A abordagem ingênua é gerar todos os subarrays possíveis, calcular a soma de cada um e guardar a maior.

\`\`\`python
# Abordagem O(n^2) - Lenta para entradas grandes
def max_subarray_sum_brute_force(nums):
    max_soma = float('-inf')
    for i in range(len(nums)):
        soma_atual = 0
        for j in range(i, len(nums)):
            soma_atual += nums[j]
            if soma_atual > max_soma:
                max_soma = soma_atual
    return max_soma
\`\`\`
Este código funciona, mas sua complexidade de tempo quadrática o torna inadequado para entrevistas ou aplicações com grandes volumes de dados, onde a solução O(n) do Kadane é esperada.`,
  }
];
