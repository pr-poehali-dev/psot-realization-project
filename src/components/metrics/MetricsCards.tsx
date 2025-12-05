import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface MetricsData {
  totalAudits?: number;
  totalInspections?: number;
  totalObservations?: number;
  totalViolations?: number;
  resolved: number;
  inProgress: number;
  overdue: number;
}

interface MetricsCardsProps {
  type: 'pab' | 'pk';
  metrics: MetricsData;
  onMetricClick?: (metricType: string) => void;
}

export const MetricsCards = ({ type, metrics, onMetricClick }: MetricsCardsProps) => {
  const isPab = type === 'pab';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="bg-slate-800/50 border-yellow-600/30 p-6">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 p-4 rounded-xl">
            <Icon name={isPab ? 'FileText' : 'Shield'} size={32} className="text-white" />
          </div>
          <div>
            <p className="text-sm text-slate-400">
              {isPab ? 'Всего аудитов' : 'Всего проверок'}
            </p>
            <p className="text-3xl font-bold text-yellow-500">
              {isPab ? metrics.totalAudits : metrics.totalInspections}
            </p>
          </div>
        </div>
      </Card>

      <Card
        onClick={() => onMetricClick?.('all')}
        className="bg-slate-800/50 border-yellow-600/30 p-6 cursor-pointer hover:border-yellow-600 transition-all hover:scale-105"
      >
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-amber-700 to-amber-800 p-4 rounded-xl">
            <Icon name="AlertTriangle" size={32} className="text-white" />
          </div>
          <div>
            <p className="text-sm text-slate-400">
              {isPab ? 'Всего выявлено' : 'Всего нарушений'}
            </p>
            <p className="text-3xl font-bold" style={{ color: '#8B4513' }}>
              {isPab ? metrics.totalObservations : metrics.totalViolations}
            </p>
          </div>
        </div>
      </Card>

      <Card
        onClick={() => onMetricClick?.('resolved')}
        className="bg-slate-800/50 border-yellow-600/30 p-6 cursor-pointer hover:border-yellow-600 transition-all hover:scale-105"
      >
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-green-600 to-green-700 p-4 rounded-xl">
            <Icon name="CheckCircle" size={32} className="text-white" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Устранено</p>
            <p className="text-3xl font-bold text-green-500">{metrics.resolved}</p>
          </div>
        </div>
      </Card>

      <Card
        onClick={() => onMetricClick?.('in_progress')}
        className="bg-slate-800/50 border-yellow-600/30 p-6 cursor-pointer hover:border-yellow-600 transition-all hover:scale-105"
      >
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-4 rounded-xl">
            <Icon name="Clock" size={32} className="text-white" />
          </div>
          <div>
            <p className="text-sm text-slate-400">В работе</p>
            <p className="text-3xl font-bold text-white">{metrics.inProgress}</p>
          </div>
        </div>
      </Card>

      <Card
        onClick={() => onMetricClick?.('overdue')}
        className="bg-slate-800/50 border-red-600/50 p-6 cursor-pointer hover:border-red-600 transition-all hover:scale-105 animate-pulse"
      >
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-red-600 to-red-700 p-4 rounded-xl">
            <Icon name="AlertCircle" size={32} className="text-white" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Просрочено</p>
            <p className="text-3xl font-bold text-red-500">{metrics.overdue}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
