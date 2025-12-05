import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type IconName = 'Shield' | 'PartyPopper' | 'Wallet' | 'Heart' | 'Banknote' | 'Gift' | 'Ticket' | 'Scale' | 'ShieldCheck' | 'FileText' | 'FileCheck' | 'Calendar' | 'BarChart' | 'FileEdit';

interface ContentSectionsProps {
  activeSection: string;
  news: Array<{ title: string; date: string; preview: string; category: string }>;
  activities: Array<{ title: string; description: string; icon: string }>;
  benefits: Array<{ title: string; description: string; amount: string; icon: string }>;
  documents: Array<{ title: string; description: string; size: string; format: string; icon: string }>;
  faq: Array<{ question: string; answer: string }>;
}

export const ContentSections = ({ 
  activeSection, 
  news, 
  activities, 
  benefits, 
  documents, 
  faq 
}: ContentSectionsProps) => {
  return (
    <>
      {activeSection === 'about' && (
        <section className="py-16">
          <div className="container max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">О профсоюзной организации</h2>
              <p className="text-muted-foreground text-lg">
                История, миссия и ценности нашей организации
              </p>
            </div>
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Target" className="text-primary" />
                    Наша миссия
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Защита социально-трудовых прав и интересов работников, создание благоприятных условий труда, 
                    повышение уровня жизни членов профсоюза и их семей. Мы стремимся быть надежным партнером 
                    работодателя в решении социальных вопросов и развитии организации.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="History" className="text-primary" />
                    История
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Профсоюзная организация АСУБТ была создана в 2000 году. За 25 лет работы мы выросли 
                    до одной из крупнейших профсоюзных организаций в отрасли, объединяя более 1200 работников. 
                    Наша организация неоднократно награждалась почетными грамотами за активную социальную работу 
                    и защиту трудовых прав.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Award" className="text-primary" />
                    Ключевые достижения
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={20} className="text-primary mt-0.5 flex-shrink-0" />
                      <span>Заключены выгодные коллективные договоры с улучшенными условиями труда</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={20} className="text-primary mt-0.5 flex-shrink-0" />
                      <span>Организовано санаторно-курортное лечение для более чем 850 работников</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={20} className="text-primary mt-0.5 flex-shrink-0" />
                      <span>Выплачено материальной помощи на сумму более 18 млн рублей</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={20} className="text-primary mt-0.5 flex-shrink-0" />
                      <span>Успешно защищены интересы работников в 47 трудовых спорах</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {activeSection === 'news' && (
        <section className="py-16">
          <div className="container max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Новости и события</h2>
              <p className="text-muted-foreground text-lg">
                Актуальная информация о деятельности профсоюза
              </p>
            </div>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
                <TabsTrigger value="all">Все</TabsTrigger>
                <TabsTrigger value="Важное">Важное</TabsTrigger>
                <TabsTrigger value="Отчеты">Отчеты</TabsTrigger>
                <TabsTrigger value="Мероприятия">Мероприятия</TabsTrigger>
                <TabsTrigger value="Помощь">Помощь</TabsTrigger>
              </TabsList>
              {['all', 'Важное', 'Отчеты', 'Мероприятия', 'Помощь'].map((category) => (
                <TabsContent key={category} value={category} className="space-y-6">
                  {news
                    .filter((item) => category === 'all' || item.category === category)
                    .map((item, index) => (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium px-2.5 py-1 bg-primary/10 text-primary rounded-full">
                                  {item.category}
                                </span>
                                <span className="text-sm text-muted-foreground">{item.date}</span>
                              </div>
                              <CardTitle className="text-xl">{item.title}</CardTitle>
                            </div>
                            <Icon name="Newspaper" className="text-primary flex-shrink-0" size={24} />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-4">{item.preview}</p>
                          <Button variant="link" className="p-0 h-auto">
                            Читать полностью
                            <Icon name="ArrowRight" size={16} className="ml-1" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>
      )}

      {activeSection === 'activities' && (
        <section className="py-16">
          <div className="container max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Направления деятельности</h2>
              <p className="text-muted-foreground text-lg">
                Основные направления работы профсоюза
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {activities.map((activity, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Icon name={activity.icon as IconName} className="text-primary" size={28} />
                      </div>
                      <CardTitle className="text-xl">{activity.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{activity.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-12 p-8 bg-primary/5 rounded-lg">
              <h3 className="font-heading text-2xl font-bold mb-4 flex items-center gap-2">
                <Icon name="Info" className="text-primary" />
                Как мы работаем
              </h3>
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                      1
                    </div>
                    <h4 className="font-semibold">Прием обращений</h4>
                  </div>
                  <p className="text-sm text-muted-foreground pl-10">
                    Вы обращаетесь к нам с вопросом или проблемой
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                      2
                    </div>
                    <h4 className="font-semibold">Анализ ситуации</h4>
                  </div>
                  <p className="text-sm text-muted-foreground pl-10">
                    Изучаем вопрос и подбираем оптимальное решение
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                      3
                    </div>
                    <h4 className="font-semibold">Решение вопроса</h4>
                  </div>
                  <p className="text-sm text-muted-foreground pl-10">
                    Принимаем меры и достигаем результата
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeSection === 'benefits' && (
        <section className="py-16 bg-gradient-to-b from-background to-secondary/5">
          <div className="container max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Льготы и преимущества</h2>
              <p className="text-muted-foreground text-lg">
                Что получают члены профсоюза
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {benefits.map((benefit, index) => (
                <Card key={index} className="hover:shadow-lg transition-all hover:scale-[1.02]">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Icon name={benefit.icon as IconName} className="text-primary" size={28} />
                      </div>
                      <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                        {benefit.amount}
                      </span>
                    </div>
                    <CardTitle className="text-xl mt-4">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Icon name="Sparkles" size={28} />
                  Дополнительные преимущества
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={20} className="mt-0.5 flex-shrink-0" />
                    <span>Приоритет при распределении премий и надбавок</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={20} className="mt-0.5 flex-shrink-0" />
                    <span>Участие в принятии решений через профсоюзные собрания</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={20} className="mt-0.5 flex-shrink-0" />
                    <span>Защита от необоснованных увольнений и взысканий</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={20} className="mt-0.5 flex-shrink-0" />
                    <span>Информационная поддержка по всем трудовым вопросам</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {activeSection === 'documents' && (
        <section className="py-16">
          <div className="container max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Документы</h2>
              <p className="text-muted-foreground text-lg">
                Уставные документы и нормативные акты
              </p>
            </div>
            <div className="space-y-4">
              {documents.map((doc, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <Icon name={doc.icon as IconName} className="text-primary" size={24} />
                        </div>
                        <div className="space-y-1 flex-1">
                          <CardTitle className="text-lg">{doc.title}</CardTitle>
                          <CardDescription>{doc.description}</CardDescription>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                            <span className="flex items-center gap-1">
                              <Icon name="FileType" size={14} />
                              {doc.format}
                            </span>
                            <span className="flex items-center gap-1">
                              <Icon name="HardDrive" size={14} />
                              {doc.size}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Icon name="Download" size={16} className="mr-2" />
                        Скачать
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
            <Card className="mt-8 bg-secondary/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="HelpCircle" className="text-primary" />
                  Часто задаваемые вопросы
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faq.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
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

      {activeSection === 'contacts' && (
        <section className="py-16">
          <div className="container max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Контакты</h2>
              <p className="text-muted-foreground text-lg">
                Свяжитесь с нами удобным способом
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="MapPin" className="text-primary" />
                      Адрес
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">г. Москва, ул. Профсоюзная, д. 42, офис 301</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="Phone" className="text-primary" />
                      Телефон
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">+7 (495) 123-45-67</p>
                    <p className="text-sm text-muted-foreground mt-1">Пн-Пт: 9:00 - 18:00</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="Mail" className="text-primary" />
                      Email
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">info@profsouz-asubt.ru</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Режим работы</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Понедельник - Четверг:</span>
                        <span className="font-medium">9:00 - 18:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Пятница:</span>
                        <span className="font-medium">9:00 - 17:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Суббота, Воскресенье:</span>
                        <span className="font-medium">Выходной</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Руководство</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <h4 className="font-semibold">Председатель профкома</h4>
                      <p className="text-muted-foreground">Петров Петр Петрович</p>
                      <p className="text-sm text-muted-foreground">+7 (495) 123-45-68</p>
                      <p className="text-sm text-muted-foreground">chairman@profsouz-asubt.ru</p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold">Заместитель председателя</h4>
                      <p className="text-muted-foreground">Сидорова Анна Ивановна</p>
                      <p className="text-sm text-muted-foreground">+7 (495) 123-45-69</p>
                      <p className="text-sm text-muted-foreground">deputy@profsouz-asubt.ru</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Главный бухгалтер</h4>
                      <p className="text-muted-foreground">Иванова Мария Сергеевна</p>
                      <p className="text-sm text-muted-foreground">+7 (495) 123-45-70</p>
                      <p className="text-sm text-muted-foreground">accounting@profsouz-asubt.ru</p>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-semibold mb-3">Мы в социальных сетях</h4>
                      <div className="flex gap-3">
                        <Button variant="outline" size="icon">
                          <Icon name="Mail" size={20} />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Icon name="Phone" size={20} />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Icon name="MessageCircle" size={20} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};