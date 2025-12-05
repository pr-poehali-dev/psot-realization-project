import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface MetricsDateFilterProps {
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (date: string) => void;
  onDateToChange: (date: string) => void;
  onUpdate: () => void;
}

export const MetricsDateFilter = ({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  onUpdate,
}: MetricsDateFilterProps) => {
  return (
    <Card className="bg-slate-800/50 border-yellow-600/30 p-6 mb-6">
      <h3 className="text-lg font-semibold text-white mb-4">Период</h3>
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="text-sm text-slate-300 block mb-2">С</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2"
          />
        </div>
        <div className="flex-1">
          <label className="text-sm text-slate-300 block mb-2">По</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2"
          />
        </div>
        <Button
          onClick={onUpdate}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        >
          <Icon name="Search" size={20} className="mr-2" />
          Обновить
        </Button>
      </div>
    </Card>
  );
};
