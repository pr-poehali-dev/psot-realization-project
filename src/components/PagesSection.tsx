import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';

interface Page {
  id: number;
  name: string;
  route: string;
  icon: string;
  description: string;
  enabled: boolean;
}

interface PagesSectionProps {
  pages: Page[];
  onTogglePage: (pageId: number) => void;
}

export const PagesSection = ({ pages, onTogglePage }: PagesSectionProps) => {
  return (
    <Card className="bg-slate-800/50 border-purple-600/30 p-6">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Icon name="FileText" size={24} className="text-purple-400" />
        Доступные страницы
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pages.map((page) => (
          <div
            key={page.id}
            onClick={() => onTogglePage(page.id)}
            className={`p-4 rounded-lg cursor-pointer transition-all ${
              page.enabled
                ? 'bg-gradient-to-br from-blue-600/30 to-indigo-600/30 border border-blue-500'
                : 'bg-slate-700/50 border border-purple-600/30 hover:border-purple-600'
            }`}
          >
            <div className="flex items-start gap-3">
              <Checkbox checked={page.enabled} className="mt-1" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name={page.icon} size={18} className="text-purple-400" />
                  <h4 className="font-semibold text-white">{page.name}</h4>
                </div>
                <p className="text-sm text-gray-400 mb-1">{page.description}</p>
                <code className="text-xs text-gray-500">{page.route}</code>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
