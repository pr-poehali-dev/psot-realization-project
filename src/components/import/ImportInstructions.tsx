import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export const ImportInstructions = () => {
  return (
    <Card className="bg-slate-700/30 border-blue-600/30 p-4 mb-6">
      <h3 className="text-lg font-bold text-blue-400 mb-3 flex items-center gap-2">
        <Icon name="Info" size={20} />
        Инструкция по импорту
      </h3>
      <div className="space-y-2 text-slate-300 text-sm">
        <p><strong>Формат Excel файла:</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Первая строка — заголовки столбцов</li>
          <li>Столбец <strong>"ID№"</strong></li>
          <li>Столбец <strong>"ФИО"</strong> — полное имя пользователя (обязательно)</li>
          <li>Столбец <strong>"Компания"</strong></li>
          <li>Столбец <strong>"Подразделение"</strong> — название отдела</li>
          <li>Столбец <strong>"Должность"</strong> — название должности</li>
          <li>Столбец <strong>"E-mail"</strong> — уникальная почта (обязательно)</li>
        </ul>
        <p className="mt-3"><strong>Что происходит при импорте:</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Автоматически генерируются временные пароли для каждого пользователя</li>
          <li>Пользователи добавляются в выбранное предприятие</li>
          <li>Статус "зарегистрирован" устанавливается автоматически</li>
          <li>Для каждого пользователя создаётся уникальная ссылка для входа</li>
          <li>Каждому пользователю открывается индивидуальный личный кабинет</li>
          <li>В личном кабинете отображается полная статистика: ID, аудиты, наблюдения, предписания, ПАБы</li>
          <li>Видна вся информация по документам: выписано, устранено, в работе, просроченные</li>
          <li>Ссылки можно скопировать индивидуально или отправить массово</li>
        </ul>
      </div>
    </Card>
  );
};