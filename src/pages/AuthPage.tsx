import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, Sprout } from 'lucide-react';

const AuthPage = () => {
  const { signUp, signIn } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email.trim() || !password.trim()) {
      setError('请填写邮箱和密码');
      return;
    }
    if (password.length < 6) {
      setError('密码至少6位');
      return;
    }

    setLoading(true);
    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) setError(error === 'Invalid login credentials' ? '邮箱或密码错误' : error);
    } else {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error);
      } else {
        setSuccess('注册成功！请检查邮箱验证后登录。');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-leaf-light via-background to-petal-light">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-20 h-20 rounded-full gradient-nature-bg flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Sprout size={40} className="text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">SeedVerse</h1>
        <p className="text-sm text-muted-foreground mt-1">🌱 种子星球 · 植物探索之旅</p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4"
      >
        <div className="card-nature p-6 space-y-4">
          <h2 className="text-lg font-bold text-foreground text-center">
            {isLogin ? '🔑 登录账号' : '✨ 注册账号'}
          </h2>

          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="输入邮箱"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-leaf"
            />
          </div>

          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="输入密码（至少6位）"
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-leaf"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && <p className="text-xs text-destructive text-center">{error}</p>}
          {success && <p className="text-xs text-leaf text-center">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-nature py-3 text-sm font-bold disabled:opacity-50"
          >
            {loading ? '请稍候...' : isLogin ? '登录' : '注册'}
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          {isLogin ? '还没有账号？' : '已有账号？'}
          <button type="button" onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }}
            className="text-leaf font-bold ml-1">
            {isLogin ? '立即注册' : '去登录'}
          </button>
        </p>
      </motion.form>
    </div>
  );
};

export default AuthPage;
