import { Heart } from "lucide-react";
import { messages } from "./QuizData";

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen = ({ onStart }: StartScreenProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
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

      {/* Conteúdo Principal */}
      <div className="card-elegant max-w-md w-full text-center animate-fade-up">
        {/* Ícone do coração */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <Heart 
              className="w-20 h-20 text-primary animate-pulse-soft" 
              fill="currentColor" 
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-primary-foreground font-playfair text-2xl font-bold">1</span>
            </div>
          </div>
        </div>

        {/* Título */}
        <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-4">
          {messages.welcomeTitle}
        </h1>

        {/* Subtítulo */}
        <p className="font-lato text-lg text-muted-foreground mb-8 leading-relaxed">
          {messages.welcomeSubtitle}
        </p>

        {/* Linha decorativa */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-16 bg-primary/30" />
          <Heart className="w-4 h-4 text-primary" fill="currentColor" />
          <div className="h-px w-16 bg-primary/30" />
        </div>

        {/* Botão de início */}
        <button
          onClick={onStart}
          className="btn-romantic w-full"
        >
          {messages.startButton}
        </button>
      </div>

      {/* Crédito sutil */}
      <p className="mt-8 text-sm text-muted-foreground/60 font-lato">
        Feito com ❤️ para você
      </p>
    </div>
  );
};

export default StartScreen;
