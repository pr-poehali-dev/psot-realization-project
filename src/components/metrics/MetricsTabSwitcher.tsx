import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface MetricsTabSwitcherProps {
  activeTab: 'pab' | 'pk';
  onTabChange: (tab: 'pab' | 'pk') => void;
}

export const MetricsTabSwitcher = ({ activeTab, onTabChange }: MetricsTabSwitcherProps) => {
  return (
    <div className="flex gap-4 mb-6">
      <Button
        onClick={() => onTabChange('pab')}
        className={`flex-1 py-6 text-lg font-bold transition-all ${
          activeTab === 'pab'
            ? 'bg-gradient-to-r from-red-600 to-red-700 text-white'
            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
        }`}
      >
        <Icon name="FileText" size={24} className="mr-2" />
        Мои показатели по ПАБ
      </Button>
      <Button
        onClick={() => onTabChange('pk')}
        className={`flex-1 py-6 text-lg font-bold transition-all ${
          activeTab === 'pk'
            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
        }`}
      >
        <Icon name="Shield" size={24} className="mr-2" />
        Мои показатели по ПК
      </Button>
    </div>
  );
};
