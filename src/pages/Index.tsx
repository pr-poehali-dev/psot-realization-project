import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Users" className="text-primary" size={28} />
            <div>
              <span className="font-heading text-xl font-bold text-primary">Профсоюз</span>
              <p className="text-xs text-muted-foreground hidden md:block">Забота о работниках</p>
            </div>
          </div>
          
          <nav className="hidden lg:flex gap-6">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                  activeSection === item.id ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon name={item.icon as any} size={16} />
                {item.label}
              </button>
            ))}
          </nav>

          <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default" size="sm" className="hidden md:flex">
                Вступить в профсоюз
              </Button>
            </DialogTrigger>
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
                    placeholder="ivanov@example.com"
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
                  <Label htmlFor="position">Должность *</Label>
                  <Input
                    id="position"
                    required
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

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Icon name="Menu" size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Icon name="Users" className="text-primary" size={24} />
                  <span className="font-heading">Меню</span>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                {navigation.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 p-3 rounded-lg text-left font-medium transition-colors ${
                      activeSection === item.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-secondary'
                    }`}
                  >
                    <Icon name={item.icon as any} size={20} />
                    {item.label}
                  </button>
                ))}
                <Button className="mt-4" onClick={() => { setMobileMenuOpen(false); setJoinDialogOpen(true); }}>
                  Вступить в профсоюз
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main>
        {activeSection === 'home' && (
          <>
            <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-primary/5">
              <div className="container">
                <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
                  <h1 className="font-heading text-5xl md:text-6xl font-bold text-primary leading-tight">
                    Профсоюз «Забота»
                  </h1>
                  <p className="text-xl md:text-2xl text-muted-foreground">
                    Защищаем права работников с 1995 года
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center pt-4">
                    <Button size="lg" onClick={() => setJoinDialogOpen(true)}>
                      <Icon name="UserPlus" size={20} className="mr-2" />
                      Вступить в профсоюз
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => setActiveSection('benefits')}>
                      <Icon name="Gift" size={20} className="mr-2" />
                      Льготы членам
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => setActiveSection('contacts')}>
                      <Icon name="Phone" size={20} className="mr-2" />
                      Связаться
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            <section className="py-16 container">
              <h2 className="font-heading text-3xl font-bold text-center mb-12">Основные направления работы</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {activities.map((activity, index) => (
                  <Card key={index} className="hover-scale">
                    <CardHeader>
                      <Icon name={activity.icon as any} className="text-primary mb-2" size={32} />
                      <CardTitle className="text-lg">{activity.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{activity.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section className="py-16 bg-secondary/30">
              <div className="container">
                <h2 className="font-heading text-3xl font-bold text-center mb-12">Последние новости</h2>
                <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                  {news.slice(0, 4).map((item, index) => (
                    <Card key={index} className="hover-scale">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
                            {item.category}
                          </span>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Icon name="Calendar" size={14} />
                            {item.date}
                          </span>
                        </div>
                        <CardTitle className="text-xl">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">{item.preview}</CardDescription>
                        <Button variant="link" className="px-0 mt-2" onClick={() => setActiveSection('news')}>
                          Читать далее →
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="text-center mt-8">
                  <Button variant="outline" onClick={() => setActiveSection('news')}>
                    Все новости
                  </Button>
                </div>
              </div>
            </section>

            <section className="py-16 container">
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <Card className="text-center">
                  <CardHeader>
                    <CardTitle className="text-5xl font-bold text-primary">1850+</CardTitle>
                    <CardDescription className="text-base">Членов профсоюза</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="text-center">
                  <CardHeader>
                    <CardTitle className="text-5xl font-bold text-primary">30</CardTitle>
                    <CardDescription className="text-base">Лет защищаем права</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="text-center">
                  <CardHeader>
                    <CardTitle className="text-5xl font-bold text-primary">24/7</CardTitle>
                    <CardDescription className="text-base">Поддержка членов</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </section>
          </>
        )}

        {activeSection === 'about' && (
          <section className="py-16 container animate-fade-in">
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="font-heading text-4xl font-bold text-primary">О профсоюзе</h2>
              
              <div className="prose prose-lg max-w-none space-y-4">
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Профессиональный союз «Забота» — это независимая общественная организация, 
                  созданная для защиты трудовых, социально-экономических прав и интересов работников.
                </p>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  С 1995 года мы успешно представляем интересы более 1850 работников предприятия, 
                  ведем переговоры с работодателем, контролируем соблюдение трудового законодательства 
                  и оказываем всестороннюю поддержку нашим членам.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 pt-8">
                <Card>
                  <CardHeader>
                    <Icon name="Target" className="text-primary mb-2" size={32} />
                    <CardTitle>Наша миссия</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Создание справедливых и безопасных условий труда, защита прав и достоинства каждого работника
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <Icon name="Eye" className="text-primary mb-2" size={32} />
                    <CardTitle>Наше видение</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Быть надежным партнером для работников в решении трудовых и социальных вопросов
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Наши достижения</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    'Заключен выгодный коллективный договор с улучшенными условиями труда',
                    'Оказана материальная помощь более чем 500 семьям за последний год',
                    'Организовано оздоровление 320 работников и их детей',
                    'Проведено более 50 культурно-массовых мероприятий',
                    'Защищены права работников в 45 трудовых спорах'
                  ].map((achievement, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Icon name="CheckCircle2" className="text-primary mt-1 flex-shrink-0" size={20} />
                      <p className="text-muted-foreground">{achievement}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {activeSection === 'news' && (
          <section className="py-16 container animate-fade-in">
            <div className="max-w-5xl mx-auto space-y-8">
              <h2 className="font-heading text-4xl font-bold text-primary">Новости</h2>
              
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-5 max-w-2xl">
                  <TabsTrigger value="all">Все</TabsTrigger>
                  <TabsTrigger value="important">Важное</TabsTrigger>
                  <TabsTrigger value="events">Мероприятия</TabsTrigger>
                  <TabsTrigger value="help">Помощь</TabsTrigger>
                  <TabsTrigger value="reports">Отчеты</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="space-y-4 mt-8">
                  {news.map((item, index) => (
                    <Card key={index} className="hover-scale">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
                            {item.category}
                          </span>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Icon name="Calendar" size={14} />
                            {item.date}
                          </span>
                        </div>
                        <CardTitle className="text-2xl">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-base leading-relaxed">{item.preview}</p>
                        <Button variant="link" className="px-0 mt-4">
                          Читать полностью →
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="important" className="mt-8">
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-muted-foreground text-center">Новости в категории "Важное"</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="events" className="mt-8">
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-muted-foreground text-center">Новости в категории "Мероприятия"</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="help" className="mt-8">
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-muted-foreground text-center">Новости в категории "Помощь"</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reports" className="mt-8">
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-muted-foreground text-center">Новости в категории "Отчеты"</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </section>
        )}

        {activeSection === 'activities' && (
          <section className="py-16 container animate-fade-in">
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="font-heading text-4xl font-bold text-primary">Деятельность</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {activities.map((activity, index) => (
                  <Card key={index} className="hover-scale">
                    <CardHeader>
                      <Icon name={activity.icon as any} className="text-primary mb-2" size={40} />
                      <CardTitle className="text-xl">{activity.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">{activity.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Основные направления работы</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    'Ведение коллективных переговоров и заключение коллективных договоров',
                    'Контроль за соблюдением трудового законодательства',
                    'Представительство интересов работников в органах управления',
                    'Организация культурно-массовых и спортивных мероприятий',
                    'Оказание материальной помощи и социальной поддержки',
                    'Организация оздоровительных мероприятий для работников и их детей'
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Icon name="Check" className="text-primary mt-1" size={20} />
                      <p className="text-muted-foreground">{item}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {activeSection === 'benefits' && (
          <section className="py-16 container animate-fade-in">
            <div className="max-w-5xl mx-auto space-y-8">
              <div className="text-center space-y-4">
                <h2 className="font-heading text-4xl font-bold text-primary">Льготы для членов профсоюза</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Мы заботимся о каждом члене профсоюза и предоставляем широкий спектр социальных льгот и гарантий
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {benefits.map((benefit, index) => (
                  <Card key={index} className="hover-scale">
                    <CardHeader>
                      <Icon name={benefit.icon as any} className="text-primary mb-3" size={36} />
                      <CardTitle className="text-xl">{benefit.title}</CardTitle>
                      <div className="pt-2">
                        <span className="text-2xl font-bold text-primary">{benefit.amount}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">{benefit.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="mt-12 bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-2xl">Часто задаваемые вопросы</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {faq.map((item, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left font-medium">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {activeSection === 'documents' && (
          <section className="py-16 container animate-fade-in">
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="font-heading text-4xl font-bold text-primary">Документы</h2>
              <p className="text-muted-foreground text-lg">
                Здесь вы можете ознакомиться и скачать основные документы профсоюзной организации
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                {documents.map((doc, index) => (
                  <Card key={index} className="hover-scale">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <Icon name={doc.icon as any} className="text-primary mt-1" size={24} />
                          <div>
                            <CardTitle className="text-lg">{doc.title}</CardTitle>
                            <CardDescription className="mt-2">{doc.description}</CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Icon name="File" size={14} />
                            {doc.format}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="HardDrive" size={14} />
                            {doc.size}
                          </span>
                        </div>
                        <Button variant="outline" size="sm">
                          <Icon name="Download" size={16} className="mr-2" />
                          Скачать
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="mt-8 bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Info" className="text-primary" size={24} />
                    Информация
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Все документы представлены в формате PDF и DOC для вашего удобства. 
                    Если у вас возникли вопросы по документам, обратитесь в офис профсоюза 
                    или свяжитесь с нами по телефону +7 (495) 123-45-67.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {activeSection === 'contacts' && (
          <section className="py-16 container animate-fade-in">
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="font-heading text-4xl font-bold text-primary">Контакты</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Адрес офиса</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Icon name="MapPin" className="text-primary mt-1" size={20} />
                      <div>
                        <p className="font-medium">123456, г. Москва</p>
                        <p className="text-muted-foreground">ул. Профсоюзная, д. 1, офис 100</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Icon name="Clock" className="text-primary mt-1" size={20} />
                      <div>
                        <p className="font-medium">Режим работы</p>
                        <p className="text-muted-foreground">Понедельник - Пятница: 9:00 - 18:00</p>
                        <p className="text-muted-foreground">Обед: 13:00 - 14:00</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Связь с нами</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Icon name="Phone" className="text-primary" size={20} />
                      <div>
                        <p className="font-medium">Телефон</p>
                        <p className="text-muted-foreground">+7 (495) 123-45-67</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Icon name="Mail" className="text-primary" size={20} />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-muted-foreground">info@profunion.ru</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Icon name="MessageCircle" className="text-primary" size={20} />
                      <div>
                        <p className="font-medium">Telegram</p>
                        <p className="text-muted-foreground">@profunion_bot</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Руководство профсоюза</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="font-medium">Председатель профсоюза</p>
                      <p className="text-muted-foreground">Иванов Иван Иванович</p>
                      <p className="text-sm text-muted-foreground">Тел: +7 (495) 123-45-67, доб. 101</p>
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium">Заместитель председателя</p>
                      <p className="text-muted-foreground">Петрова Мария Сергеевна</p>
                      <p className="text-sm text-muted-foreground">Тел: +7 (495) 123-45-67, доб. 102</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}
      </main>

      <footer className="border-t mt-20 bg-secondary/20">
        <div className="container py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Users" className="text-primary" size={28} />
                <span className="font-heading text-xl font-bold text-primary">Профсоюз</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Профессиональный союз работников организации. Защищаем права и интересы с 1995 года.
              </p>
            </div>
            
            <div>
              <h3 className="font-heading font-semibold mb-4">Быстрые ссылки</h3>
              <div className="space-y-2">
                {navigation.slice(0, 5).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-heading font-semibold mb-4">Контакты</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Icon name="Phone" size={16} />
                  +7 (495) 123-45-67
                </p>
                <p className="flex items-center gap-2">
                  <Icon name="Mail" size={16} />
                  info@profunion.ru
                </p>
                <p className="flex items-center gap-2">
                  <Icon name="MapPin" size={16} />
                  г. Москва, ул. Профсоюзная, 1
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">
                © 2025 Профессиональный союз работников организации. Все права защищены.
              </p>
              <div className="flex gap-4">
                <Button variant="ghost" size="icon">
                  <Icon name="Facebook" size={20} />
                </Button>
                <Button variant="ghost" size="icon">
                  <Icon name="Twitter" size={20} />
                </Button>
                <Button variant="ghost" size="icon">
                  <Icon name="Instagram" size={20} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
