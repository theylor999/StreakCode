import type { Challenge } from '@/types';

export const sqlChallenges: Challenge[] = [
  {
    id: 'sql-1',
    numericId: 1,
    type: 'sql',
    title: 'Selecionar Todos os Clientes',
    difficulty: 'easy',
    description: 'Escreva uma query para selecionar todas as colunas da tabela `clientes`.',
    starterCode: '-- Escreva sua query aqui',
    starterFunctionName: 'query',
    testCases: [{ input: [], expected: 'SELECT * FROM clientes;' }],
    solution: 'SELECT * FROM clientes;',
    solutionHint: `SELECT
    *
FROM
    _;`,
    schemaImage: '/images/sql-1.png',
    example: {
        input: 'Uma tabela chamada `clientes` com colunas: `id`, `nome`, `email`, `cidade`.',
        output: 'Todas as linhas e colunas da tabela `clientes`.',
    },
    explanation: 'O comando `SELECT *` é um atalho para selecionar todas as colunas de uma tabela. `FROM clientes` especifica que a fonte dos dados é a tabela `clientes`. O ponto e vírgula no final é uma prática padrão para terminar instruções SQL, embora não seja sempre obrigatório dependendo do cliente SQL.',
  },
  {
    id: 'sql-2',
    numericId: 2,
    type: 'sql',
    title: 'Clientes de São Paulo',
    difficulty: 'easy',
    description: 'Escreva uma query para selecionar o `nome` e `email` de todos os clientes que moram na cidade de "São Paulo". A tabela se chama `clientes` e tem as colunas `cidade`, `nome`, e `email`.',
    starterCode: '-- Escreva sua query aqui',
    starterFunctionName: 'query',
    testCases: [{ input: [], expected: "SELECT nome, email FROM clientes WHERE cidade = 'São Paulo';" }],
    solution: "SELECT nome, email FROM clientes WHERE cidade = 'São Paulo';",
    solutionHint: `SELECT
    _,
    _
FROM
    _
WHERE
    _ = 'São Paulo';`,
    schemaImage: '/images/sql-2.png',
    example: {
        input: "Tabela `clientes` com uma linha onde `cidade` = 'São Paulo'",
        output: "O nome e o email do cliente que mora em São Paulo.",
    },
    explanation: "A cláusula `SELECT nome, email` especifica as colunas que queremos retornar. `FROM clientes` indica a tabela. A cláusula `WHERE cidade = 'São Paulo'` filtra as linhas, retornando apenas aquelas em que o valor da coluna `cidade` é \"São Paulo\", que deve ser uma string entre aspas simples.",
  }
];
