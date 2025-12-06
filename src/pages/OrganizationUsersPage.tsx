import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import BlockUserDialog from '@/components/BlockUserDialog';

interface User {
  id: number;
  email: string;
  fio: string;
  subdivision: string;
  position: string;
  role: string;
  created_at: string;
  records_count: number;
  activities_last_month: number;
  last_activity: string | null;
}

interface Organization {
  id: number;
  name: string;
}

const OrganizationUsersPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'activity' | 'records'>('name');
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      navigate('/');
      return;
    }
    
    if (role !== 'superadmin') {
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'user') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
      return;
    }
    
    loadData();
  }, [navigate, id]);

  const loadData = async () => {
    try {
      const [usersRes, orgRes] = await Promise.all([
        fetch(`https://functions.poehali.dev/bceeaee7-5cfa-418c-9c0d-0a61668ab1a4?organization_id=${id}`),
        fetch(`https://functions.poehali.dev/5fa1bf89-3c17-4533-889a-7273e1ef1e3b?id=${id}`)
      ]);

      const usersData = await usersRes.json();
      const orgData = await orgRes.json();

      setUsers(usersData);
      setOrganization(orgData);
    } catch (error) {
      toast.error('Не удалось загрузить данные');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const getSortedUsers = () => {
    const sorted = [...users];
    switch (sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.fio.localeCompare(b.fio));
      case 'activity':
        return sorted.sort((a, b) => b.activities_last_month - a.activities_last_month);
      case 'records':
        return sorted.sort((a, b) => b.records_count - a.records_count);
      default:
        return sorted;
    }
  };

  const getActivityColor = (count: number) => {
    if (count >= 20) return 'from-green-600/30 to-emerald-600/30 border-green-500';
    if (count >= 10) return 'from-blue-600/30 to-indigo-600/30 border-blue-500';
    if (count >= 5) return 'from-yellow-600/30 to-orange-600/30 border-yellow-500';
    return 'from-red-600/30 to-pink-600/30 border-red-500';
  };

  const getActivityLevel = (count: number) => {
    if (count >= 20) return 'Очень активен';
    if (count >= 10) return 'Активен';
    if (count >= 5) return 'Средняя активность';
    return 'Низкая активность';
  };

  const totalStats = users.reduce(
    (acc, user) => ({
      records: acc.records + user.records_count,
      activities: acc.activities + user.activities_last_month
    }),
    { records: 0, activities: 0 }
  );

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
            <Icon name="Users" size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{organization.name}</h1>
            <p className="text-purple-400">Пользователи и активность</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-purple-600/30 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Icon name="Users" size={24} className="text-blue-400" />
              <span className="text-gray-400">Пользователей</span>
            </div>
            <div className="text-3xl font-bold text-white">{users.length}</div>
          </Card>

          <Card className="bg-slate-800/50 border-purple-600/30 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Icon name="FileText" size={24} className="text-green-400" />
              <span className="text-gray-400">Всего записей</span>
            </div>
            <div className="text-3xl font-bold text-white">{totalStats.records}</div>
          </Card>

          <Card className="bg-slate-800/50 border-purple-600/30 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Icon name="Activity" size={24} className="text-purple-400" />
              <span className="text-gray-400">Активность (30 дн)</span>
            </div>
            <div className="text-3xl font-bold text-white">{totalStats.activities}</div>
          </Card>

          <Card className="bg-slate-800/50 border-purple-600/30 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Icon name="TrendingUp" size={24} className="text-orange-400" />
              <span className="text-gray-400">Среднее на юзера</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {users.length > 0 ? Math.round(totalStats.activities / users.length) : 0}
            </div>
          </Card>
        </div>

        <Card className="bg-slate-800/50 border-purple-600/30 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-white">Список пользователей</h3>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={sortBy === 'name' ? 'default' : 'outline'}
                onClick={() => setSortBy('name')}
                className={sortBy === 'name' ? '' : 'border-purple-600/50 text-purple-400'}
              >
                По имени
              </Button>
              <Button
                size="sm"
                variant={sortBy === 'activity' ? 'default' : 'outline'}
                onClick={() => setSortBy('activity')}
                className={sortBy === 'activity' ? '' : 'border-purple-600/50 text-purple-400'}
              >
                По активности
              </Button>
              <Button
                size="sm"
                variant={sortBy === 'records' ? 'default' : 'outline'}
                onClick={() => setSortBy('records')}
                className={sortBy === 'records' ? '' : 'border-purple-600/50 text-purple-400'}
              >
                По записям
              </Button>
            </div>
          </div>

          {users.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="UserX" size={64} className="mx-auto text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Нет пользователей</h3>
              <p className="text-gray-400">В этом предприятии пока нет зарегистрированных пользователей</p>
            </div>
          ) : (
            <div className="space-y-3">
              {getSortedUsers().map((user) => (
                <div
                  key={user.id}
                  className={`p-4 rounded-lg border bg-gradient-to-br ${getActivityColor(
                    user.activities_last_month
                  )}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-bold text-white">{user.fio}</h4>
                        <span className="px-2 py-1 bg-purple-600/30 text-purple-300 rounded text-xs">
                          {user.role}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-300 mb-3">
                        <div>
                          <Icon name="Mail" size={14} className="inline mr-1 text-gray-400" />
                          {user.email}
                        </div>
                        {user.subdivision && (
                          <div>
                            <Icon name="Building" size={14} className="inline mr-1 text-gray-400" />
                            {user.subdivision}
                          </div>
                        )}
                        {user.position && (
                          <div>
                            <Icon name="Briefcase" size={14} className="inline mr-1 text-gray-400" />
                            {user.position}
                          </div>
                        )}
                        <div>
                          <Icon name="Calendar" size={14} className="inline mr-1 text-gray-400" />
                          Регистрация: {new Date(user.created_at).toLocaleDateString('ru-RU')}
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="bg-slate-800/50 px-3 py-2 rounded">
                          <div className="text-xs text-gray-400 mb-1">Записей ПАБ</div>
                          <div className="text-xl font-bold text-white">{user.records_count}</div>
                        </div>

                        <div className="bg-slate-800/50 px-3 py-2 rounded">
                          <div className="text-xs text-gray-400 mb-1">Активность (30 дн)</div>
                          <div className="text-xl font-bold text-white">{user.activities_last_month}</div>
                        </div>

                        <div className="bg-slate-800/50 px-3 py-2 rounded">
                          <div className="text-xs text-gray-400 mb-1">Статус</div>
                          <div className="text-sm font-semibold text-white">
                            {getActivityLevel(user.activities_last_month)}
                          </div>
                        </div>

                        {user.last_activity && (
                          <div className="bg-slate-800/50 px-3 py-2 rounded">
                            <div className="text-xs text-gray-400 mb-1">Последняя активность</div>
                            <div className="text-sm font-semibold text-white">
                              {new Date(user.last_activity).toLocaleDateString('ru-RU')}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        onClick={() => {
                          setSelectedUser(user);
                          setBlockDialogOpen(true);
                        }}
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Icon name="Ban" size={16} className="mr-1" />
                        Заблокировать
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {selectedUser && (
        <BlockUserDialog
          user={selectedUser}
          isOpen={blockDialogOpen}
          onClose={() => {
            setBlockDialogOpen(false);
            setSelectedUser(null);
          }}
          onSuccess={() => {
            loadData();
          }}
        />
      )}
    </div>
  );
};

export default OrganizationUsersPage;