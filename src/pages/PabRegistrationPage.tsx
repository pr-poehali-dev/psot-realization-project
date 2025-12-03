import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Observation {
  observation_number: number;
  description: string;
  category: string;
  conditions_actions: string;
  hazard_factors: string;
  measures: string;
  responsible_person: string;
  deadline: string;
}

interface Dictionaries {
  categories: Array<{ id: number; name: string }>;
  conditions: Array<{ id: number; name: string }>;
  hazards: Array<{ id: number; name: string }>;
}

export default function PabRegistrationPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dictionaries, setDictionaries] = useState<Dictionaries>({
    categories: [],
    conditions: [],
    hazards: []
  });
  
  const [docNumber, setDocNumber] = useState('');
  const [docDate, setDocDate] = useState(new Date().toISOString().split('T')[0]);
  const [inspectorFio, setInspectorFio] = useState('');
  const [inspectorPosition, setInspectorPosition] = useState('');
  const [location, setLocation] = useState('');
  const [checkedObject, setCheckedObject] = useState('');
  const [department, setDepartment] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [responsibleEmail, setResponsibleEmail] = useState('');
  
  const [observations, setObservations] = useState<Observation[]>([
    {
      observation_number: 1,
      description: '',
      category: '',
      conditions_actions: '',
      hazard_factors: '',
      measures: '',
      responsible_person: '',
      deadline: ''
    }
  ]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Загрузка справочников
      const dictResponse = await fetch('https://functions.poehali.dev/8a3ae143-7ece-49b7-9863-4341c4bef960');
      const dictData = await dictResponse.json();
      setDictionaries(dictData);

      // Генерация номера ПАБ
      const numberResponse = await fetch('https://functions.poehali.dev/c04242d9-b386-407e-bb84-10d219a16e97');
      const numberData = await numberResponse.json();
      setDocNumber(numberData.doc_number);

      // Загрузка данных пользователя
      const userId = localStorage.getItem('userId');
      if (userId) {
        const userResponse = await fetch(`https://functions.poehali.dev/1428a44a-2d14-4e76-86e5-7e660fdfba3f?user_id=${userId}`);
        const userData = await userResponse.json();
        setInspectorFio(userData.fio || '');
        setInspectorPosition(userData.position || '');
        setDepartment(userData.department || '');
      }
    } catch (error) {
      toast.error('Ошибка загрузки данных');
      console.error(error);
    }
  };

  const addObservation = () => {
    if (observations.length < 3) {
      setObservations([...observations, {
        observation_number: observations.length + 1,
        description: '',
        category: '',
        conditions_actions: '',
        hazard_factors: '',
        measures: '',
        responsible_person: '',
        deadline: ''
      }]);
    }
  };

  const updateObservation = (index: number, field: keyof Observation, value: string) => {
    const updated = [...observations];
    updated[index] = { ...updated[index], [field]: value };
    setObservations(updated);
  };

  const handleSubmit = async () => {
    if (!docNumber || !inspectorFio || observations.some(o => !o.description || !o.measures)) {
      toast.error('Заполните все обязательные поля');
      return;
    }

    setLoading(true);

    try {
      let photoUrl = '';
      
      // Загрузка фото, если есть
      if (photoFile) {
        const formData = new FormData();
        formData.append('file', photoFile);
        formData.append('folder_id', 'pab-photos');
        
        const uploadResponse = await fetch('https://functions.poehali.dev/cbbbbc82-61fa-4061-88d0-900cb586aea6', {
          method: 'POST',
          body: formData
        });
        
        const uploadData = await uploadResponse.json();
        photoUrl = uploadData.file_url;
      }

      // Отправка ПАБ
      const response = await fetch('https://functions.poehali.dev/5054985e-ff94-4512-8302-c02f01b09d66', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doc_number: docNumber,
          doc_date: docDate,
          inspector_fio: inspectorFio,
          inspector_position: inspectorPosition,
          department,
          location,
          checked_object: checkedObject,
          photo_url: photoUrl,
          responsible_email: responsibleEmail,
          observations
        })
      });

      if (!response.ok) throw new Error('Ошибка сохранения');

      toast.success('ПАБ успешно зарегистрирован и отправлен');
      navigate('/');
    } catch (error) {
      toast.error('Не удалось сохранить ПАБ');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <Icon name="ArrowLeft" className="mr-2" size={20} />
            Назад
          </Button>
        </div>

        <Card className="p-8 bg-white shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-8">Регистрация ПАБ</h1>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <Label>Название листа</Label>
              <Input value={docNumber} disabled className="bg-gray-50" />
            </div>
            <div>
              <Label>Номер документа</Label>
              <Input value={docNumber} disabled className="bg-gray-50" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <Label>Дата *</Label>
              <Input
                type="date"
                value={docDate}
                onChange={(e) => setDocDate(e.target.value)}
              />
            </div>
            <div>
              <Label>ФИО проверяющего *</Label>
              <Input
                value={inspectorFio}
                onChange={(e) => setInspectorFio(e.target.value)}
                placeholder="УЧЕБНЫЙ"
              />
            </div>
          </div>

          <div className="mb-6">
            <Label>Должность проверяющего *</Label>
            <Input
              value={inspectorPosition}
              onChange={(e) => setInspectorPosition(e.target.value)}
              placeholder="Обучение"
            />
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <Label>Участок *</Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Участок"
              />
            </div>
            <div>
              <Label>Проверяемый объект *</Label>
              <Input
                value={checkedObject}
                onChange={(e) => setCheckedObject(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <Label>Подразделение *</Label>
              <Input
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Напр. ЗИФ"
              />
            </div>
            <div>
              <Label>Фотография нарушения</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>

          {observations.map((obs, index) => (
            <Card key={index} className="p-6 mb-6 bg-blue-50">
              <h2 className="text-xl font-semibold mb-4">
                Наблюдение №{obs.observation_number} *
              </h2>

              <div className="mb-4">
                <Label>Кратко опишите ситуацию...</Label>
                <Textarea
                  value={obs.description}
                  onChange={(e) => updateObservation(index, 'description', e.target.value)}
                  placeholder="Кратко опишите ситуацию..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label className="text-red-600">Категория наблюдений *</Label>
                  <Select
                    value={obs.category}
                    onValueChange={(value) => updateObservation(index, 'category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="-Не выбрано-" />
                    </SelectTrigger>
                    <SelectContent>
                      {dictionaries.categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Вид условий и действий *</Label>
                  <Select
                    value={obs.conditions_actions}
                    onValueChange={(value) => updateObservation(index, 'conditions_actions', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="-Не выбрано-" />
                    </SelectTrigger>
                    <SelectContent>
                      {dictionaries.conditions.map((cond) => (
                        <SelectItem key={cond.id} value={cond.name}>
                          {cond.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mb-4">
                <Label className="text-red-600">Опасные факторы *</Label>
                <Select
                  value={obs.hazard_factors}
                  onValueChange={(value) => updateObservation(index, 'hazard_factors', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="-Не выбрано-" />
                  </SelectTrigger>
                  <SelectContent>
                    {dictionaries.hazards.map((haz) => (
                      <SelectItem key={haz.id} value={haz.name}>
                        {haz.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-4">
                <Label>Мероприятия *</Label>
                <Textarea
                  value={obs.measures}
                  onChange={(e) => updateObservation(index, 'measures', e.target.value)}
                  placeholder="Что нужно сделать..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Ответственный за выполнение *</Label>
                  <Select
                    value={obs.responsible_person}
                    onValueChange={(value) => updateObservation(index, 'responsible_person', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите из списка" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ф.И.О. или оставьте пустым">
                        Ф.И.О. или оставьте пустым
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Срок *</Label>
                  <Input
                    type="date"
                    value={obs.deadline}
                    onChange={(e) => updateObservation(index, 'deadline', e.target.value)}
                  />
                </div>
              </div>
            </Card>
          ))}

          {observations.length < 3 && (
            <Button
              variant="outline"
              onClick={addObservation}
              className="mb-6 w-full"
            >
              Добавить наблюдение {observations.length + 1}
            </Button>
          )}

          <div className="mb-6">
            <Label>Email ответственного</Label>
            <Input
              type="email"
              value={responsibleEmail}
              onChange={(e) => setResponsibleEmail(e.target.value)}
              placeholder="email@example.com"
            />
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate('/')}>
              Назад на главную
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Отправка...' : 'Отправить'}
            </Button>
            <Button variant="outline">
              Скачать в PDF
            </Button>
            <Button variant="outline">
              <Icon name="FileText" className="mr-2" size={16} />
              Скачать в Word
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
