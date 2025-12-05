import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface UsersTableHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onExport: () => void;
  isSuperAdmin: boolean;
}

export const UsersTableHeader = ({
  searchQuery,
  onSearchChange,
  onExport,
  isSuperAdmin,
}: UsersTableHeaderProps) => {
  return (
    <div className="flex gap-4 mb-6">
      <div className="flex-1 relative">
        <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Поиск по ФИО, email или компании..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-slate-700 border-slate-600 text-white"
        />
      </div>
      {isSuperAdmin && (
        <Button
          onClick={onExport}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
        >
          <Icon name="Download" size={20} className="mr-2" />
          Экспорт расшифровки ID
        </Button>
      )}
    </div>
  );
};
