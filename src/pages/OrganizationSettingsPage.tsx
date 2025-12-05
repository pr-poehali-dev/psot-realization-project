import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Organization {
  id: number;
  name: string;
  registration_code: string;
  user_count: number;
  subscription_type: string;
  logo_url: string | null;
  points_balance?: number;
  points_enabled?: boolean;
}

interface Module {
  id: number;
  name: string;
  description: string;
  module_type: string;
  enabled: boolean;
}

interface Page {
  id: number;
  name: string;
  route: string;
  icon: string;
  description: string;
  enabled: boolean;
}

const OrganizationSettingsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [pointsBalance, setPointsBalance] = useState(0);
  const [pointsEnabled, setPointsEnabled] = useState(false);
  const [pointsHistory, setPointsHistory] = useState<any[]>([]);
  const [showPointsHistory, setShowPointsHistory] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'superadmin') {
      navigate('/');
      return;
    }
    loadData();
  }, [navigate, id]);

  useEffect(() => {
    if (organization?.logo_url) {
      setLogoPreview(organization.logo_url);
    }
  }, [organization]);

  const loadData = async () => {
    try {
      const [orgRes, modulesRes, pagesRes, pointsRes] = await Promise.all([
        fetch(`https://functions.poehali.dev/5fa1bf89-3c17-4533-889a-7273e1ef1e3b?id=${id}`),
        fetch(`https://functions.poehali.dev/a4f6bfe1-8f77-48b2-b6dd-70ac0a1c023a?type=modules&organization_id=${id}`),
        fetch(`https://functions.poehali.dev/a4f6bfe1-8f77-48b2-b6dd-70ac0a1c023a?type=pages&organization_id=${id}`),
        fetch(`https://functions.poehali.dev/1e66556d-e508-403d-aced-20637779242a?org_id=${id}`)
      ]);

      const orgData = await orgRes.json();
      const modulesData = await modulesRes.json();
      const pagesData = await pagesRes.json();
      const pointsData = await pointsRes.json();

      setOrganization(orgData);
      setModules(modulesData);
      setPages(pagesData);
      setPointsBalance(pointsData.points_balance || 0);
      setPointsEnabled(pointsData.is_enabled || false);
    } catch (error) {
      toast.error('Не удалось загрузить данные');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (moduleId: number) => {
    setModules(prev =>
      prev.map(m => (m.id === moduleId ? { ...m, enabled: !m.enabled } : m))
    );
  };

  const togglePage = (pageId: number) => {
    setPages(prev =>
      prev.map(p => (p.id === pageId ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const enabledModules = modules.filter(m => m.enabled).map(m => m.id);
      const enabledPages = pages.filter(p => p.enabled).map(p => p.id);

      await Promise.all([
        fetch('https://functions.poehali.dev/a4f6bfe1-8f77-48b2-b6dd-70ac0a1c023a', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            organization_id: id,
            type: 'modules',
            items: enabledModules
          })
        }),
        fetch('https://functions.poehali.dev/a4f6bfe1-8f77-48b2-b6dd-70ac0a1c023a', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            organization_id: id,
            type: 'pages',
            items: enabledPages
          })
        })
      ]);

      toast.success('Настройки сохранены');
    } catch (error) {
      toast.error('Не удалось сохранить настройки');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    toast.success(`${type} скопирована`);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Можно загружать только изображения');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5 МБ
    if (file.size > maxSize) {
      toast.error('Размер изображения не должен превышать 5 МБ');
      return;
    }

    setUploadingLogo(true);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        setLogoPreview(base64);

        const response = await fetch('https://functions.poehali.dev/5fa1bf89-3c17-4533-889a-7273e1ef1e3b', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: organization!.id,
            logo_url: base64
          })
        });

        if (response.ok) {
          toast.success('Логотип загружен');
          setOrganization(prev => prev ? { ...prev, logo_url: base64 } : null);
        } else {
          toast.error('Не удалось загрузить логотип');
          setLogoPreview(organization?.logo_url || null);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
      toast.error('Ошибка загрузки логотипа');
      setLogoPreview(organization?.logo_url || null);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleDeleteLogo = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/5fa1bf89-3c17-4533-889a-7273e1ef1e3b', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: organization!.id,
          logo_url: null
        })
      });

      if (response.ok) {
        toast.success('Логотип удален');
        setLogoPreview(null);
        setOrganization(prev => prev ? { ...prev, logo_url: null } : null);
      } else {
        toast.error('Не удалось удалить логотип');
      }
    } catch (error) {
      console.error(error);
      toast.error('Ошибка удаления логотипа');
    }
  };

  const togglePoints = async () => {
    try {
      const newState = !pointsEnabled;
      const response = await fetch('https://functions.poehali.dev/1e66556d-e508-403d-aced-20637779242a', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          org_id: id,
          is_enabled: newState
        })
      });

      if (response.ok) {
        setPointsEnabled(newState);
        toast.success(newState ? 'Система баллов включена' : 'Система баллов выключена');
      } else {
        toast.error('Не удалось изменить настройки');
      }
    } catch (error) {
      console.error(error);
      toast.error('Ошибка изменения настроек');
    }
  };

  const addPoints = async () => {
    const amount = prompt('Введите количество баллов для начисления:');
    if (!amount || isNaN(Number(amount))) return;

    try {
      const response = await fetch('https://functions.poehali.dev/1e66556d-e508-403d-aced-20637779242a', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          org_id: id,
          points_amount: parseFloat(amount),
          operation_type: 'admin_add',
          description: 'Начисление администратором'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setPointsBalance(data.new_balance);
        toast.success('Баллы начислены');
      } else {
        toast.error('Не удалось начислить баллы');
      }
    } catch (error) {
      console.error(error);
      toast.error('Ошибка начисления баллов');
    }
  };

  const loadPointsHistory = async () => {
    try {
      const response = await fetch(`https://functions.poehali.dev/1e66556d-e508-403d-aced-20637779242a?org_id=${id}&history=true`);
      if (response.ok) {
        const data = await response.json();
        setPointsHistory(data);
        setShowPointsHistory(true);
      }
    } catch (error) {
      console.error(error);
      toast.error('Не удалось загрузить историю');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Предприятие не найдено</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate('/organizations-management')} className="text-purple-400">
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Назад
          </Button>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-purple-600/50 text-purple-400 hover:bg-purple-600/10"
          >
            <Icon name="LogOut" size={20} className="mr-2" />
            Выход
          </Button>
        </div>

        <div className="mt-8 flex items-center gap-4">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-3 rounded-xl shadow-lg">
            <Icon name="Settings" size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{organization.name}</h1>
            <p className="text-purple-400">Настройка модулей и страниц</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="bg-slate-800/50 border-purple-600/30 p-6">
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Информация о предприятии</h3>
            <div className="space-y-4 text-gray-300">
              <div className="grid grid-cols-2 gap-4">
                <div>Тариф: <span className="font-semibold text-white">{organization.subscription_type}</span></div>
                <div>Пользователей: <span className="font-semibold text-white">{organization.user_count}</span></div>
              </div>
              
              {/* Система баллов */}
              <div className="border-t border-purple-600/30 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white">Система баллов</h4>
                    <p className="text-sm text-gray-400">Начисление и использование баллов для оплаты</p>
                  </div>
                  <Button
                    onClick={togglePoints}
                    variant={pointsEnabled ? "default" : "outline"}
                    className={pointsEnabled ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    <Icon name={pointsEnabled ? "Check" : "X"} size={16} className="mr-2" />
                    {pointsEnabled ? 'Включено' : 'Выключено'}
                  </Button>
                </div>

                {pointsEnabled && (
                  <div className="bg-gradient-to-r from-orange-600/20 to-amber-700/20 p-4 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-orange-400">Баланс баллов</p>
                        <p className="text-3xl font-bold text-white">{pointsBalance.toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => navigate(`/points-rules/${id}`)} 
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Icon name="Settings" size={16} className="mr-2" />
                          Правила
                        </Button>
                        <Button size="sm" onClick={addPoints} className="bg-green-600 hover:bg-green-700">
                          <Icon name="Plus" size={16} className="mr-2" />
                          Начислить
                        </Button>
                        <Button size="sm" variant="outline" onClick={loadPointsHistory}>
                          <Icon name="History" size={16} className="mr-2" />
                          История
                        </Button>
                      </div>
                    </div>

                    {showPointsHistory && pointsHistory.length > 0 && (
                      <div className="border-t border-orange-600/30 pt-3 mt-3">
                        <h5 className="text-sm font-semibold text-white mb-2">Последние операции</h5>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {pointsHistory.slice(0, 10).map((item) => (
                            <div key={item.id} className="flex justify-between text-sm bg-slate-700/30 p-2 rounded">
                              <span className="text-gray-300">{item.description}</span>
                              <span className={item.points_amount > 0 ? "text-green-400" : "text-red-400"}>
                                {item.points_amount > 0 ? '+' : ''}{item.points_amount}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Логотип предприятия */}
              <div className="border-t border-purple-600/30 pt-4">
                <h4 className="text-lg font-semibold text-white mb-3">Логотип предприятия</h4>
                <div className="flex items-start gap-4">
                  {logoPreview ? (
                    <div className="relative group">
                      <img 
                        src={logoPreview} 
                        alt="Логотип" 
                        className="w-32 h-32 object-contain rounded-lg border-2 border-yellow-600/30 bg-white/5"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={handleDeleteLogo}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  ) : (
                    <div className="w-32 h-32 flex items-center justify-center border-2 border-dashed border-yellow-600/30 rounded-lg bg-slate-700/30">
                      <Icon name="Image" size={32} className="text-slate-500" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-gray-400 mb-3">
                      Логотип будет отображаться на странице входа предприятия. Рекомендуемый размер: 256x256px
                    </p>
                    <label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        disabled={uploadingLogo}
                        className="hidden"
                      />
                      <Button
                        as="span"
                        size="sm"
                        disabled={uploadingLogo}
                        className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                      >
                        <Icon name={uploadingLogo ? "Loader2" : "Upload"} size={16} className={`mr-2 ${uploadingLogo ? 'animate-spin' : ''}`} />
                        {uploadingLogo ? 'Загрузка...' : logoPreview ? 'Изменить логотип' : 'Загрузить логотип'}
                      </Button>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-purple-600/30 pt-4 mt-4">
                <h4 className="text-lg font-semibold text-white mb-3">Ссылки для входа и регистрации</h4>
                
                {/* Ссылка для входа */}
                <div className="mb-4 p-4 bg-slate-700/50 rounded-lg border border-yellow-600/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-yellow-400">Страница входа для сотрудников:</span>
                    <Button
                      size="sm"
                      variant={copiedLink ? "outline" : "default"}
                      onClick={() => copyToClipboard(`${window.location.origin}/org/${organization.registration_code}`, 'Ссылка для входа')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Icon name={copiedLink ? "Check" : "Copy"} size={16} className="mr-2" />
                      {copiedLink ? 'Скопировано' : 'Копировать'}
                    </Button>
                  </div>
                  <code className="text-sm text-gray-300 break-all">
                    {window.location.origin}/org/{organization.registration_code}
                  </code>
                </div>

                {/* Ссылка для регистрации */}
                <div className="p-4 bg-slate-700/50 rounded-lg border border-green-600/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-green-400">Ссылка для регистрации новых пользователей:</span>
                    <Button
                      size="sm"
                      onClick={() => copyToClipboard(`${window.location.origin}/register?code=${organization.registration_code}`, 'Ссылка для регистрации')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Icon name="Copy" size={16} className="mr-2" />
                      Копировать
                    </Button>
                  </div>
                  <code className="text-sm text-gray-300 break-all">
                    {window.location.origin}/register?code={organization.registration_code}
                  </code>
                </div>

                <p className="text-xs text-gray-500 mt-3">
                  💡 Отправьте эти ссылки сотрудникам предприятия "{organization.name}" для входа в систему АСУБТ
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-slate-800/50 border-purple-600/30 p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Icon name="Package" size={24} className="text-purple-400" />
            Доступные модули
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map((module) => (
              <div
                key={module.id}
                onClick={() => toggleModule(module.id)}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  module.enabled
                    ? 'bg-gradient-to-br from-green-600/30 to-emerald-600/30 border border-green-500'
                    : 'bg-slate-700/50 border border-purple-600/30 hover:border-purple-600'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Checkbox checked={module.enabled} className="mt-1" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1">{module.name}</h4>
                    <p className="text-sm text-gray-400">{module.description}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-purple-600/20 text-purple-300 rounded text-xs">
                      {module.module_type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-slate-800/50 border-purple-600/30 p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Icon name="FileText" size={24} className="text-purple-400" />
            Доступные страницы
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pages.map((page) => (
              <div
                key={page.id}
                onClick={() => togglePage(page.id)}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  page.enabled
                    ? 'bg-gradient-to-br from-blue-600/30 to-indigo-600/30 border border-blue-500'
                    : 'bg-slate-700/50 border border-purple-600/30 hover:border-purple-600'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Checkbox checked={page.enabled} className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon name={page.icon} size={18} className="text-purple-400" />
                      <h4 className="font-semibold text-white">{page.name}</h4>
                    </div>
                    <p className="text-sm text-gray-400 mb-1">{page.description}</p>
                    <code className="text-xs text-gray-500">{page.route}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-slate-800/50 border-purple-600/30 p-6">
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-green-600 to-emerald-700 px-8"
            >
              {saving ? (
                <>
                  <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                  Сохранение...
                </>
              ) : (
                <>
                  <Icon name="Save" size={20} className="mr-2" />
                  Сохранить настройки
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OrganizationSettingsPage;