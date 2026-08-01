import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Car, Mail, Lock, ShieldCheck, Gauge, Users2 } from 'lucide-react';
import useAuth from '../hooks/useAuth.js';
import { login as loginRequest } from '../services/auth.service.js';
import { EMAIL_PATTERN } from '../utils/validators.js';
import FormField from '../components/FormField.jsx';
import Button from '../components/ui/Button.jsx';

const HIGHLIGHTS = [
  { icon: Gauge, text: 'Real-time inventory, sales & service visibility' },
  { icon: Users2, text: 'Role-based workspaces for every team' },
  { icon: ShieldCheck, text: 'Secure, permission-aware access control' }
];

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValidationError('');
    setServerError('');

    if (!email.trim() || !password) {
      setValidationError('Email and password are both required.');
      return;
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      const token = await loginRequest(email.trim(), password);
      login(token);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const message = error.response?.data?.message;
      setServerError(message || 'Unable to log in right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl lg:grid-cols-2">
        {/* Brand panel */}
        <div className="relative hidden flex-col justify-between bg-slate-900 p-10 text-white lg:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-slate-900 to-slate-900" />
          <div className="relative">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
                <Car className="h-5 w-5" strokeWidth={2.25} />
              </span>
              <span className="text-lg font-bold">DriveSync</span>
            </div>
            <h2 className="mt-10 text-2xl font-bold leading-snug">
              The complete platform for modern dealership operations.
            </h2>
            <p className="mt-3 text-sm text-slate-300">
              Manage vehicles, customers, sales, service and inventory — all in one place.
            </p>
          </div>
          <ul className="relative space-y-4">
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-slate-200">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Icon className="h-4 w-4" strokeWidth={2} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* Form panel */}
        <div className="p-8 sm:p-10">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Car className="h-5 w-5" strokeWidth={2.25} />
            </span>
            <span className="text-lg font-bold text-slate-900">DriveSync</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500">Log in to access your dashboard.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
            <FormField
              label="Email"
              id="email"
              type="email"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
            />

            <FormField
              label="Password"
              id="password"
              type="password"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
            />

            {validationError && <p className="text-sm text-red-600">{validationError}</p>}
            {serverError && <p className="text-sm text-red-600">{serverError}</p>}

            <Button type="submit" disabled={submitting} className="w-full" size="lg">
              {submitting ? 'Logging in…' : 'Log In'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
