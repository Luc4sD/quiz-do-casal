import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import confetti from 'canvas-confetti';
import { Heart, Gift, Sparkles, Clock, Calendar } from 'lucide-react'; // Ícones já estavam corretos

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
  unlockDate?: string; // NOVO CAMPO: Data de desbloqueio
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
}// --- Dados Iniciais do Quiz ---
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
    validity: 'Válido para sempre, assim como nosso amor.',
  },
  unlockDate: '' 
};

const blankQuizConfig: QuizConfig = {
  title: 'Título do Quiz',
  subtitle: 'Subtítulo do Quiz',
  startIcon: '✏️',
  questions: [{ questionText: 'Nova Pergunta', options: [
    { text: 'Opção 1', isCorrect: true },
    { text: 'Opção 2', isCorrect: false },
    { text: 'Opção 3', isCorrect: false },
    { text: 'Opção 4', isCorrect: false },
  ], explanation: 'Explicação da resposta.' }],
  prize: { title: 'Prêmio Final', subtitle: 'Descrição do prêmio', validity: 'Detalhes de validade' },
  unlockDate: ''
};

// --- Componente de Cronômetro ---
const CountdownDisplay = ({ targetDate, onUnlock }: { targetDate: string, onUnlock: () => void }) => {
  const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number, seconds: number} | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!targetDate) return null;
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      } else {
        onUnlock(); 
        return null;
      }
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onUnlock]);

  if (!timeLeft) return null;

  return (
    <div className="mt-6 p-6 bg-secondary/50 rounded-xl border border-primary/20 animate-pulse-soft shadow-inner">
      <div className="flex items-center justify-center gap-2 mb-4 text-primary font-bold">
        <Clock className="w-6 h-6" />
        <span className="text-lg">Disponível em:</span>
      </div>
      <div className="grid grid-cols-4 gap-3 text-center">
        <div className="bg-background rounded-lg p-3 shadow-sm border border-input">
          <span className="block text-2xl font-bold font-playfair text-primary">{timeLeft.days}</span>
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Dias</span>
        </div>
        <div className="bg-background rounded-lg p-3 shadow-sm border border-input">
          <span className="block text-2xl font-bold font-playfair text-primary">{timeLeft.hours}</span>
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Horas</span>
        </div>
        <div className="bg-background rounded-lg p-3 shadow-sm border border-input">
          <span className="block text-2xl font-bold font-playfair text-primary">{timeLeft.minutes}</span>
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Min</span>
        </div>
        <div className="bg-background rounded-lg p-3 shadow-sm border border-input">
          <span className="block text-2xl font-bold font-playfair text-primary">{timeLeft.seconds}</span>
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Seg</span>
        </div>
      </div>
      <p className="text-center text-sm text-muted-foreground mt-4">
        Volte aqui nesta data para desbloquear seu presente!
      </p>
    </div>
  );
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
  const [isReadOnly, setIsReadOnly] = useState(false);
  
  // Estado para controlar o bloqueio de tempo
  const [isTimeLocked, setIsTimeLocked] = useState(false);

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const dataFromUrl = urlParams.get('data');

      if (dataFromUrl) {
        // Se tem dados na URL, é um JOGADOR (apenas leitura)
        const jsonString = b64DecodeUnicode(dataFromUrl);
        const parsedData = JSON.parse(jsonString);
        setConfig(parsedData);
        setIsReadOnly(true); 
        
        // Verifica se existe data de bloqueio
        if (parsedData.unlockDate) {
          const now = new Date().getTime();
          const unlockTime = new Date(parsedData.unlockDate).getTime();
          if (now < unlockTime) {
            setIsTimeLocked(true);
          }
        }
      } else {
        // Se NÃO tem dados na URL, verificamos o LocalStorage (modo Editor)
        const savedData = localStorage.getItem('customQuizData');
        if (savedData) {
          setConfig(JSON.parse(savedData));
        }
      }
    } catch (error) {
      console.error("Falha ao carregar dados", error);
      setConfig(initialQuizConfig);
    }
  }, []);

  const currentQuestion = config.questions[currentQuestionIndex];

  const handleUnlock = () => {
    setIsTimeLocked(false);
    Swal.fire({
      title: 'Chegou a hora! ⏰',
      text: 'O quiz foi desbloqueado. Divirta-se, meu amor!',
      icon: 'success',
      confirmButtonColor: 'hsl(15, 45%, 65%)',
    });
  };

  // Funções de Gameplay
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
          popup: 'rounded-2xl', title: 'font-playfair', htmlContainer: 'font-lato'        }      }).then(() => {
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
          popup: 'rounded-2xl', title: 'font-playfair', htmlContainer: 'font-lato'        }      }).then(() => {
        setIsAnswered(false);
        setSelectedOption(null);
      });
    }
  };
  // Funções de Edição
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
          { text: 'Opção 1', isCorrect: true },
          { text: 'Opção 2', isCorrect: false },
          { text: 'Opção 3', isCorrect: false },
          { text: 'Opção 4', isCorrect: false },
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

  const handleCreateOwn = () => {
     window.location.href = window.location.pathname; 
  }

  const handleShare = () => {
    const jsonString = JSON.stringify(config);
    const base64String = b64EncodeUnicode(jsonString);
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
            <label className="block text-lg font-semibold mb-2 mt-4">
              Data de Disponibilidade (opcional)
              <input
                type="datetime-local"
                value={config.unlockDate || ''}
                onChange={(e) => setConfig({ ...config, unlockDate: e.target.value })}
                className="mt-1 block w-full rounded-md border-input bg-background p-2 shadow-sm focus:border-ring focus:ring focus:ring-ring focus:ring-opacity-50"
              />
              <p className="text-sm text-muted-foreground mt-1">Se preenchido, o quiz ficará indisponível até esta data.</p>
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
                  className="text-destructive hover:bg-destructive/10 px-4 py-2 rounded">
                  Remover
                </button>
              </div>
              <label className="block text-lg font-semibold mb-2">
                Texto da Pergunta
                <textarea
                  rows={2}
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
                      className="h-4 w-4 text-primary focus:ring-primary"
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
                <textarea
                  rows={4}
                  value={question.explanation}
                  onChange={(e) => handleQuestionChange(qIndex, 'explanation', e.target.value)}
                  className="mt-1 block w-full rounded-md border-input bg-background p-2 shadow-sm focus:border-ring focus:ring focus:ring-ring focus:ring-opacity-50"
                />
              </label>
            </div>
          ))}
          
          {/* Seção de Prêmios e Ícone (mantida simplificada para brevidade, mas está aqui) */}
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
            >Adicionar Pergunta ({config.questions.length}/10)</button>
            <button className="btn-romantic" onClick={saveChanges}>
              Salvar Alterações
            </button>
          </div>
        </div>
      </main>
    );
  }

  // --- TELA INICIAL (Boas-vindas + Lógica de Bloqueio) ---
  if (!quizStarted) {
    return (
      <main className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        {/* Decoração de corações flutuantes */}
        <div className="absolute top-10 left-10 text-primary/30 animate-float"><Heart className="w-8 h-8" fill="currentColor" /></div>
        <div className="absolute top-20 right-12 text-primary/20 animate-float delay-300"><Heart className="w-6 h-6" fill="currentColor" /></div>
        
        <div className="card-elegant text-center animate-fade-up max-w-md w-full">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <Heart 
                className="w-20 h-20 text-primary animate-pulse-soft" 
                fill="currentColor" 
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-primary-foreground font-playfair text-2xl font-bold">{config.startIcon}</span>
              </div>
            </div>
          </div>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-4">{config.title}</h1>
          <p className="font-lato text-lg text-muted-foreground mb-8 leading-relaxed">
            {config.subtitle}
          </p>
          
          {/* Se estiver bloqueado por tempo, mostra o cronômetro */}
          {isTimeLocked && config.unlockDate ? (
            <div className="mb-8">
              <div className="p-4 bg-muted/30 rounded-lg border border-dashed border-primary/40">
                <p className="font-lato text-primary font-semibold mb-2">Este presente está guardado para o momento certo.</p>
                <CountdownDisplay targetDate={config.unlockDate} onUnlock={handleUnlock} />
              </div>
              <button className="btn-romantic mt-6 opacity-50 cursor-not-allowed" disabled>
                Aguarde o momento...
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
              <button className="btn-romantic w-full sm:w-auto" onClick={() => setQuizStarted(true)}>
                Começar o Quiz!
              </button>

              {!isReadOnly && (
                <>
                  <button className="btn-romantic w-full sm:w-auto" onClick={() => setIsEditing(true)}>Editar Perguntas</button>
                  <button className="btn-romantic w-full sm:w-auto" onClick={handleShare}>Compartilhar</button>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    );
  }

  // --- TELA DE RESULTADOS ---
  if (showResults) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
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

          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-up delay-100">Parabéns, meu amor!</h1>
          <p className="font-lato text-lg text-muted-foreground mb-8 leading-relaxed animate-fade-up delay-200">
            Você acertou {score} de {config.questions.length} perguntas!
          </p>

          <div className="golden-coupon animate-scale-in delay-300">
            <div className="relative z-10">
              <h2 className="font-playfair text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
                🎁 CUPOM ESPECIAL 🎁
              </h2>
              <p className="font-playfair text-xl md:text-2xl font-semibold text-primary-foreground mb-2">
                {config.prize.title}
              </p>
              <p className="font-lato text-primary-foreground/80 mb-4">
                {config.prize.subtitle}
              </p>
              <div className="mt-4 pt-4 border-t border-primary-foreground/20"><p className="font-lato text-sm text-primary-foreground/70">{config.prize.validity}</p></div>
            </div>
          </div>
          
          {isReadOnly && (
             <button className="btn-romantic mt-8" onClick={handleCreateOwn}>Criar meu próprio Quiz</button>
          )}
        </div>
      </main>
    );
  }

  // --- TELA DE PERGUNTAS ---
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
                    key={i} className={`w-4 h-4 transition-all duration-300 ${i < currentQuestionIndex + 1 ? "text-primary" : "text-muted-foreground/30"}`} fill={i < currentQuestionIndex + 1 ? "currentColor" : "none"} />
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
                  key={index} onClick={() => handleAnswerOptionClick(option)} className={getButtonClass()} disabled={isAnswered}>
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