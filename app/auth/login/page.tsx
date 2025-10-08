'use client';
import { useState } from 'react';
import { useRouter } from "next/navigation"

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      
      if (!baseUrl) {
        throw new Error('API base URL is not configured');
      }

      const response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      router.push('/');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="text-white min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/auth_background.png')" }}
    >
      <div className="bg-[#685c5c]/50 sm:px-40 px-16 py-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-8 text-center">Login</h2>
        
        <div className="space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-white px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setFocusedField('username')}
              onBlur={() => setFocusedField('')}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-md text-white focus:outline-none focus:border-white/60 transition-colors disabled:opacity-50"
            />
            <label
              className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                focusedField === 'username' || username
                  ? 'top-0 -translate-y-1/2 text-xs bg-[#685c5c] px-2'
                  : 'top-1/2 -translate-y-1/2 text-base'
              }`}
            >
              User Name
            </label>
          </div>

          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField('')}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-md text-white focus:outline-none focus:border-white/60 transition-colors disabled:opacity-50"
            />
            <label
              className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                focusedField === 'password' || password
                  ? 'top-0 -translate-y-1/2 text-xs bg-[#685c5c] px-2'
                  : 'top-1/2 -translate-y-1/2 text-base'
              }`}
            >
              Password
            </label>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-3 rounded-md transition-colors border border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
          
          <p className="text-center text-sm text-white/70">
            Don't have an account? <a href="/auth/signup" className="text-white underline">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;