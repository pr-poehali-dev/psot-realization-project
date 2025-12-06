import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const Register = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [organizationName, setOrganizationName] = useState<string | null>(null);
  const [verifyingCode, setVerifyingCode] = useState(false);

  useEffect(() => {
    const urlCode = searchParams.get('code');
    if (urlCode) {
      setCode(urlCode);
      verifyCode(urlCode);
    }
  }, [searchParams]);

  const verifyCode = async (codeValue: string) => {
    if (!codeValue || codeValue.length < 6) return;
    
    setVerifyingCode(true);
    try {
      const response = await fetch(
        `https://functions.poehali.dev/eb523ac0-0903-4780-8f5d-7e0546c1eda5?action=verify_code&code=${encodeURIComponent(codeValue)}`
      );
      const data = await response.json();
      
      if (data.success) {
        setOrganizationName(data.organizationName);
        toast.success(`Код подтверждён: ${data.organizationName}`);
      } else {
        setOrganizationName(null);
      }
    } catch (error) {
      console.error('Code verification error:', error);
      setOrganizationName(null);
    } finally {
      setVerifyingCode(false);
    }
  };

  const handleCodeChange = (value: string) => {
    const upperValue = value.toUpperCase();
    setCode(upperValue);
    
    if (upperValue.length >= 6) {
      verifyCode(upperValue);
    } else {
      setOrganizationName(null);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code) {
      toast.error('Код приглашения обязателен');
      return;
    }

    if (!email || !password || !fullName) {
      toast.error('Заполните все поля');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Пароли не совпадают');
      return;
    }

    if (password.length < 6) {
      toast.error('Пароль должен быть минимум 6 символов');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/eb523ac0-0903-4780-8f5d-7e0546c1eda5', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'register',
          code,
          email,
          password,
          full_name: fullName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Регистрация успешна! Выполняем вход...');
        
        // Автоматический вход после регистрации
        const loginResponse = await fetch('https://functions.poehali.dev/eb523ac0-0903-4780-8f5d-7e0546c1eda5', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'login',
            email,
            password,
          }),
        });

        const loginData = await loginResponse.json();

        if (loginResponse.ok && loginData.success) {
          // Сохраняем данные пользователя
          localStorage.setItem('userId', loginData.userId);
          localStorage.setItem('userFio', loginData.fio);
          localStorage.setItem('userCompany', loginData.company);
          localStorage.setItem('userPosition', loginData.position);
          localStorage.setItem('userRole', loginData.role);
          if (loginData.organizationId) {
            localStorage.setItem('organizationId', loginData.organizationId);
          }
          
          // Перенаправляем на дашборд
          navigate('/dashboard');
        } else {
          // Если автоматический вход не удался, перенаправляем на страницу входа
          toast.success('Регистрация успешна! Войдите в систему');
          navigate('/');
        }
      } else {
        toast.error(data.error || 'Ошибка регистрации');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Ошибка подключения к серверу');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Регистрация</CardTitle>
          <CardDescription className="text-center">
            {organizationName ? (
              <span className="text-blue-600 font-medium">Регистрация в организацию: {organizationName}</span>
            ) : (
              'Создайте аккаунт по коду приглашения'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Код приглашения</Label>
              <Input
                id="code"
                type="text"
                placeholder="XXXXXXXX"
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                disabled={loading}
                required
              />
              {verifyingCode && (
                <p className="text-sm text-gray-500 mt-1">Проверка кода...</p>
              )}
              {organizationName && (
                <p className="text-sm text-green-600 font-medium mt-1">✓ {organizationName}</p>
              )}
              {code.length >= 6 && !verifyingCode && !organizationName && (
                <p className="text-sm text-red-600 mt-1">Неверный код приглашения</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">ФИО</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Иванов Иван Иванович"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="ivanov@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="Минимум 6 символов"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Повторите пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>

            <div className="text-center text-sm text-gray-600">
              Уже есть аккаунт?{' '}
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-blue-600 hover:underline"
              >
                Войти
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;