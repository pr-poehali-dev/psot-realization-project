import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface UsersStatsCardsProps {
  stats: {
    total_users: number;
    users_count: number;
    admins_count: number;
    superadmins_count: number;
  };
}

export const UsersStatsCards = ({ stats }: UsersStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="bg-slate-800/50 border-yellow-600/30 p-6">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-4 rounded-xl">
            <Icon name="Users" size={32} className="text-white" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Всего пользователей</p>
            <p className="text-3xl font-bold text-blue-500">{stats.total_users}</p>
          </div>
        </div>
      </Card>

      <Card className="bg-slate-800/50 border-yellow-600/30 p-6">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-green-600 to-green-700 p-4 rounded-xl">
            <Icon name="User" size={32} className="text-white" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Пользователи</p>
            <p className="text-3xl font-bold text-green-500">{stats.users_count}</p>
          </div>
        </div>
      </Card>

      <Card className="bg-slate-800/50 border-yellow-600/30 p-6">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-4 rounded-xl">
            <Icon name="Shield" size={32} className="text-white" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Администраторы</p>
            <p className="text-3xl font-bold text-blue-500">{stats.admins_count}</p>
          </div>
        </div>
      </Card>

      <Card className="bg-slate-800/50 border-yellow-600/30 p-6">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-4 rounded-xl">
            <Icon name="Crown" size={32} className="text-white" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Суперадмины</p>
            <p className="text-3xl font-bold text-purple-500">{stats.superadmins_count}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
