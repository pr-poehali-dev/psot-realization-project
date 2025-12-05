import Icon from '@/components/ui/icon';

export const StatsSection = () => {
  const stats = [
    { label: 'Членов профсоюза', value: '1,247', icon: 'Users' },
    { label: 'Лет работы', value: '25', icon: 'Calendar' },
    { label: 'Выплачено помощи', value: '18.5 млн ₽', icon: 'Banknote' },
    { label: 'Оздоровлено работников', value: '850+', icon: 'Heart' }
  ];

  return (
    <section className="py-12 border-y bg-card">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-2">
              <Icon name={stat.icon as any} size={32} className="text-primary mx-auto" />
              <div className="font-heading text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
