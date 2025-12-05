import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface User {
  id: number;
  email: string;
  fio: string;
  display_name?: string;
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

const UsersManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({ total_users: 0, users_count: 0, admins_count: 0, superadmins_count: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editCredentials, setEditCredentials] = useState<{ id: number; email: string; newEmail: string; newPassword: string } | null>(null);
  const [userRole, setUserRole] = useState('');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'admin' && role !== 'superadmin') {
      navigate('/');
      return;
    }
    setUserRole(role || '');
    setIsSuperAdmin(role === 'superadmin');
    loadUsers();
    loadStats();
  }, [navigate]);

  const loadUsers = async () => {
    try {
      const role = localStorage.getItem('userRole');
      const response = await fetch('https://functions.poehali.dev/9d7b143e-21c6-4e84-95b5-302b35a8eedf?action=list', {
        headers: {
          'X-User-Role': role || ''
        }
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      toast({ title: 'Ошибка загрузки пользователей', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/9d7b143e-21c6-4e84-95b5-302b35a8eedf?action=stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to load stats');
    }
  };

  const handleUpdateRole = async (userId: number, newRole: string) => {
    try {
      const response = await fetch('https://functions.poehali.dev/9d7b143e-21c6-4e84-95b5-302b35a8eedf', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_role', userId, role: newRole }),
      });

      const data = await response.json();
      if (data.success) {
        toast({ title: 'Роль обновлена' });
        loadUsers();
        loadStats();
      }
    } catch (error) {
      toast({ title: 'Ошибка обновления роли', variant: 'destructive' });
    }
  };

  const handleUpdateProfile = async () => {
    if (!editUser) return;

    try {
      const response = await fetch('https://functions.poehali.dev/9d7b143e-21c6-4e84-95b5-302b35a8eedf', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_profile',
          userId: editUser.id,
          fio: editUser.fio,
          company: editUser.company,
          subdivision: editUser.subdivision,
          position: editUser.position,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast({ title: 'Профиль обновлён' });
        loadUsers();
        setEditUser(null);
      }
    } catch (error) {
      toast({ title: 'Ошибка обновления профиля', variant: 'destructive' });
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) return;

    try {
      const response = await fetch('https://functions.poehali.dev/9d7b143e-21c6-4e84-95b5-302b35a8eedf', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      if (data.success) {
        toast({ title: 'Пользователь удалён' });
        loadUsers();
        loadStats();
      }
    } catch (error) {
      toast({ title: 'Ошибка удаления', variant: 'destructive' });
    }
  };

  const handleChangeCredentials = async () => {
    if (!editCredentials) return;

    try {
      if (editCredentials.newEmail && editCredentials.newEmail !== editCredentials.email) {
        const response = await fetch('https://functions.poehali.dev/9d7b143e-21c6-4e84-95b5-302b35a8eedf', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'change_email',
            userId: editCredentials.id,
            newEmail: editCredentials.newEmail,
          }),
        });

        const data = await response.json();
        if (!data.success) {
          toast({ title: 'Ошибка', description: data.error, variant: 'destructive' });
          return;
        }
      }

      if (editCredentials.newPassword) {
        const response = await fetch('https://functions.poehali.dev/9d7b143e-21c6-4e84-95b5-302b35a8eedf', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'change_password',
            userId: editCredentials.id,
            newPassword: editCredentials.newPassword,
          }),
        });

        const data = await response.json();
        if (!data.success) {
          toast({ title: 'Ошибка изменения пароля', variant: 'destructive' });
          return;
        }
      }

      toast({ title: 'Данные обновлены' });
      loadUsers();
      setEditCredentials(null);
    } catch (error) {
      toast({ title: 'Ошибка обновления данных', variant: 'destructive' });
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.fio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        return 'Главный админ';
      case 'admin':
        return 'Администратор';
      default:
        return 'Пользователь';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate(-1)} className="border-yellow-600/50">
              <Icon name="ArrowLeft" size={20} />
            </Button>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-cyan-700 p-3 rounded-xl shadow-lg">
                <Icon name="Users" size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Управление пользователями</h1>
                <p className="text-blue-400">Всего пользователей: {stats.total_users}</p>
              </div>
            </div>
          </div>
          {isSuperAdmin && (
            <Button
              onClick={() => navigate('/create-user')}
              className="bg-gradient-to-r from-purple-600 to-pink-700 hover:from-purple-700 hover:to-pink-800"
            >
              <Icon name="UserPlus" size={20} className="mr-2" />
              Создать пользователя
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-blue-600/30 p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 p-3 rounded-lg">
                <Icon name="Users" size={24} className="text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Пользователей</p>
                <p className="text-2xl font-bold text-white">{stats.users_count}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-cyan-600/30 p-6">
            <div className="flex items-center gap-4">
              <div className="bg-cyan-600 p-3 rounded-lg">
                <Icon name="ShieldCheck" size={24} className="text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Администраторов</p>
                <p className="text-2xl font-bold text-white">{stats.admins_count}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-purple-600/30 p-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-600 p-3 rounded-lg">
                <Icon name="Crown" size={24} className="text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Главных админов</p>
                <p className="text-2xl font-bold text-white">{stats.superadmins_count}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-green-600/30 p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-600 p-3 rounded-lg">
                <Icon name="UserPlus" size={24} className="text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Всего</p>
                <p className="text-2xl font-bold text-white">{stats.total_users}</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="bg-slate-800/50 border-yellow-600/30 p-6 mb-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Поиск по ФИО, email или компании..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-700/50 border-yellow-600/30 text-white"
              />
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-700">
              <Icon name="Search" size={20} className="mr-2" />
              Поиск
            </Button>
          </div>
        </Card>

        <div className="space-y-4">
          {loading ? (
            <Card className="bg-slate-800/50 border-yellow-600/30 p-8 text-center">
              <p className="text-gray-400">Загрузка...</p>
            </Card>
          ) : filteredUsers.length === 0 ? (
            <Card className="bg-slate-800/50 border-yellow-600/30 p-8 text-center">
              <p className="text-gray-400">Пользователи не найдены</p>
            </Card>
          ) : (
            filteredUsers.map((user) => (
              <Card key={user.id} className="bg-slate-800/50 border-yellow-600/30 p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-white">
                        {isSuperAdmin ? user.fio : (user.display_name || user.fio)}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRoleBadgeColor(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Email:</p>
                        <p className="text-white">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Компания:</p>
                        <p className="text-white">{user.company}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Подразделение:</p>
                        <p className="text-white">{user.subdivision}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Должность:</p>
                        <p className="text-white">{user.position}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {isSuperAdmin && (
                      <>
                        <Select onValueChange={(value) => handleUpdateRole(user.id, value)}>
                          <SelectTrigger className="w-40 bg-slate-700/50 border-yellow-600/30 text-white">
                            <SelectValue placeholder="Изменить роль" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">Пользователь</SelectItem>
                            <SelectItem value="admin">Администратор</SelectItem>
                            <SelectItem value="superadmin">Главный админ</SelectItem>
                          </SelectContent>
                        </Select>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              onClick={() => setEditUser(user)}
                              className="border-blue-600/50 text-blue-400"
                            >
                              <Icon name="Edit" size={20} />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-slate-800 border-yellow-600/30">
                            <DialogHeader>
                              <DialogTitle className="text-white">Редактировать профиль</DialogTitle>
                            </DialogHeader>
                            {editUser && (
                              <div className="space-y-4">
                                <div>
                                  <Label className="text-gray-300">ФИО</Label>
                                  <Input
                                    value={editUser.fio}
                                    onChange={(e) => setEditUser({ ...editUser, fio: e.target.value })}
                                    className="bg-slate-700/50 border-yellow-600/30 text-white"
                                  />
                                </div>
                                <div>
                                  <Label className="text-gray-300">Компания</Label>
                                  <Input
                                    value={editUser.company}
                                    onChange={(e) => setEditUser({ ...editUser, company: e.target.value })}
                                    className="bg-slate-700/50 border-yellow-600/30 text-white"
                                  />
                                </div>
                                <div>
                                  <Label className="text-gray-300">Подразделение</Label>
                                  <Input
                                    value={editUser.subdivision}
                                    onChange={(e) => setEditUser({ ...editUser, subdivision: e.target.value })}
                                    className="bg-slate-700/50 border-yellow-600/30 text-white"
                                  />
                                </div>
                                <div>
                                  <Label className="text-gray-300">Должность</Label>
                                  <Input
                                    value={editUser.position}
                                    onChange={(e) => setEditUser({ ...editUser, position: e.target.value })}
                                    className="bg-slate-700/50 border-yellow-600/30 text-white"
                                  />
                                </div>
                                <Button
                                  onClick={handleUpdateProfile}
                                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-700"
                                >
                                  Сохранить
                                </Button>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              onClick={() => setEditCredentials({ id: user.id, email: user.email, newEmail: user.email, newPassword: '' })}
                              className="border-purple-600/50 text-purple-400"
                            >
                              <Icon name="Key" size={20} />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-slate-800 border-purple-600/30">
                            <DialogHeader>
                              <DialogTitle className="text-white">Изменить логин и пароль</DialogTitle>
                            </DialogHeader>
                            {editCredentials && (
                              <div className="space-y-4">
                                <div>
                                  <Label className="text-gray-300">Email (логин)</Label>
                                  <Input
                                    type="email"
                                    value={editCredentials.newEmail}
                                    onChange={(e) => setEditCredentials({ ...editCredentials, newEmail: e.target.value })}
                                    className="bg-slate-700/50 border-purple-600/30 text-white"
                                  />
                                </div>
                                <div>
                                  <Label className="text-gray-300">Новый пароль</Label>
                                  <Input
                                    type="text"
                                    value={editCredentials.newPassword}
                                    onChange={(e) => setEditCredentials({ ...editCredentials, newPassword: e.target.value })}
                                    className="bg-slate-700/50 border-purple-600/30 text-white"
                                    placeholder="Оставьте пустым, чтобы не менять"
                                  />
                                </div>
                                <Button
                                  onClick={handleChangeCredentials}
                                  className="w-full bg-gradient-to-r from-purple-600 to-pink-700"
                                >
                                  <Icon name="Save" size={20} className="mr-2" />
                                  Сохранить
                                </Button>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="outline"
                          onClick={() => handleDeleteUser(user.id)}
                          className="border-red-600/50 text-red-400 hover:bg-red-600/10"
                        >
                          <Icon name="Trash2" size={20} />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersManagement;