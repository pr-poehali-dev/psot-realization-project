import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PabFormHeaderProps {
  docNumber: string;
  docDate: string;
  inspectorFio: string;
  inspectorPosition: string;
  location: string;
  checkedObject: string;
  department: string;
  onDocDateChange: (value: string) => void;
  onInspectorFioChange: (value: string) => void;
  onInspectorPositionChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onCheckedObjectChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  isFieldFilled: (value: any) => boolean;
}

export const PabFormHeader = ({
  docNumber,
  docDate,
  inspectorFio,
  inspectorPosition,
  location,
  checkedObject,
  department,
  onDocDateChange,
  onInspectorFioChange,
  onInspectorPositionChange,
  onLocationChange,
  onCheckedObjectChange,
  onDepartmentChange,
  isFieldFilled,
}: PabFormHeaderProps) => {
  return (
    <Card className="bg-slate-800/50 border-yellow-600/30 p-6">
      <h2 className="text-2xl font-bold text-yellow-500 mb-6">Общая информация</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="text-slate-300">Номер документа</Label>
          <Input
            value={docNumber}
            disabled
            className="bg-slate-700/50 border-slate-600 text-white"
          />
        </div>
        <div>
          <Label className="text-slate-300">Дата *</Label>
          <Input
            type="date"
            value={docDate}
            onChange={(e) => onDocDateChange(e.target.value)}
            className={`bg-slate-700 border-slate-600 text-white ${!isFieldFilled(docDate) ? 'border-red-500' : ''}`}
          />
        </div>
        <div>
          <Label className="text-slate-300">ФИО проверяющего *</Label>
          <Input
            value={inspectorFio}
            onChange={(e) => onInspectorFioChange(e.target.value)}
            className={`bg-slate-700 border-slate-600 text-white ${!isFieldFilled(inspectorFio) ? 'border-red-500' : ''}`}
          />
        </div>
        <div>
          <Label className="text-slate-300">Должность проверяющего *</Label>
          <Input
            value={inspectorPosition}
            onChange={(e) => onInspectorPositionChange(e.target.value)}
            className={`bg-slate-700 border-slate-600 text-white ${!isFieldFilled(inspectorPosition) ? 'border-red-500' : ''}`}
          />
        </div>
        <div>
          <Label className="text-slate-300">Подразделение *</Label>
          <Input
            value={department}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className={`bg-slate-700 border-slate-600 text-white ${!isFieldFilled(department) ? 'border-red-500' : ''}`}
          />
        </div>
        <div>
          <Label className="text-slate-300">Местонахождение *</Label>
          <Input
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            className={`bg-slate-700 border-slate-600 text-white ${!isFieldFilled(location) ? 'border-red-500' : ''}`}
          />
        </div>
        <div className="md:col-span-2">
          <Label className="text-slate-300">Проверяемый объект *</Label>
          <Input
            value={checkedObject}
            onChange={(e) => onCheckedObjectChange(e.target.value)}
            className={`bg-slate-700 border-slate-600 text-white ${!isFieldFilled(checkedObject) ? 'border-red-500' : ''}`}
          />
        </div>
      </div>
    </Card>
  );
};
