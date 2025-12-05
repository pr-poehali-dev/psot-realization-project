import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { generatePabHtml } from '@/utils/generatePabHtml';

interface Observation {
  id: number;
  doc_number: string;
  doc_date: string;
  observation_number: number;
  description: string;
  status: string;
  deadline: string;
  responsible_person: string;
  inspector_fio: string;
  inspector_position: string;
  department: string;
  location: string;
  checked_object: string;
}

const MyMetricsPage = () => {
  const navigate = useNavigate();
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [metrics, setMetrics] = useState({
    totalAudits: 0,
    totalObservations: 0,
    resolved: 0,
    inProgress: 0,
    overdue: 0,
  });
  const [selectedObservations, setSelectedObservations] = useState<Observation[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/');
      return;
    }

    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    setDateFrom(firstDayOfMonth.toISOString().split('T')[0]);
    setDateTo(today.toISOString().split('T')[0]);

    loadMetrics(firstDayOfMonth.toISOString().split('T')[0], today.toISOString().split('T')[0]);
  }, [navigate]);

  const loadMetrics = async (from: string, to: string) => {
    try {
      const orgId = localStorage.getItem('orgId');
      if (!orgId) return;

      const fromDate = new Date(from);
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);

      const { data: audits, error: auditsError } = await supabase
        .from('pab_registrations')
        .select('*')
        .eq('org_id', orgId)
        .gte('doc_date', fromDate.toISOString())
        .lte('doc_date', toDate.toISOString());

      if (auditsError) throw auditsError;

      const { data: observations, error: obsError } = await supabase
        .from('pab_observations')
        .select('*')
        .eq('org_id', orgId)
        .gte('created_at', fromDate.toISOString())
        .lte('created_at', toDate.toISOString());

      if (obsError) throw obsError;

      const now = new Date();
      let resolved = 0;
      let inProgress = 0;
      let overdue = 0;

      observations?.forEach(obs => {
        const deadlineDate = new Date(obs.deadline);
        if (obs.status === 'resolved') {
          resolved++;
        } else if (obs.status === 'in_progress') {
          if (deadlineDate < now) {
            overdue++;
          } else {
            inProgress++;
          }
        } else if (obs.status === 'new') {
          if (deadlineDate < now) {
            overdue++;
          } else {
            inProgress++;
          }
        }
      });

      setMetrics({
        totalAudits: audits?.length || 0,
        totalObservations: observations?.length || 0,
        resolved,
        inProgress,
        overdue,
      });
    } catch (error) {
      console.error('Error loading metrics:', error);
      toast.error('Ошибка загрузки статистики');
    }
  };

  const handleMetricClick = async (type: string) => {
    try {
      const orgId = localStorage.getItem('orgId');
      if (!orgId) return;

      const fromDate = new Date(dateFrom);
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);

      const { data: observations, error } = await supabase
        .from('pab_observations')
        .select(`
          id,
          doc_number,
          doc_date,
          observation_number,
          description,
          status,
          deadline,
          responsible_person,
          inspector_fio,
          inspector_position,
          department,
          location,
          checked_object
        `)
        .eq('org_id', orgId)
        .gte('created_at', fromDate.toISOString())
        .lte('created_at', toDate.toISOString());

      if (error) throw error;

      const now = new Date();
      let filtered: Observation[] = [];

      switch (type) {
        case 'all':
          filtered = observations || [];
          setDialogTitle('Все наблюдения');
          break;
        case 'resolved':
          filtered = observations?.filter(o => o.status === 'resolved') || [];
          setDialogTitle('Устраненные наблюдения');
          break;
        case 'in_progress':
          filtered = observations?.filter(o => {
            const deadlineDate = new Date(o.deadline);
            return (o.status === 'in_progress' || o.status === 'new') && deadlineDate >= now;
          }) || [];
          setDialogTitle('Наблюдения в работе');
          break;
        case 'overdue':
          filtered = observations?.filter(o => {
            const deadlineDate = new Date(o.deadline);
            return (o.status === 'in_progress' || o.status === 'new') && deadlineDate < now;
          }) || [];
          setDialogTitle('Просроченные наблюдения');
          break;
      }

      setSelectedObservations(filtered);
      setDialogOpen(true);
    } catch (error) {
      console.error('Error loading observations:', error);
      toast.error('Ошибка загрузки списка наблюдений');
    }
  };

  const handleObservationClick = async (obs: Observation) => {
    try {
      const { data: observationData, error } = await supabase
        .from('pab_observations')
        .select('*')
        .eq('id', obs.id)
        .single();

      if (error) throw error;

      const htmlContent = generatePabHtml({
        doc_number: obs.doc_number,
        doc_date: obs.doc_date,
        inspector_fio: obs.inspector_fio,
        inspector_position: obs.inspector_position,
        department: obs.department,
        location: obs.location,
        checked_object: obs.checked_object,
        observations: [{
          observation_number: obs.observation_number,
          description: observationData.description,
          category: observationData.category || '',
          conditions_actions: observationData.conditions_actions || '',
          hazard_factors: observationData.hazard_factors || '',
          measures: observationData.measures || '',
          responsible_person: observationData.responsible_person,
          deadline: observationData.deadline,
          photo_base64: observationData.photo_base64,
        }],
      });

      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(htmlContent);
        newWindow.document.close();
      }
    } catch (error) {
      console.error('Error opening observation:', error);
      toast.error('Ошибка открытия наблюдения');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="border-yellow-600/50 text-yellow-500 hover:bg-yellow-600/10"
          >
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Назад
          </Button>
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 rounded-xl shadow-lg">
              <Icon name="TrendingUp" size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Мои показатели</h1>
          </div>
        </div>

        <Card className="bg-slate-800/50 border-yellow-600/30 p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Период</h3>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm text-slate-300 block mb-2">С</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm text-slate-300 block mb-2">По</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2"
              />
            </div>
            <Button
              onClick={() => loadMetrics(dateFrom, dateTo)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              <Icon name="Search" size={20} className="mr-2" />
              Обновить
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-slate-800/50 border-yellow-600/30 p-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 p-4 rounded-xl">
                <Icon name="FileText" size={32} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Всего аудитов</p>
                <p className="text-3xl font-bold text-yellow-500">{metrics.totalAudits}</p>
              </div>
            </div>
          </Card>

          <Card
            onClick={() => handleMetricClick('all')}
            className="bg-slate-800/50 border-yellow-600/30 p-6 cursor-pointer hover:border-yellow-600 transition-all hover:scale-105"
          >
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-amber-700 to-amber-800 p-4 rounded-xl">
                <Icon name="AlertTriangle" size={32} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Всего выявлено</p>
                <p className="text-3xl font-bold" style={{ color: '#8B4513' }}>{metrics.totalObservations}</p>
              </div>
            </div>
          </Card>

          <Card
            onClick={() => handleMetricClick('resolved')}
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
            onClick={() => handleMetricClick('in_progress')}
            className="bg-slate-800/50 border-yellow-600/30 p-6 cursor-pointer hover:border-yellow-600 transition-all hover:scale-105"
          >
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-4 rounded-xl">
                <Icon name="Clock" size={32} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-400">В работе</p>
                <p className="text-3xl font-bold text-black">{metrics.inProgress}</p>
              </div>
            </div>
          </Card>

          <Card
            onClick={() => handleMetricClick('overdue')}
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
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-slate-800 border-yellow-600/30 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-yellow-500">{dialogTitle}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {selectedObservations.length === 0 ? (
              <p className="text-slate-400 text-center py-8">Наблюдения не найдены</p>
            ) : (
              selectedObservations.map((obs) => {
                const deadlineDate = new Date(obs.deadline);
                const now = new Date();
                const isOverdue = deadlineDate < now && obs.status !== 'resolved';

                return (
                  <Card
                    key={obs.id}
                    onClick={() => handleObservationClick(obs)}
                    className={`p-4 cursor-pointer hover:scale-[1.02] transition-all ${
                      isOverdue
                        ? 'bg-red-900/20 border-red-600 animate-pulse'
                        : obs.status === 'resolved'
                        ? 'bg-green-900/20 border-green-600'
                        : 'bg-slate-700/50 border-slate-600'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4
                          className={`font-bold text-lg mb-2 ${
                            isOverdue
                              ? 'text-red-500'
                              : obs.status === 'resolved'
                              ? 'text-green-500'
                              : obs.status === 'in_progress'
                              ? 'text-black'
                              : 'text-amber-700'
                          }`}
                        >
                          {obs.doc_number} - Наблюдение №{obs.observation_number}
                        </h4>
                        <p className="text-slate-300 mb-2">{obs.description}</p>
                        <div className="flex gap-4 text-sm text-slate-400">
                          <span>Ответственный: {obs.responsible_person}</span>
                          <span>Срок: {new Date(obs.deadline).toLocaleDateString('ru-RU')}</span>
                        </div>
                      </div>
                      <Icon name="ExternalLink" size={20} className="text-yellow-500" />
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyMetricsPage;
