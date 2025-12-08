import { useState } from "react";
import { Heart, ChevronRight } from "lucide-react";
import Swal from "sweetalert2";
import { QuizQuestion, messages } from "./QuizData";

interface QuestionScreenProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onCorrectAnswer: () => void;
}

const QuestionScreen = ({ 
  question, 
  questionNumber, 
  totalQuestions, 
  onCorrectAnswer 
}: QuestionScreenProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAnswer = async (index: number) => {
    if (selectedAnswer !== null || isAnimating) return;
    
    setSelectedAnswer(index);
    setIsAnimating(true);

    if (index === question.correct) {
      // Resposta correta!
      setIsCorrect(true);
      
      // Pequeno delay para mostrar o feedback visual
      setTimeout(() => {
        onCorrectAnswer();
        setSelectedAnswer(null);
        setIsCorrect(null);
        setIsAnimating(false);
      }, 1000);
    } else {
      // Resposta errada
      setIsCorrect(false);
      
      // Mostrar SweetAlert com mensagem de erro
      await Swal.fire({
        icon: "error",
        title: "Ops! Errou! 😅",
        text: question.errorMsg,
        confirmButtonText: "Tentar de novo",
        confirmButtonColor: "hsl(15, 45%, 65%)",
        background: "hsl(30, 25%, 98%)",
        color: "hsl(20, 15%, 20%)",
        customClass: {
          popup: "rounded-2xl",
          title: "font-playfair",
          htmlContainer: "font-lato"
        }
      });

      // Resetar estado para tentar novamente
      setSelectedAnswer(null);
      setIsCorrect(null);
      setIsAnimating(false);
    }
  };

  const getOptionClass = (index: number) => {
    let baseClass = "answer-option";
    
    if (selectedAnswer === index) {
      if (isCorrect === true) {
        baseClass += " correct";
      } else if (isCorrect === false) {
        baseClass += " incorrect";
      }
    }
    
    return baseClass;
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">
      {/* Header com progresso */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center justify-between mb-3">
          <span className="font-lato text-sm text-muted-foreground">
            Pergunta {questionNumber} de {totalQuestions}
          </span>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalQuestions }).map((_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 transition-all duration-300 ${
                  i < questionNumber 
                    ? "text-primary" 
                    : "text-muted-foreground/30"
                }`}
                fill={i < questionNumber ? "currentColor" : "none"}
              />
            ))}
          </div>
        </div>
        
        {/* Barra de progresso */}
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Card da pergunta */}
      <div className="card-elegant flex-1 flex flex-col animate-scale-in">
        {/* Pergunta */}
        <div className="mb-8">
          <h2 className="font-playfair text-2xl md:text-3xl font-semibold text-foreground leading-relaxed">
            {question.question}
          </h2>
        </div>

        {/* Opções de resposta */}
        <div className="flex-1 flex flex-col gap-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={selectedAnswer !== null}
              className={getOptionClass(index)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                  ${selectedAnswer === index && isCorrect 
                    ? "bg-success text-success-foreground" 
                    : selectedAnswer === index && isCorrect === false
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-secondary text-secondary-foreground"
                  }
                  transition-colors duration-200
                `}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="flex-1">{option}</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </button>
          ))}
        </div>

        {/* Feedback de acerto */}
        {isCorrect && (
          <div className="mt-6 text-center animate-fade-in">
            <p className="text-success font-lato font-medium text-lg">
              {messages.correctMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionScreen;
