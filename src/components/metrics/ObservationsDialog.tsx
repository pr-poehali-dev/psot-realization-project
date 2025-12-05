import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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

interface ObservationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  observations: Observation[];
  onObservationClick: (obs: Observation) => void;
}

export const ObservationsDialog = ({
  open,
  onOpenChange,
  title,
  observations,
  onObservationClick,
}: ObservationsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-yellow-600/30 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-yellow-500">{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {observations.length === 0 ? (
            <p className="text-slate-400 text-center py-8">Наблюдения не найдены</p>
          ) : (
            observations.map((obs) => {
              const deadlineDate = new Date(obs.deadline);
              const now = new Date();
              const isOverdue = deadlineDate < now && obs.status !== 'resolved';

              return (
                <Card
                  key={obs.id}
                  onClick={() => onObservationClick(obs)}
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
                            ? 'text-white'
                            : 'text-amber-700'
                        }`}
                        style={
                          obs.status === 'new' && !isOverdue
                            ? { color: '#8B4513' }
                            : {}
                        }
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
  );
};
