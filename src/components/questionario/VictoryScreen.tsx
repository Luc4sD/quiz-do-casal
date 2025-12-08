import { useEffect } from "react";
import confetti from "canvas-confetti";
import { Heart, Gift, Sparkles } from "lucide-react";
import { prizeConfig, messages } from "./QuizData";

const VictoryScreen = () => {
  useEffect(() => {
    // Explosão inicial de confetes
    const duration = 4000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Confetes com cores românticas
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

    // Confete central grande
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#d4a5a5", "#e8c4c4", "#f5e6e6", "#c9a0a0", "#b08d8d"]
    });

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
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

      {/* Conteúdo Principal */}
      <div className="max-w-md w-full text-center">
        {/* Ícone de presente */}
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

        {/* Título de vitória */}
        <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-up delay-100">
          {messages.victoryTitle}
        </h1>

        {/* Mensagem */}
        <p className="font-lato text-lg text-muted-foreground mb-8 leading-relaxed animate-fade-up delay-200">
          {messages.victoryMessage}
        </p>

        {/* Cupom Dourado */}
        <div className="golden-coupon animate-scale-in delay-300">
          <div className="relative z-10">
            {/* Decoração superior */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-px w-12 bg-primary-foreground/30" />
              <Sparkles className="w-5 h-5 text-primary-foreground" />
              <div className="h-px w-12 bg-primary-foreground/30" />
            </div>

            {/* Título do prêmio */}
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
              🎁 CUPOM ESPECIAL 🎁
            </h2>

            {/* Linha decorativa */}
            <div className="h-px w-3/4 mx-auto bg-primary-foreground/30 my-4" />

            {/* Texto do prêmio */}
            <p className="font-playfair text-xl md:text-2xl font-semibold text-primary-foreground mb-2">
              {prizeConfig.title}
            </p>
            <p className="font-lato text-primary-foreground/80 mb-4">
              {prizeConfig.subtitle}
            </p>

            {/* Validade */}
            <div className="mt-4 pt-4 border-t border-primary-foreground/20">
              <p className="font-lato text-sm text-primary-foreground/70">
                {prizeConfig.validity}
              </p>
            </div>

            {/* Decoração inferior */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <Heart className="w-4 h-4 text-primary-foreground" fill="currentColor" />
              <Heart className="w-5 h-5 text-primary-foreground" fill="currentColor" />
              <Heart className="w-4 h-4 text-primary-foreground" fill="currentColor" />
            </div>
          </div>
        </div>

        {/* Mensagem final */}
        <p className="mt-8 font-lato text-muted-foreground animate-fade-up delay-500">
          Te amo infinitamente! ❤️
        </p>
      </div>
    </div>
  );
};

export default VictoryScreen;
