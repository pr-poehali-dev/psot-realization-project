import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { id: 'home', label: 'Главная', icon: 'Home' },
    { id: 'about', label: 'О нас', icon: 'Info' },
    { id: 'leadership', label: 'Руководство', icon: 'Users' },
    { id: 'activities', label: 'Деятельность', icon: 'Briefcase' },
    { id: 'contacts', label: 'Контакты', icon: 'Mail' }
  ];

  const leaders = [
    { name: 'Иванов Иван Иванович', position: 'Председатель профсоюзной организации', phone: '+7 (495) 123-45-67' },
    { name: 'Петрова Мария Сергеевна', position: 'Заместитель председателя', phone: '+7 (495) 123-45-68' },
    { name: 'Сидоров Петр Александрович', position: 'Главный бухгалтер', phone: '+7 (495) 123-45-69' }
  ];

  const activities = [
    { title: 'Социальная защита', description: 'Представительство интересов работников, защита трудовых прав', icon: 'Shield' },
    { title: 'Культурно-массовая работа', description: 'Организация мероприятий, праздников и корпоративных событий', icon: 'PartyPopper' },
    { title: 'Материальная помощь', description: 'Оказание финансовой поддержки членам профсоюза', icon: 'Wallet' },
    { title: 'Оздоровление', description: 'Организация санаторно-курортного лечения и отдыха', icon: 'Heart' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Users" className="text-primary" size={28} />
            <span className="font-heading text-xl font-bold text-primary">Профсоюз</span>
          </div>
          
          <nav className="hidden md:flex gap-6">
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

          <Button variant="default" size="sm" className="hidden md:flex">
            Вступить в профсоюз
          </Button>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
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
                <Button className="mt-4" onClick={() => setMobileMenuOpen(false)}>
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
            <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
              <div className="container">
                <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
                  <h1 className="font-heading text-5xl md:text-6xl font-bold text-primary leading-tight">
                    Профессиональный союз работников организации
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    Защищаем права и интересы работников с 1995 года
                  </p>
                  <div className="flex gap-4 justify-center pt-4">
                    <Button size="lg" onClick={() => setActiveSection('about')}>
                      Узнать больше
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => setActiveSection('contacts')}>
                      Связаться с нами
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            <section className="py-16 container">
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
          </>
        )}

        {activeSection === 'about' && (
          <section className="py-16 container animate-fade-in">
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="font-heading text-4xl font-bold text-primary">О нас</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  Профессиональный союз работников организации — это добровольное объединение работников, 
                  созданное для защиты их трудовых и социально-экономических прав и интересов.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Наша организация работает с 1995 года и объединяет более 500 членов профсоюза. 
                  Мы активно участвуем в переговорах с работодателем, контролируем соблюдение трудового 
                  законодательства и оказываем всестороннюю поддержку нашим членам.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 pt-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-4xl font-bold text-primary">500+</CardTitle>
                    <CardDescription>Членов профсоюза</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-4xl font-bold text-primary">30</CardTitle>
                    <CardDescription>Лет работы</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-4xl font-bold text-primary">100%</CardTitle>
                    <CardDescription>Защита прав</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'leadership' && (
          <section className="py-16 container animate-fade-in">
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="font-heading text-4xl font-bold text-primary">Руководство</h2>
              <div className="space-y-4">
                {leaders.map((leader, index) => (
                  <Card key={index} className="hover-scale">
                    <CardHeader>
                      <CardTitle>{leader.name}</CardTitle>
                      <CardDescription className="flex items-center gap-4 pt-2">
                        <span className="flex items-center gap-2">
                          <Icon name="Briefcase" size={16} />
                          {leader.position}
                        </span>
                        <span className="flex items-center gap-2">
                          <Icon name="Phone" size={16} />
                          {leader.phone}
                        </span>
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
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
                  <div className="flex items-start gap-3">
                    <Icon name="Check" className="text-primary mt-1" size={20} />
                    <p className="text-muted-foreground">Ведение коллективных переговоров и заключение коллективных договоров</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Icon name="Check" className="text-primary mt-1" size={20} />
                    <p className="text-muted-foreground">Контроль за соблюдением трудового законодательства</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Icon name="Check" className="text-primary mt-1" size={20} />
                    <p className="text-muted-foreground">Представительство интересов работников в органах управления</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Icon name="Check" className="text-primary mt-1" size={20} />
                    <p className="text-muted-foreground">Организация культурно-массовых и спортивных мероприятий</p>
                  </div>
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
                        <p className="text-muted-foreground">Пн-Пт: 9:00 - 18:00</p>
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
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="border-t mt-20">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Icon name="Users" className="text-primary" size={24} />
              <span className="font-heading font-bold text-primary">Профсоюз</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Профессиональный союз работников организации. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;