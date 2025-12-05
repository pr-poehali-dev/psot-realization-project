import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface PabFormActionsProps {
  onBack: () => void;
  onAddObservation: () => void;
  onSubmit: () => void;
  loading: boolean;
  canAddObservation: boolean;
}

export const PabFormActions = ({
  onBack,
  onAddObservation,
  onSubmit,
  loading,
  canAddObservation,
}: PabFormActionsProps) => {
  return (
    <div className="flex justify-between items-center">
      <Button
        onClick={onBack}
        variant="outline"
        className="border-yellow-600/50 text-yellow-500 hover:bg-yellow-600/10"
      >
        <Icon name="ArrowLeft" size={20} className="mr-2" />
        Назад
      </Button>
      <div className="flex gap-4">
        {canAddObservation && (
          <Button
            onClick={onAddObservation}
            variant="outline"
            className="border-yellow-600/50 text-yellow-500 hover:bg-yellow-600/10"
          >
            <Icon name="Plus" size={20} className="mr-2" />
            Добавить наблюдение
          </Button>
        )}
        <Button
          onClick={onSubmit}
          disabled={loading}
          className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800"
        >
          {loading ? (
            <>
              <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
              Сохранение...
            </>
          ) : (
            <>
              <Icon name="Save" size={20} className="mr-2" />
              Сохранить
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
