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

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'superadmin') {
      navigate('/');
      return;
    }
    loadData();
  }, [navigate, id]);

  const loadData = async () => {
    try {
      const [orgRes, modulesRes, pagesRes] = await Promise.all([
        fetch(`https://functions.poehali.dev/5fa1bf89-3c17-4533-889a-7273e1ef1e3b?id=${id}`),
        fetch(`https://functions.poehali.dev/a4f6bfe1-8f77-48b2-b6dd-70ac0a1c023a?type=modules&organization_id=${id}`),
        fetch(`https://functions.poehali.dev/a4f6bfe1-8f77-48b2-b6dd-70ac0a1c023a?type=pages&organization_id=${id}`)
      ]);

      const orgData = await orgRes.json();
      const modulesData = await modulesRes.json();
      const pagesData = await pagesRes.json();

      setOrganization(orgData);
      setModules(modulesData);
      setPages(pagesData);
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Ссылка скопирована');
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
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Информация о предприятии</h3>
              <div className="space-y-2 text-gray-300">
                <div>Тариф: <span className="font-semibold text-white">{organization.subscription_type}</span></div>
                <div>Пользователей: <span className="font-semibold text-white">{organization.user_count}</span></div>
                <div className="flex items-center gap-3">
                  <span>Код регистрации:</span>
                  <span className="font-mono font-bold text-green-400">{organization.registration_code}</span>
                  <Button
                    size="sm"
                    onClick={() => copyToClipboard(`${window.location.origin}/register?code=${organization.registration_code}`)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Icon name="Copy" size={16} className="mr-2" />
                    Скопировать ссылку
                  </Button>
                </div>
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
