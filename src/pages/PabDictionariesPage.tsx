import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface DictionaryItem {
  id: number;
  name: string;
}

interface Dictionaries {
  categories: DictionaryItem[];
  conditions: DictionaryItem[];
  hazards: DictionaryItem[];
}

type DictionaryType = 'category' | 'condition' | 'hazard';

export default function PabDictionariesPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dictionaries, setDictionaries] = useState<Dictionaries>({
    categories: [],
    conditions: [],
    hazards: []
  });
  
  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState<DictionaryType>('category');
  const [newItemName, setNewItemName] = useState('');

  useEffect(() => {
    loadDictionaries();
  }, []);

  const loadDictionaries = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/8a3ae143-7ece-49b7-9863-4341c4bef960');
      if (!response.ok) throw new Error('Ошибка загрузки');
      const data = await response.json();
      setDictionaries(data);
    } catch (error) {
      toast.error('Не удалось загрузить справочники');
      console.error(error);
    }
  };

  const openAddDialog = (type: DictionaryType) => {
    setDialogType(type);
    setNewItemName('');
    setShowDialog(true);
  };

  const handleAddItem = async () => {
    if (!newItemName.trim()) {
      toast.error('Введите название');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/8a3ae143-7ece-49b7-9863-4341c4bef960', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: dialogType,
          name: newItemName
        })
      });

      if (!response.ok) throw new Error('Ошибка добавления');

      toast.success('Элемент добавлен');
      setShowDialog(false);
      loadDictionaries();
    } catch (error) {
      toast.error('Не удалось добавить элемент');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getDictionaryTitle = (type: DictionaryType) => {
    switch (type) {
      case 'category': return 'Категории наблюдений';
      case 'condition': return 'Виды условий и действий';
      case 'hazard': return 'Опасные факторы';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <Icon name="ArrowLeft" className="mr-2" size={20} />
            Назад
          </Button>
          <h1 className="text-3xl font-bold">Управление регистрацией ПАБ</h1>
          <div className="w-32"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Категории наблюдений */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Категории наблюдений</h2>
              <Button size="sm" onClick={() => openAddDialog('category')}>
                <Icon name="Plus" size={16} />
              </Button>
            </div>
            <div className="space-y-2">
              {dictionaries.categories.map((item) => (
                <div key={item.id} className="p-3 bg-blue-50 rounded-lg flex items-center justify-between">
                  <span className="text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Виды условий */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Виды условий и действий</h2>
              <Button size="sm" onClick={() => openAddDialog('condition')}>
                <Icon name="Plus" size={16} />
              </Button>
            </div>
            <div className="space-y-2">
              {dictionaries.conditions.map((item) => (
                <div key={item.id} className="p-3 bg-green-50 rounded-lg flex items-center justify-between">
                  <span className="text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Опасные факторы */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Опасные факторы</h2>
              <Button size="sm" onClick={() => openAddDialog('hazard')}>
                <Icon name="Plus" size={16} />
              </Button>
            </div>
            <div className="space-y-2">
              {dictionaries.hazards.map((item) => (
                <div key={item.id} className="p-3 bg-red-50 rounded-lg flex items-center justify-between">
                  <span className="text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="mt-6 p-6 bg-blue-50">
          <h3 className="font-semibold mb-2">Инструкция:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
            <li>Нажмите кнопку "+" чтобы добавить новый элемент в справочник</li>
            <li>Все добавленные элементы появятся в выпадающих списках при регистрации ПАБ</li>
            <li>Элементы можно добавлять в любое время</li>
            <li>Изменения сразу доступны всем пользователям</li>
          </ul>
        </Card>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить в "{getDictionaryTitle(dialogType)}"</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <Label>Название</Label>
            <Input
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Введите название..."
              className="mt-2"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Отмена
            </Button>
            <Button onClick={handleAddItem} disabled={loading}>
              {loading ? 'Добавление...' : 'Добавить'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
