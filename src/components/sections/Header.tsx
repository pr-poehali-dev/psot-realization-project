import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

type NavIconName = 'Home' | 'Info' | 'Newspaper' | 'Briefcase' | 'Gift' | 'FileText' | 'Mail';

interface HeaderProps {
  navigation: Array<{ id: string; label: string; icon: string }>;
  activeSection: string;
  setActiveSection: (id: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  onJoinClick: () => void;
}

export const Header = ({ 
  navigation, 
  activeSection, 
  setActiveSection, 
  mobileMenuOpen, 
  setMobileMenuOpen,
  onJoinClick 
}: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="Users" className="text-primary" size={28} />
          <div>
            <span className="font-heading text-xl font-bold text-primary">Профсоюз</span>
            <p className="text-xs text-muted-foreground hidden md:block">Забота о работниках</p>
          </div>
        </div>
        
        <nav className="hidden lg:flex gap-6">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                activeSection === item.id ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon name={item.icon as NavIconName} size={16} />
              {item.label}
            </button>
          ))}
        </nav>

        <Button 
          variant="default" 
          size="sm" 
          className="hidden md:flex"
          onClick={onJoinClick}
        >
          Вступить в профсоюз
        </Button>

        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Icon name="Menu" size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle className="font-heading flex items-center gap-2">
                <Icon name="Users" className="text-primary" size={24} />
                Профсоюз
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-4 mt-8">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 text-base font-medium transition-colors hover:text-primary ${
                    activeSection === item.id ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <Icon name={item.icon as NavIconName} size={20} />
                  {item.label}
                </button>
              ))}
              <Button 
                variant="default" 
                className="mt-4 w-full"
                onClick={() => {
                  onJoinClick();
                  setMobileMenuOpen(false);
                }}
              >
                Вступить в профсоюз
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};