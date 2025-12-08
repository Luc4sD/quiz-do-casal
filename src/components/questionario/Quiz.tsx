import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import confetti from 'canvas-confetti';
import { Heart, Gift, Sparkles } from 'lucide-react';

// --- Definição dos Tipos ---
type Option = {
  text: string;
  isCorrect: boolean;
};

type Question = {
  questionText: string;
  options: Option[];
  explanation: string;
};

type Prize = {
  title: string;
  subtitle: string;
  validity: string;
};

type QuizConfig = {
  title: string;
  subtitle: string;
  startIcon: string;
  questions: Question[];
  prize: Prize;
};

// --- Funções Utilitárias para Base64 ---
// Codifica uma string para Base64 de forma segura com Unicode, compatível com browsers.
function b64EncodeUnicode(str: string) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
      function toSolidBytes(_match, p1) {
          return String.fromCharCode(Number('0x' + p1));
      }));
}

// Decodifica uma string de Base64 de forma segura com Unicode, compatível com browsers.
function b64DecodeUnicode(str: string) {
  return decodeURIComponent(atob(str).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}
// --- Dados Iniciais do Quiz (pode ser personalizado) ---
const initialQuizQuestions: Question[] = [
  {
    questionText: 'Qual foi o local do nosso primeiro encontro?',
    options: [
      { text: 'Cinema', isCorrect: false },
      { text: 'Parque da Cidade', isCorrect: true },
      { text: 'Restaurante Italiano', isCorrect: false },
      { text: 'Em casa', isCorrect: false },
    ],
    explanation: 'Foi no Parque da Cidade, um dia lindo que nunca vou esquecer! ❤️',
  },
  {
    questionText: 'Qual é a minha linguagem do amor principal?',
    options: [
      { text: 'Palavras de Afirmação', isCorrect: false },
      { text: 'Atos de Serviço', isCorrect: false },
      { text: 'Tempo de Qualidade', isCorrect: true },
      { text: 'Presentes', isCorrect: false },
    ],
    explanation: 'Amo cada segundo que passamos juntos, essa é a maior prova de amor para mim.',
  },
  {
    questionText: 'Qual o nome do primeiro filme que vimos juntos?',
    options: [
        { text: 'Homem-Aranha: No Aranhaverso', isCorrect: true },
        { text: 'Vingadores: Ultimato', isCorrect: false },
        { text: 'O Rei Leão', isCorrect: false },
        { text: 'Coringa', isCorrect: false },
    ],
    explanation: 'Sim! Vimos Homem-Aranha e foi incrível compartilhar essa experiência com você.',
  }
];

const initialQuizConfig: QuizConfig = {
  title: 'Quiz de Aniversário de Noivado',
  subtitle: 'Vamos testar suas memórias do nosso primeiro ano de noivado? ❤️',
  startIcon: '?',
  questions: initialQuizQuestions,
  prize: {
    title: 'Vale Jantar Romântico',
    subtitle: 'Um vale-jantar no nosso restaurante favorito para celebrarmos nosso amor!',
    validity: 'Válido para sempre, assim como nosso amor.'
  }
};

const blankQuizConfig: QuizConfig = {
  title: 'Título do Quiz',
  subtitle: 'Subtítulo do Quiz',
  startIcon: '✏️',
  questions: [{ questionText: 'Nova Pergunta', options: [{ text: 'Opção Correta', isCorrect: true }, { text: 'Opção 2', isCorrect: false }], explanation: 'Explicação da resposta.' }],
  prize: { title: 'Prêmio Final', subtitle: 'Descrição do prêmio', validity: 'Detalhes de validade' }
};

const Quiz: React.FC = () => {
  const [config, setConfig] = useState<QuizConfig>(initialQuizConfig);
  const [isEditing, setIsEditing] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const dataFromUrl = urlParams.get('data');

      if (dataFromUrl) {
        // Decodifica os dados da URL usando a função nativa do browser
        const jsonString = b64DecodeUnicode(dataFromUrl);
        const parsedData = JSON.parse(jsonString);
        setConfig(parsedData);
        localStorage.setItem('customQuizData', JSON.stringify(parsedData));
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        const savedData = localStorage.getItem('customQuizData');
        if (savedData) {
          setConfig(JSON.parse(savedData));
        }
      }
    } catch (error) {
      console.error("Falha ao carregar dados da URL ou localStorage", error);
      setConfig(initialQuizConfig);
    }
  }, []);

  const { questions, prize, startIcon, title, subtitle } = config;
  const currentQuestion = config.questions[currentQuestionIndex];

  const handleAnswerOptionClick = (option: Option) => {
    if (isAnswered) return;

    setSelectedOption(option);

    if (option.isCorrect) {
      setIsAnswered(true);
      setScore(score + 1);
      Swal.fire({
        icon: 'success',
        title: 'Acertou!',
        text: currentQuestion.explanation,
        timer: 2500,
        showConfirmButton: false,
        background: 'hsl(30, 25%, 98%)',
        color: 'hsl(20, 15%, 20%)',
        customClass: {
          popup: 'rounded-2xl',
          title: 'font-playfair',
          htmlContainer: 'font-lato'
        }
      }).then(() => {
        const nextQuestion = currentQuestionIndex + 1;
        if (nextQuestion < config.questions.length) {
          setCurrentQuestionIndex(nextQuestion);
          setIsAnswered(false);
          setSelectedOption(null);
        } else {
          setShowResults(true);
        }
      });
    } else {
      setIsAnswered(true);
      Swal.fire({
        icon: 'error',
        title: 'Ops! Errou! 😅',
        text: 'Tente de novo!',
        confirmButtonText: 'Tentar de novo',
        confirmButtonColor: 'hsl(15, 45%, 65%)',
        background: 'hsl(30, 25%, 98%)',
        color: 'hsl(20, 15%, 20%)',
        customClass: {
          popup: 'rounded-2xl',
          title: 'font-playfair',
          htmlContainer: 'font-lato'
        }
      }).then(() => {
        setIsAnswered(false);
        setSelectedOption(null);
      });
    }
  };
  const handleQuestionChange = (qIndex: number, field: 'questionText' | 'explanation', value: string) => {
    const newQuestions = [...config.questions];
    newQuestions[qIndex][field] = value;
    setConfig({ ...config, questions: newQuestions });
  };

  const handleOptionChange = (qIndex: number, oIndex: number, text: string) => {
    const newQuestions = [...config.questions];
    newQuestions[qIndex].options[oIndex].text = text;
    setConfig({ ...config, questions: newQuestions });
  };

  const handleCorrectOptionChange = (qIndex: number, oIndex: number) => {
    const newQuestions = [...config.questions];
    newQuestions[qIndex].options.forEach((option, i) => {
      option.isCorrect = i === oIndex;
    });
    setConfig({ ...config, questions: newQuestions });
  };

  const addQuestion = () => {
    if (config.questions.length < 10) {
      const newQuestion: Question = {
        questionText: 'Nova Pergunta',
        options: [
          { text: 'Opção Correta', isCorrect: true },
          { text: 'Opção 2', isCorrect: false },
        ],
        explanation: 'Explicação para a resposta da nova pergunta.',
      };
      setConfig({ ...config, questions: [...config.questions, newQuestion] });
    }
  };

  const removeQuestion = (indexToRemove: number) => {
    if (config.questions.length > 1) {
      const newQuestions = config.questions.filter((_, index) => index !== indexToRemove);
      setConfig({ ...config, questions: newQuestions });
    }
  };

  const saveChanges = () => {
    localStorage.setItem('customQuizData', JSON.stringify(config));
    setIsEditing(false);
    Swal.fire('Salvo!', 'Seu quiz foi salvo com sucesso.', 'success');
  };

  const handleShare = () => {
    const jsonString = JSON.stringify(config);
    const base64String = b64EncodeUnicode(jsonString);
    // É importante codificar a string base64 para que ela seja segura para uso em URLs
    const url = `${window.location.origin}${window.location.pathname}?data=${encodeURIComponent(base64String)}`;

    if (navigator.share) {
      navigator.share({ title: 'Quiz Personalizado', text: 'Fiz um quiz para você!', url });
    } else {
      navigator.clipboard.writeText(url).then(() => {
        Swal.fire('Link Copiado!', 'O link para o seu quiz foi copiado. Agora é só compartilhar!', 'success');
      });
    }
  };

  useEffect(() => {
    if (showResults) {
      const duration = 4000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ["#d4a5a5", "#e8c4c4", "#f5e6e6", "#c9a0a0", "#b08d8d"]
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ["#d4a5a5", "#e8c4c4", "#f5e6e6", "#c9a0a0", "#b08d8d"]
        });
      }, 250);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#d4a5a5", "#e8c4c4", "#f5e6e6", "#c9a0a0", "#b08d8d"]
      });

      return () => clearInterval(interval);
    }
  }, [showResults]);

  // --- Tela de Edição ---
  if (isEditing) {
    return (
      <main className="container mx-auto p-4">
        <div className="card-elegant animate-fade-up my-8 mx-auto max-w-4xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-center">Editor de Quiz</h1>
            <button className="btn-romantic" onClick={() => setConfig(blankQuizConfig)}>
              Criar Novo Quiz
            </button>
          </div>

          <div className="mb-8 border-b border-input/30 pb-8">
            <h2 className="text-2xl font-bold mb-4 text-center">Configurações Gerais</h2>
            <label className="block text-lg font-semibold mb-2">
              Título Principal
              <input type="text" value={config.title} onChange={(e) => setConfig({ ...config, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-input bg-background p-2 shadow-sm focus:border-ring focus:ring focus:ring-ring focus:ring-opacity-50" />
            </label>
            <label className="block text-lg font-semibold mb-2 mt-4">
              Subtítulo
              <input type="text" value={config.subtitle} onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
                className="mt-1 block w-full rounded-md border-input bg-background p-2 shadow-sm focus:border-ring focus:ring focus:ring-ring focus:ring-opacity-50" />
            </label>
          </div>

          <h2 className="text-2xl font-bold mb-6 text-center">Perguntas</h2>
          {config.questions.map((question, qIndex) => (
            <div key={qIndex} className="mb-8 border-b border-input/30 pb-8">
              <div className="flex justify-between items-center mb-4">
                <p className="text-xl font-semibold text-foreground">Pergunta {qIndex + 1}</p>
                <button
                  onClick={() => removeQuestion(qIndex)}
                  disabled={config.questions.length <= 1}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 text-destructive hover:bg-destructive/10 disabled:cursor-not-allowed"
                >
                  Remover
                </button>
              </div>
              <label className="block text-lg font-semibold mb-2">
                Texto da Pergunta
                <input
                  type="text"
                  value={question.questionText}
                  onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                  className="mt-1 block w-full rounded-md border-input bg-background p-2 shadow-sm focus:border-ring focus:ring focus:ring-ring focus:ring-opacity-50"
                />
              </label>
              <div className="mt-4">
                <p className="font-semibold">Opções (marque a correta):</p>
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex items-center mt-2 space-x-2">
                    <input
                      type="radio"
                      name={`correct-option-${qIndex}`}
                      checked={option.isCorrect}
                      onChange={() => handleCorrectOptionChange(qIndex, oIndex)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                      className="block w-full rounded-md border-input bg-background p-2 shadow-sm focus:border-ring focus:ring focus:ring-ring focus:ring-opacity-50"
                    />
                  </div>
                ))}
              </div>
              <label className="block text-lg font-semibold mb-2 mt-4">
                Explicação
                <input
                  type="text"
                  value={question.explanation}
                  onChange={(e) => handleQuestionChange(qIndex, 'explanation', e.target.value)}
                  className="mt-1 block w-full rounded-md border-input bg-background p-2 shadow-sm focus:border-ring focus:ring focus:ring-ring focus:ring-opacity-50"
                />
              </label>
            </div>
          ))}
          <div className="mt-12 pt-8 border-t border-input/30">
            <h2 className="text-2xl font-bold mb-4 text-center">Editar Prêmio</h2>
            <label className="block text-lg font-semibold mb-2">
              Título do Prêmio
              <input
                type="text"
                value={config.prize.title}
                onChange={(e) => setConfig({ ...config, prize: { ...config.prize, title: e.target.value } })}
                className="mt-1 block w-full rounded-md border-input bg-background p-2 shadow-sm focus:border-ring focus:ring focus:ring-ring focus:ring-opacity-50"
              />
            </label>
            <label className="block text-lg font-semibold mb-2 mt-4">
              Subtítulo do Prêmio
              <input
                type="text"
                value={config.prize.subtitle}
                onChange={(e) => setConfig({ ...config, prize: { ...config.prize, subtitle: e.target.value } })}
                className="mt-1 block w-full rounded-md border-input bg-background p-2 shadow-sm focus:border-ring focus:ring focus:ring-ring focus:ring-opacity-50"
              />
            </label>
            <label className="block text-lg font-semibold mb-2 mt-4">
              Texto de Validade
              <input
                type="text"
                value={config.prize.validity}
                onChange={(e) => setConfig({ ...config, prize: { ...config.prize, validity: e.target.value } })}
                className="mt-1 block w-full rounded-md border-input bg-background p-2 shadow-sm focus:border-ring focus:ring focus:ring-ring focus:ring-opacity-50"
              />
            </label>
          </div>
          <div className="mt-12 pt-8 border-t border-input/30">
            <h2 className="text-2xl font-bold mb-4 text-center">Editar Ícone Inicial</h2>
            <p className="text-center text-muted-foreground mb-4">Digite o caractere que aparecerá no coração da tela inicial (ex: ?, 1, ❤️). Deixe em branco para nenhum.</p>
            <div className="flex justify-center">
                <input
                  type="text"
                  value={config.startIcon}
                  onChange={(e) => setConfig({ ...config, startIcon: e.target.value })}
                  maxLength={2}
                  className="mt-1 block w-1/2 rounded-md border-input bg-background p-2 text-center text-2xl shadow-sm focus:border-ring focus:ring focus:ring-ring focus:ring-opacity-50"
                />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
            <button
              className="btn-romantic"
              onClick={addQuestion}
              disabled={config.questions.length >= 10}
            >
              Adicionar Pergunta ({config.questions.length}/10)
            </button>
            <button className="btn-romantic" onClick={saveChanges}>
              Salvar Alterações
            </button>
          </div>
        </div>
      </main>
    );
  }

  // --- Tela de Início ---
  if (!quizStarted) {
    return (
      <main className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        {/* Decoração de corações flutuantes */}
        <div className="absolute top-10 left-10 text-primary/30 animate-float">
          <Heart className="w-8 h-8" fill="currentColor" />
        </div>
        <div className="absolute top-20 right-12 text-primary/20 animate-float delay-300">
          <Heart className="w-6 h-6" fill="currentColor" />
        </div>
        <div className="absolute bottom-32 left-8 text-primary/25 animate-float delay-500">
          <Heart className="w-7 h-7" fill="currentColor" />
        </div>
        <div className="absolute bottom-20 right-10 text-primary/30 animate-float delay-200">
          <Heart className="w-5 h-5" fill="currentColor" />
        </div>

        <div className="card-elegant text-center animate-fade-up">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <Heart 
                className="w-20 h-20 text-primary animate-pulse-soft" 
                fill="currentColor" 
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-primary-foreground font-playfair text-2xl font-bold">
                  {config.startIcon}
                </span>
              </div>
            </div>
          </div>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-4">{config.title}</h1>
          <p className="font-lato text-lg text-muted-foreground mb-8 leading-relaxed">
            {config.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">            
            <button className="btn-romantic" onClick={() => setQuizStarted(true)}>
              Começar o Quiz!
            </button>
            <button 
              className="btn-romantic"
              onClick={() => setIsEditing(true)}
            >
              Editar Perguntas
            </button>
            <button className="btn-romantic" onClick={handleShare}>
              Compartilhar
            </button>
          </div>
        </div>
      </main>
    );
  }

  // --- Tela de Resultados ---
  if (showResults) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
        {/* Decoração de corações */}
        <div className="absolute top-8 left-6 text-primary/30 animate-float">
          <Heart className="w-10 h-10" fill="currentColor" />
        </div>
        <div className="absolute top-16 right-8 text-primary/20 animate-float delay-300">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="absolute bottom-24 left-10 text-primary/25 animate-float delay-500">
          <Heart className="w-8 h-8" fill="currentColor" />
        </div>
        <div className="absolute bottom-32 right-6 text-primary/30 animate-float delay-200">
          <Sparkles className="w-6 h-6" />
        </div>

        <div className="max-w-md w-full text-center">
          <div className="mb-6 flex justify-center animate-fade-up">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center animate-pulse-soft">
                <Gift className="w-12 h-12 text-primary" />
              </div>
              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-8 h-8 text-accent animate-float" />
              </div>
            </div>
          </div>

          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-up delay-100">
            Parabéns, meu amor!
          </h1>
          <p className="font-lato text-lg text-muted-foreground mb-8 leading-relaxed animate-fade-up delay-200">
            Você acertou {score} de {config.questions.length} perguntas!
          </p>

          <div className="golden-coupon animate-scale-in delay-300">
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="h-px w-12 bg-primary-foreground/30" />
                <Sparkles className="w-5 h-5 text-primary-foreground" />
                <div className="h-px w-12 bg-primary-foreground/30" />
              </div>
              <h2 className="font-playfair text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
                🎁 CUPOM ESPECIAL 🎁
              </h2>
              <div className="h-px w-3/4 mx-auto bg-primary-foreground/30 my-4" />
              <p className="font-playfair text-xl md:text-2xl font-semibold text-primary-foreground mb-2">
                {config.prize.title}
              </p>
              <p className="font-lato text-primary-foreground/80 mb-4">
                {config.prize.subtitle}
              </p>
              <div className="mt-4 pt-4 border-t border-primary-foreground/20">
                <p className="font-lato text-sm text-primary-foreground/70">
                  {config.prize.validity}
                </p>
              </div>
            </div>
          </div>

          <p className="mt-8 font-lato text-muted-foreground animate-fade-up delay-500">
            Te amo infinitamente! ❤️
          </p>
        </div>
      </main>
    );
  }

  // --- Tela do Quiz ---
  return (
    <main className="container mx-auto p-4 flex items-center justify-center min-h-screen">
      <div className="w-full max-w-2xl">
        <div className="card-elegant animate-fade-up">
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <span className="font-lato text-sm text-muted-foreground">
                Pergunta {currentQuestionIndex + 1} de {config.questions.length}
              </span>
              <div className="flex items-center gap-1">
                {Array.from({ length: config.questions.length }).map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-4 h-4 transition-all duration-300 ${
                      i < currentQuestionIndex + 1 
                        ? "text-primary" 
                        : "text-muted-foreground/30"
                    }`}
                    fill={i < currentQuestionIndex + 1 ? "currentColor" : "none"}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mb-8 text-center">            
            <h2 className="text-3xl font-bold">{currentQuestion.questionText}</h2>
          </div>

          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => {
              const getButtonClass = () => {
                if (!isAnswered) return 'answer-option';
                if (option.isCorrect) return 'answer-option correct';
                if (option === selectedOption && !option.isCorrect) return 'answer-option incorrect';
                return 'answer-option opacity-50 cursor-not-allowed';
              };

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerOptionClick(option)}
                  className={getButtonClass()}
                  disabled={isAnswered}
                >
                  {option.text}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Quiz;