import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface UserProfile {
  id: number;
  email: string;
  fio: string;
  company: string;
  subdivision: string;
  position: string;
  role: string;
  created_at: string;
  stats: {
    registered_count: number;
    online_count: number;
    offline_count: number;
  };
}

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  
  const [fio, setFio] = useState('');
  const [company, setCompany] = useState('');
  const [subdivision, setSubdivision] = useState('');
  const [position, setPosition] = useState('');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/');
      return;
    }
    loadProfile(userId);
  }, [navigate]);

  const loadProfile = async (userId: string) => {
    try {
      const response = await fetch(`https://functions.poehali.dev/1428a44a-2d14-4e76-86e5-7e660fdfba3f?userId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setProfile(data.user);
        setFio(data.user.fio);
        setCompany(data.user.company);
        setSubdivision(data.user.subdivision);
        setPosition(data.user.position);
      }
    } catch (error) {
      toast({ title: 'Ошибка загрузки профиля', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      const response = await fetch('https://functions.poehali.dev/1428a44a-2d14-4e76-86e5-7e660fdfba3f', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_profile',
          userId,
          fio,
          company,
          subdivision,
          position,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast({ title: 'Профиль обновлён' });
        localStorage.setItem('userFio', fio);
        setEditMode(false);
        loadProfile(userId);
      }
    } catch (error) {
      toast({ title: 'Ошибка обновления профиля', variant: 'destructive' });
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({ title: 'Пароли не совпадают', variant: 'destructive' });
      return;
    }

    if (newPassword.length < 6) {
      toast({ title: 'Пароль должен быть не менее 6 символов', variant: 'destructive' });
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      const response = await fetch('https://functions.poehali.dev/1428a44a-2d14-4e76-86e5-7e660fdfba3f', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'change_password',
          userId,
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast({ title: 'Пароль изменён' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast({ title: 'Ошибка', description: data.error, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка изменения пароля', variant: 'destructive' });
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'bg-purple-600 text-white';
      case 'admin':
        return 'bg-blue-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'Главный администратор';
      case 'admin':
        return 'Администратор';
      default:
        return 'Пользователь';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <p className="text-white text-xl">Загрузка...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <p className="text-white text-xl">Профиль не найден</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate(-1)} className="border-yellow-600/50">
              <Icon name="ArrowLeft" size={20} />
            </Button>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-yellow-600 to-orange-700 p-3 rounded-xl shadow-lg">
                <Icon name="User" size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Мой профиль</h1>
                <p className="text-yellow-500">{profile.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-green-600/30 p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-600 p-3 rounded-lg">
                <Icon name="CheckCircle" size={24} className="text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Назначено</p>
                <p className="text-2xl font-bold text-white">{profile.stats.registered_count}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-blue-600/30 p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 p-3 rounded-lg">
                <Icon name="Activity" size={24} className="text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">В работе</p>
                <p className="text-2xl font-bold text-white">{profile.stats.online_count}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-red-600/30 p-6">
            <div className="flex items-center gap-4">
              <div className="bg-red-600 p-3 rounded-lg">
                <Icon name="AlertCircle" size={24} className="text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Просрочено</p>
                <p className="text-2xl font-bold text-white">{profile.stats.offline_count}</p>
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-yellow-600/30">
            <TabsTrigger value="profile" className="data-[state=active]:bg-yellow-600">
              <Icon name="User" size={18} className="mr-2" />
              Профиль
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-yellow-600">
              <Icon name="Lock" size={18} className="mr-2" />
              Безопасность
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="bg-slate-800/50 border-yellow-600/30 p-6">
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-gradient-to-br from-yellow-600 to-orange-700 p-4 rounded-2xl">
                    <Icon name="UserCircle" size={48} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{profile.fio}</h2>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getRoleBadgeColor(profile.role)} mt-2`}>
                      {getRoleLabel(profile.role)}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-300">ФИО</Label>
                    <Input
                      value={fio}
                      onChange={(e) => setFio(e.target.value)}
                      disabled={!editMode}
                      className="bg-slate-700/50 border-yellow-600/30 text-white disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300">Компания</Label>
                    <Input
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      disabled={!editMode}
                      className="bg-slate-700/50 border-yellow-600/30 text-white disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300">Подразделение</Label>
                    <Input
                      value={subdivision}
                      onChange={(e) => setSubdivision(e.target.value)}
                      disabled={!editMode}
                      className="bg-slate-700/50 border-yellow-600/30 text-white disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300">Должность</Label>
                    <Input
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      disabled={!editMode}
                      className="bg-slate-700/50 border-yellow-600/30 text-white disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300">Email</Label>
                    <Input
                      value={profile.email}
                      disabled
                      className="bg-slate-700/30 border-yellow-600/20 text-gray-400"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300">Дата регистрации</Label>
                    <Input
                      value={new Date(profile.created_at).toLocaleDateString('ru-RU')}
                      disabled
                      className="bg-slate-700/30 border-yellow-600/20 text-gray-400"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  {!editMode ? (
                    <Button
                      onClick={() => setEditMode(true)}
                      className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-700 hover:from-yellow-700 hover:to-orange-800"
                    >
                      <Icon name="Edit" size={20} className="mr-2" />
                      Редактировать
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={handleUpdateProfile}
                        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                      >
                        <Icon name="Check" size={20} className="mr-2" />
                        Сохранить
                      </Button>
                      <Button
                        onClick={() => {
                          setEditMode(false);
                          setFio(profile.fio);
                          setCompany(profile.company);
                          setSubdivision(profile.subdivision);
                          setPosition(profile.position);
                        }}
                        variant="outline"
                        className="flex-1 border-red-600/50 text-red-400 hover:bg-red-600/10"
                      >
                        <Icon name="X" size={20} className="mr-2" />
                        Отмена
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="bg-slate-800/50 border-yellow-600/30 p-6">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-red-600 to-orange-700 p-3 rounded-xl">
                    <Icon name="ShieldAlert" size={32} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Изменить пароль</h2>
                    <p className="text-gray-400 text-sm">Рекомендуется использовать сложный пароль</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Текущий пароль</Label>
                    <Input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="bg-slate-700/50 border-yellow-600/30 text-white"
                      placeholder="Введите текущий пароль"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300">Новый пароль</Label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-slate-700/50 border-yellow-600/30 text-white"
                      placeholder="Введите новый пароль"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300">Подтвердите новый пароль</Label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-slate-700/50 border-yellow-600/30 text-white"
                      placeholder="Повторите новый пароль"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleChangePassword}
                  className="w-full bg-gradient-to-r from-red-600 to-orange-700 hover:from-red-700 hover:to-orange-800"
                  disabled={!currentPassword || !newPassword || !confirmPassword}
                >
                  <Icon name="Key" size={20} className="mr-2" />
                  Изменить пароль
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-600 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-700 rounded-full blur-3xl animate-pulse" />
      </div>
    </div>
  );
};

export default Profile;
