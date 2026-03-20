import { Link, useLocation } from 'react-router-dom';
import { Home, Camera, Sprout, Gamepad2, User } from 'lucide-react';

const navItems = [
  { path: '/', icon: Home, label: '首页' },
  { path: '/identify', icon: Camera, label: '识别' },
  { path: '/garden', icon: Sprout, label: '花园' },
  { path: '/games', icon: Gamepad2, label: '游戏' },
  { path: '/profile', icon: User, label: '我的' },
];

const BottomNav = () => {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card rounded-none rounded-t-3xl px-2 py-2 border-t border-leaf/10">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {navItems.map(({ path, icon: Icon, label }) => {
          const active = pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all duration-300 ${
                active ? 'gradient-nature-bg scale-110' : 'hover:bg-leaf-light'
              }`}
            >
              <Icon size={20} className={active ? 'text-primary-foreground' : 'text-muted-foreground'} />
              <span className={`text-[10px] font-bold ${active ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
