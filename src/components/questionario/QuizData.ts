/**
 * ============================================
 * 📝 DADOS DO QUIZ - EDITE AQUI SUAS PERGUNTAS
 * ============================================
 * 
 * Cada objeto no array representa uma pergunta.
 * - question: A pergunta que será exibida
 * - options: Array com 4 opções de resposta
 * - correct: Índice da resposta correta (0, 1, 2 ou 3)
 * - errorMsg: Mensagem engraçada exibida quando errar
 */

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  errorMsg: string;
}

export const questions: QuizQuestion[] = [
  // ========== PERGUNTA 1 ==========
  {
    question: "Qual foi a data do nosso primeiro encontro?",
    options: [
      "15 de Janeiro de 2023",
      "22 de Fevereiro de 2023",
      "10 de Março de 2023",
      "5 de Abril de 2023"
    ],
    correct: 0, // Altere o índice para a resposta correta (0-3)
    errorMsg: "Amor, como assim você não lembra? 😱 Foi um dia tão especial!"
  },

  // ========== PERGUNTA 2 ==========
  {
    question: "Onde foi nosso primeiro beijo?",
    options: [
      "No parque",
      "No cinema",
      "Na praia",
      "No restaurante"
    ],
    correct: 2, // Altere o índice para a resposta correta (0-3)
    errorMsg: "Você dormiu no ponto? 😂 Esse momento foi mágico!"
  },

  // ========== PERGUNTA 3 ==========
  {
    question: "Qual é a comida favorita que pedimos juntos?",
    options: [
      "Pizza de Calabresa",
      "Sushi",
      "Hambúrguer Artesanal",
      "Comida Japonesa"
    ],
    correct: 1, // Altere o índice para a resposta correta (0-3)
    errorMsg: "Quantas vezes a gente já pediu isso? 🍣 Presta atenção!"
  },

  // ========== PERGUNTA 4 ==========
  {
    question: "Qual música é 'a nossa música'?",
    options: [
      "Perfect - Ed Sheeran",
      "All of Me - John Legend",
      "Thinking Out Loud - Ed Sheeran",
      "A Thousand Years - Christina Perri"
    ],
    correct: 0, // Altere o índice para a resposta correta (0-3)
    errorMsg: "A gente dançou essa música no nosso noivado! 💃🕺"
  },

  // ========== PERGUNTA 5 ==========
  {
    question: "Quantos meses levou para você me pedir em noivado?",
    options: [
      "6 meses",
      "8 meses",
      "10 meses",
      "12 meses"
    ],
    correct: 3, // Altere o índice para a resposta correta (0-3)
    errorMsg: "Conta nos dedos de novo! 🤔 A resposta tá errada!"
  },

  // ========== PERGUNTA 6 ==========
  {
    question: "Qual foi o apelido carinhoso que eu te dei primeiro?",
    options: [
      "Amor",
      "Mozão",
      "Bebê",
      "Vida"
    ],
    correct: 1, // Altere o índice para a resposta correta (0-3)
    errorMsg: "Você não presta atenção quando eu falo? 😤💕"
  },

  // ========== PERGUNTA 7 ==========
  {
    question: "Em qual cidade sonhamos em morar juntos?",
    options: [
      "Lisboa, Portugal",
      "Paris, França",
      "Toronto, Canadá",
      "Sydney, Austrália"
    ],
    correct: 0, // Altere o índice para a resposta correta (0-3)
    errorMsg: "A gente já viu mil casas lá! 🏠 Como assim errou?"
  },

  // ========== ADICIONE MAIS PERGUNTAS AQUI ==========
  // Copie o modelo acima e cole aqui para adicionar mais perguntas
];

/**
 * ============================================
 * 🎁 CONFIGURAÇÕES DO PRÊMIO
 * ============================================
 */
export const prizeConfig = {
  // Título do cupom
  title: "Vale um Jantar Romântico",
  
  // Subtítulo ou descrição adicional
  subtitle: "Em qualquer restaurante à sua escolha",
  
  // Validade (opcional)
  validity: "Válido até: 31/12/2025"
};

/**
 * ============================================
 * 💝 MENSAGENS PERSONALIZADAS
 * ============================================
 */
export const messages = {
  // Título da tela inicial
  welcomeTitle: "1 Ano de Noivado",
  
  // Subtítulo da tela inicial
  welcomeSubtitle: "Meu amor, preparei esse quiz especial pra gente celebrar!",
  
  // Texto do botão inicial
  startButton: "Iniciar Desafio 💝",
  
  // Mensagem quando acerta
  correctMessage: "Você me conhece tão bem! ❤️",
  
  // Título da tela de vitória
  victoryTitle: "Parabéns, meu amor!",
  
  // Mensagem da tela de vitória
  victoryMessage: "Você provou que conhece nossa história de cor e salteado! Desbloqueou seu presente especial:"
};
