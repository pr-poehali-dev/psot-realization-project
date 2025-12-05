import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';

interface Module {
  id: number;
  name: string;
  description: string;
  module_type: string;
  enabled: boolean;
}

interface ModulesSectionProps {
  modules: Module[];
  onToggleModule: (moduleId: number) => void;
}

export const ModulesSection = ({ modules, onToggleModule }: ModulesSectionProps) => {
  return (
    <Card className="bg-slate-800/50 border-purple-600/30 p-6">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Icon name="Package" size={24} className="text-purple-400" />
        Доступные модули
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map((module) => (
          <div
            key={module.id}
            onClick={() => onToggleModule(module.id)}
            className={`p-4 rounded-lg cursor-pointer transition-all ${
              module.enabled
                ? 'bg-gradient-to-br from-green-600/30 to-emerald-600/30 border border-green-500'
                : 'bg-slate-700/50 border border-purple-600/30 hover:border-purple-600'
            }`}
          >
            <div className="flex items-start gap-3">
              <Checkbox checked={module.enabled} className="mt-1" />
              <div className="flex-1">
                <h4 className="font-semibold text-white mb-1">{module.name}</h4>
                <p className="text-sm text-gray-400">{module.description}</p>
                <span className="inline-block mt-2 px-2 py-1 bg-purple-600/20 text-purple-300 rounded text-xs">
                  {module.module_type}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
