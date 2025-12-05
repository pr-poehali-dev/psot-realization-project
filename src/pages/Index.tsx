import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/sections/Header';
import { HeroSection } from '@/components/sections/HeroSection';
import { StatsSection } from '@/components/sections/StatsSection';
import { ContentSections } from '@/components/sections/ContentSections';

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', position: '' });
  const { toast } = useToast();

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Заявка отправлена!',
      description: 'Мы свяжемся с вами в ближайшее время.',
    });
    setJoinDialogOpen(false);
    setFormData({ name: '', email: '', phone: '', position: '' });
  };

  const navigation = [
    { id: 'home', label: 'Главная', icon: 'Home' },
    { id: 'about', label: 'О профсоюзе', icon: 'Info' },
    { id: 'news', label: 'Новости', icon: 'Newspaper' },
    { id: 'activities', label: 'Деятельность', icon: 'Briefcase' },
    { id: 'benefits', label: 'Льготы', icon: 'Gift' },
    { id: 'documents', label: 'Документы', icon: 'FileText' },
    { id: 'contacts', label: 'Контакты', icon: 'Mail' }
  ];

  const news = [
    { 
      title: 'Подведены итоги работы за 2024 год', 
      date: '15.01.2025', 
      preview: 'Состоялось годовое собрание членов профсоюза, на котором были подведены итоги работы за прошедший год.',
      category: 'Отчеты'
    },
    { 
      title: 'Заключен новый коллективный договор', 
      date: '10.01.2025', 
      preview: 'Подписан коллективный договор на 2025-2027 годы с улучшенными условиями для работников.',
      category: 'Важное'
    },
    { 
      title: 'Организована поездка в санаторий', 
      date: '28.12.2024', 
      preview: 'Для членов профсоюза организована льготная путевка в санаторий "Здоровье" на январь 2025.',
      category: 'Мероприятия'
    },
    { 
      title: 'Оказана материальная помощь', 
      date: '20.12.2024', 
      preview: 'В декабре оказана материальная помощь 15 членам профсоюза на общую сумму 450 000 рублей.',
      category: 'Помощь'
    }
  ];

  const benefits = [
    { 
      title: 'Материальная помощь', 
      description: 'Единовременная выплата при рождении ребенка, свадьбе, тяжелом материальном положении',
      amount: 'До 50 000 ₽',
      icon: 'Banknote'
    },
    { 
      title: 'Оздоровление', 
      description: 'Компенсация путевок в санатории и дома отдыха для членов профсоюза и их детей',
      amount: 'До 30 000 ₽',
      icon: 'Heart'
    },
    { 
      title: 'Подарки детям', 
      description: 'Новогодние подарки для детей работников до 14 лет',
      amount: 'Бесплатно',
      icon: 'Gift'
    },
    { 
      title: 'Культурные мероприятия', 
      description: 'Льготные билеты в театры, кино, на концерты и спортивные события',
      amount: 'Скидка 50%',
      icon: 'Ticket'
    },
    { 
      title: 'Юридическая помощь', 
      description: 'Бесплатные консультации по трудовым спорам и защита в суде',
      amount: 'Бесплатно',
      icon: 'Scale'
    },
    { 
      title: 'Страхование', 
      description: 'Дополнительное страхование жизни и здоровья работников',
      amount: 'За счет профсоюза',
      icon: 'ShieldCheck'
    }
  ];

  const faq = [
    { 
      question: 'Как вступить в профсоюз?', 
      answer: 'Для вступления необходимо написать заявление и предоставить копию паспорта. Членские взносы составляют 1% от заработной платы.' 
    },
    { 
      question: 'Какие документы нужны для получения материальной помощи?', 
      answer: 'Заявление на имя председателя профсоюза, копии подтверждающих документов (свидетельство о рождении, браке и т.д.)' 
    },
    { 
      question: 'Как получить путевку в санаторий?', 
      answer: 'Подать заявку в профком за 2 месяца до планируемой даты. Путевки распределяются в порядке очередности среди членов профсоюза.' 
    },
    { 
      question: 'Защищает ли профсоюз в трудовых спорах?', 
      answer: 'Да, профсоюз предоставляет бесплатную юридическую помощь всем членам организации, включая представительство в суде.' 
    }
  ];

  const activities = [
    { title: 'Социальная защита', description: 'Представительство интересов работников, защита трудовых прав', icon: 'Shield' },
    { title: 'Культурно-массовая работа', description: 'Организация мероприятий, праздников и корпоративных событий', icon: 'PartyPopper' },
    { title: 'Материальная помощь', description: 'Оказание финансовой поддержки членам профсоюза', icon: 'Wallet' },
    { title: 'Оздоровление', description: 'Организация санаторно-курортного лечения и отдыха', icon: 'Heart' }
  ];

  const documents = [
    { title: 'Устав профсоюзной организации', description: 'Основной учредительный документ', size: '2.4 МБ', format: 'PDF', icon: 'FileText' },
    { title: 'Коллективный договор 2025', description: 'Действующий коллективный договор', size: '1.8 МБ', format: 'PDF', icon: 'FileCheck' },
    { title: 'Положение о членских взносах', description: 'Порядок уплаты членских взносов', size: '856 КБ', format: 'PDF', icon: 'Wallet' },
    { title: 'План работы на 2025 год', description: 'Годовой план мероприятий', size: '1.2 МБ', format: 'PDF', icon: 'Calendar' },
    { title: 'Отчет о деятельности 2024', description: 'Годовой отчет о проделанной работе', size: '3.1 МБ', format: 'PDF', icon: 'BarChart' },
    { title: 'Заявление о вступлении', description: 'Бланк заявления для вступления в профсоюз', size: '124 КБ', format: 'DOC', icon: 'FileEdit' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header 
        navigation={navigation}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onJoinClick={() => setJoinDialogOpen(true)}
      />

      {activeSection === 'home' && (
        <>
          <HeroSection 
            onJoinClick={() => setJoinDialogOpen(true)}
            onLearnMoreClick={() => setActiveSection('about')}
          />
          <StatsSection />
        </>
      )}

      <ContentSections 
        activeSection={activeSection}
        news={news}
        activities={activities}
        benefits={benefits}
        documents={documents}
        faq={faq}
      />

      <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">Вступить в профсоюз</DialogTitle>
            <DialogDescription>
              Заполните форму, и мы свяжемся с вами для оформления членства
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleJoinSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">ФИО *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Иванов Иван Иванович"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ivan@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Телефон *</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+7 (999) 123-45-67"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Должность</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="Инженер"
              />
            </div>
            <Button type="submit" className="w-full">
              Отправить заявку
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <footer className="border-t py-8 mt-16">
        <div className="container text-center text-muted-foreground">
          <p>&copy; 2025 Профсоюзная организация АСУБТ. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
