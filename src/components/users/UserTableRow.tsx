import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

interface UserTableRowProps {
  user: User;
  isSuperAdmin: boolean;
  onUpdateRole: (userId: number, newRole: string) => void;
  onEditProfile: (user: User) => void;
  onEditCredentials: (user: User) => void;
  onDelete: (userId: number) => void;
  getRoleBadgeColor: (role: string) => string;
  getRoleLabel: (role: string) => string;
}

export const UserTableRow = ({
  user,
  isSuperAdmin,
  onUpdateRole,
  onEditProfile,
  onEditCredentials,
  onDelete,
  getRoleBadgeColor,
  getRoleLabel,
}: UserTableRowProps) => {
  return (
    <tr className="border-b border-slate-700 hover:bg-slate-700/30">
      <td className="px-4 py-3 text-slate-300">
        {user.display_name || `ID№${String(user.id).padStart(5, '0')}`}
      </td>
      <td className="px-4 py-3 text-slate-300">{user.fio}</td>
      <td className="px-4 py-3 text-slate-300">{user.email}</td>
      <td className="px-4 py-3 text-slate-300">{user.company}</td>
      <td className="px-4 py-3 text-slate-300">{user.subdivision}</td>
      <td className="px-4 py-3 text-slate-300">{user.position}</td>
      <td className="px-4 py-3">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
          {getRoleLabel(user.role)}
        </span>
      </td>
      <td className="px-4 py-3 text-slate-300">
        {new Date(user.created_at).toLocaleDateString('ru-RU')}
      </td>
      <td className="px-4 py-3">
        <div className="text-sm text-slate-400">
          <div>ПАБ: {user.stats.registered_count}</div>
          <div>Онлайн: {user.stats.online_count}</div>
          <div>Офлайн: {user.stats.offline_count}</div>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-col gap-2 min-w-[180px]">
          {isSuperAdmin && (
            <Select
              value={user.role}
              onValueChange={(value) => onUpdateRole(user.id, value)}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white text-xs h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="user" className="text-white hover:bg-slate-600">
                  Пользователь
                </SelectItem>
                <SelectItem value="admin" className="text-white hover:bg-slate-600">
                  Администратор
                </SelectItem>
                <SelectItem value="superadmin" className="text-white hover:bg-slate-600">
                  Суперадмин
                </SelectItem>
              </SelectContent>
            </Select>
          )}
          <Button
            onClick={() => onEditProfile(user)}
            variant="outline"
            size="sm"
            className="border-blue-600/50 text-blue-500 hover:bg-blue-600/10 text-xs h-8"
          >
            <Icon name="Edit" size={14} className="mr-1" />
            Профиль
          </Button>
          {isSuperAdmin && (
            <>
              <Button
                onClick={() => onEditCredentials(user)}
                variant="outline"
                size="sm"
                className="border-yellow-600/50 text-yellow-500 hover:bg-yellow-600/10 text-xs h-8"
              >
                <Icon name="Key" size={14} className="mr-1" />
                Учётка
              </Button>
              <Button
                onClick={() => onDelete(user.id)}
                variant="outline"
                size="sm"
                className="border-red-600/50 text-red-500 hover:bg-red-600/10 text-xs h-8"
              >
                <Icon name="Trash2" size={14} className="mr-1" />
                Удалить
              </Button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};
