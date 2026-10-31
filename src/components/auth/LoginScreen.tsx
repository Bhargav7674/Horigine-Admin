import { ArrowUpRight, Building2, LockKeyhole, Mail, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface LoginScreenProps {
  onLogin: (payload: { email: string; password: string }) => Promise<void>;
  loading: boolean;
  error: string;
}

export function LoginScreen({ onLogin, loading, error }: LoginScreenProps) {
  const [email, setEmail] = useState('admin@horigine.com');
  const [password, setPassword] = useState('Horigine@123');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onLogin({ email, password });
  };

  return (
    <div className="login-page">
      <div className="login-art">
        <div className="art-content">
          <div className="eyebrow">
            <Sparkles size={15} />
            SMART HIRING, CLEARER RESULTS
          </div>

          <h1>
            Manage talent
            <br />
            with more clarity.
          </h1>

          <p>
            Centralize hiring, candidate communication, and staffing operations from one secure admin portal.
          </p>

          <div className="login-stats">
            <div>
              <strong>01</strong>
              <span>Hiring hub</span>
            </div>
            <div>
              <strong>360°</strong>
              <span>Insights</span>
            </div>
            <div>
              <strong>∞</strong>
              <span>Opportunity</span>
            </div>
          </div>
        </div>

        <div className="login-foot">© 2026 Horigine Staffing · People first, always.</div>
      </div>

      <div className="login-panel">
        <div className="login-top">
          <span className="secure-label">
            <LockKeyhole size={14} />
            SECURE ADMIN ACCESS
          </span>
          <span className="help-label">
            Need help? <a href="mailto:careers@horigine.com">Contact support</a>
          </span>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="welcome-icon">
            <Building2 size={23} />
          </div>

          <span className="form-kicker">WELCOME BACK</span>
          <h2>Sign in to your workspace</h2>
          <p>Use your secure admin credentials to continue.</p>

          <label htmlFor="email">Email address</label>
          <div className="input-wrap">
            <Mail size={17} />
            <input
              id="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@horigine.com"
              autoComplete="username"
            />
          </div>

          <label htmlFor="password">Password</label>
          <div className="input-wrap">
            <LockKeyhole size={17} />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button className="primary-btn login-btn" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in to admin'}
            <ArrowUpRight size={17} />
          </button>
        </form>

        <div className="login-bottom">
          Protected workspace <span>·</span> Privacy <span>·</span> Terms
        </div>
      </div>
    </div>
  );
}
