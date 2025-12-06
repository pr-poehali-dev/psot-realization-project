import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

export const TechnicalSupport = () => {
  const [open, setOpen] = useState(false);
  const [requestType, setRequestType] = useState('problem');
  const [description, setDescription] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast.error('Опишите ваш запрос');
      return;
    }

    setSending(true);

    try {
      const userFio = localStorage.getItem('userFio') || 'Неизвестный пользователь';
      const userCompany = localStorage.getItem('userCompany') || 'Не указана';
      const userEmail = localStorage.getItem('userEmail') || 'Не указан';
      const userId = localStorage.getItem('userId') || 'Не указан';

      const response = await fetch('https://functions.poehali.dev/e519c776-33cc-4cea-bdaa-1d10b684b777', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestType,
          description,
          userFio,
          userCompany,
          userEmail,
          userId
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Запрос отправлен! Мы свяжемся с вами в ближайшее время');
        setDescription('');
        setRequestType('problem');
        setOpen(false);
      } else {
        toast.error(data.error || 'Ошибка отправки запроса');
      }
    } catch (error) {
      console.error('Support request error:', error);
      toast.error('Ошибка соединения');
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-blue-600/50 text-blue-400 hover:bg-blue-600/10"
        >
          <Icon name="Headphones" size={20} className="mr-2" />
          Техническая поддержка
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-blue-600/30 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-400">
            Техническая поддержка
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Опишите проблему, предложите улучшение или закажите разработку нового блока
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-slate-300">Тип запроса</Label>
            <RadioGroup value={requestType} onValueChange={setRequestType}>
              <div className="flex items-center space-x-2 bg-slate-700/50 p-3 rounded-lg">
                <RadioGroupItem value="problem" id="problem" />
                <Label htmlFor="problem" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Icon name="AlertCircle" size={20} className="text-red-400" />
                  <div>
                    <div className="font-semibold">Проблема в работе</div>
                    <div className="text-sm text-slate-400">Сообщить об ошибке или неполадке</div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 bg-slate-700/50 p-3 rounded-lg">
                <RadioGroupItem value="recommendation" id="recommendation" />
                <Label htmlFor="recommendation" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Icon name="Lightbulb" size={20} className="text-yellow-400" />
                  <div>
                    <div className="font-semibold">Рекомендация</div>
                    <div className="text-sm text-slate-400">Предложить улучшение</div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 bg-slate-700/50 p-3 rounded-lg">
                <RadioGroupItem value="new_feature" id="new_feature" />
                <Label htmlFor="new_feature" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Icon name="Plus" size={20} className="text-green-400" />
                  <div>
                    <div className="font-semibold">Заказать новый блок</div>
                    <div className="text-sm text-slate-400">Разработка нового функционала</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label htmlFor="description" className="text-slate-300">
              Описание запроса
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Подробно опишите вашу проблему, рекомендацию или требования к новому блоку..."
              className="min-h-[150px] bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={sending}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Отмена
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={sending || !description.trim()}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              {sending ? (
                <>
                  <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                  Отправка...
                </>
              ) : (
                <>
                  <Icon name="Send" size={20} className="mr-2" />
                  Отправить запрос
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};