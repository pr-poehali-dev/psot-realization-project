import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onJoinClick: () => void;
  onLearnMoreClick: () => void;
}

export const HeroSection = ({ onJoinClick, onLearnMoreClick }: HeroSectionProps) => {
  return (
    <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20 md:py-32">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
            <Icon name="Users" size={48} className="text-primary" />
          </div>
          <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tight text-foreground">
            Профсоюзная организация АСУБТ
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Защита трудовых прав, социальная поддержка и забота о благополучии каждого работника
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              size="lg" 
              className="text-base px-8"
              onClick={onJoinClick}
            >
              Вступить в профсоюз
              <Icon name="ArrowRight" size={20} className="ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-base"
              onClick={onLearnMoreClick}
            >
              Узнать больше
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
