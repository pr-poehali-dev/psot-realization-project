import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import FUNC_URLS from '../../backend/func2url.json';

interface Module {
  id: number;
  name: string;
  display_name: string;
  description: string;
  route_path: string;
  icon: string;
  category: string;
}

interface TariffPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  is_active: boolean;
  is_default: boolean;
  module_count?: number;
  modules?: Module[];
}

export default function TariffManagementPage() {
  const [tariffs, setTariffs] = useState<TariffPlan[]>([]);
  const [allModules, setAllModules] = useState<Module[]>([]);
  const [selectedTariff, setSelectedTariff] = useState<TariffPlan | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    module_ids: [] as number[]
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tariffsRes, modulesRes] = await Promise.all([
        fetch(FUNC_URLS.tariffs),
        fetch(FUNC_URLS.modules)
      ]);

      const tariffsData = await tariffsRes.json();
      const modulesData = await modulesRes.json();

      setTariffs(tariffsData);
      setAllModules(modulesData);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTariffDetails = async (tariffId: number) => {
    try {
      const res = await fetch(`${FUNC_URLS.tariffs}?id=${tariffId}`);
      const data = await res.json();
      setSelectedTariff(data);
      setFormData({
        name: data.name,
        description: data.description || '',
        price: data.price,
        module_ids: data.modules?.map((m: Module) => m.id) || []
      });
    } catch (error) {
      console.error('Ошибка загрузки тарифа:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = FUNC_URLS.tariffs;
      const method = isCreating ? 'POST' : 'PUT';
      const body = isCreating
        ? formData
        : { id: selectedTariff?.id, ...formData };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        await loadData();
        setIsCreating(false);
        setSelectedTariff(null);
        setFormData({ name: '', description: '', price: 0, module_ids: [] });
      }
    } catch (error) {
      console.error('Ошибка сохранения:', error);
    } finally {
      setSaving(false);
    }
  };

  const toggleModule = (moduleId: number) => {
    setFormData(prev => ({
      ...prev,
      module_ids: prev.module_ids.includes(moduleId)
        ? prev.module_ids.filter(id => id !== moduleId)
        : [...prev.module_ids, moduleId]
    }));
  };

  const groupedModules = allModules.reduce((acc, module) => {
    const category = module.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(module);
    return acc;
  }, {} as Record<string, Module[]>);

  const categoryNames: Record<string, string> = {
    main: 'Основные',
    logistics: 'Логистика',
    production: 'Производство',
    hr: 'Персонал',
    analytics: 'Аналитика',
    system: 'Системные',
    pab: 'ПАБ',
    storage: 'Хранилище',
    users: 'Пользователи',
    other: 'Другие'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 flex items-center justify-center">
        <Icon name="Loader2" size={48} className="text-purple-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Управление тарифными планами</h1>
            <p className="text-gray-300">Настройка тарифов и модулей для предприятий</p>
          </div>
          <Button
            onClick={() => {
              setIsCreating(true);
              setSelectedTariff(null);
              setFormData({ name: '', description: '', price: 0, module_ids: [] });
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Icon name="Plus" size={20} className="mr-2" />
            Создать тариф
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">Тарифные планы</h2>
            {tariffs.map((tariff) => (
              <div
                key={tariff.id}
                onClick={() => loadTariffDetails(tariff.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedTariff?.id === tariff.id
                    ? 'border-blue-500 bg-blue-600/20'
                    : 'border-purple-600/30 bg-slate-700/30 hover:border-purple-600'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">{tariff.name}</h3>
                  {tariff.is_default && (
                    <span className="px-2 py-1 bg-green-600/30 text-green-400 text-xs rounded">
                      По умолчанию
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400 mb-2">{tariff.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-purple-400 font-semibold">
                    {tariff.price === 0 ? 'Бесплатно' : `${tariff.price} ₽/мес`}
                  </span>
                  <span className="text-gray-400">{tariff.module_count} модулей</span>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2">
            {(selectedTariff || isCreating) ? (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-600/30">
                <h2 className="text-2xl font-semibold text-white mb-6">
                  {isCreating ? 'Создание тарифного плана' : `Редактирование: ${selectedTariff?.name}`}
                </h2>

                <div className="space-y-6">
                  <div>
                    <Label className="text-white text-lg mb-2 block">Название тарифа</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-slate-700/50 border-purple-600/30 text-white"
                      placeholder="Например: Базовый"
                    />
                  </div>

                  <div>
                    <Label className="text-white text-lg mb-2 block">Описание</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-slate-700/50 border-purple-600/30 text-white"
                      placeholder="Краткое описание тарифа"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label className="text-white text-lg mb-2 block">Стоимость (₽/мес)</Label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      className="bg-slate-700/50 border-purple-600/30 text-white"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <Label className="text-white text-lg mb-3 block">
                      Модули в тарифе ({formData.module_ids.length} из {allModules.length})
                    </Label>
                    
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                      {Object.entries(groupedModules).map(([category, modules]) => (
                        <div key={category} className="space-y-2">
                          <h3 className="text-sm font-semibold text-purple-400">
                            {categoryNames[category] || category}
                          </h3>
                          <div className="grid grid-cols-1 gap-2">
                            {modules.map((module) => (
                              <div
                                key={module.id}
                                onClick={() => toggleModule(module.id)}
                                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                  formData.module_ids.includes(module.id)
                                    ? 'border-blue-500 bg-blue-600/20'
                                    : 'border-slate-600/50 bg-slate-700/30 hover:border-slate-500'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <Icon 
                                    name={formData.module_ids.includes(module.id) ? 'CheckCircle2' : 'Circle'} 
                                    size={20} 
                                    className={formData.module_ids.includes(module.id) ? 'text-blue-400' : 'text-gray-500'}
                                  />
                                  <div className="flex-1">
                                    <p className="text-white font-medium">{module.display_name}</p>
                                    <p className="text-xs text-gray-400">{module.description}</p>
                                  </div>
                                  <Icon name={module.icon as any} size={20} className="text-purple-400" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleSave}
                      disabled={saving || !formData.name}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      {saving ? (
                        <>
                          <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                          Сохранение...
                        </>
                      ) : (
                        <>
                          <Icon name="Save" size={20} className="mr-2" />
                          {isCreating ? 'Создать тариф' : 'Сохранить изменения'}
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => {
                        setIsCreating(false);
                        setSelectedTariff(null);
                      }}
                      variant="outline"
                      className="border-purple-600/30"
                    >
                      Отмена
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-12 border border-purple-600/30 flex flex-col items-center justify-center text-center h-full min-h-[500px]">
                <Icon name="Settings" size={64} className="text-purple-400 mb-4" />
                <h3 className="text-2xl font-semibold text-white mb-2">Выберите тариф для редактирования</h3>
                <p className="text-gray-400">или создайте новый тарифный план</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
