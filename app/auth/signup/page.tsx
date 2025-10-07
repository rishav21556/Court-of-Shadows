'use client';
import { useState } from 'react';
import { useRouter } from "next/navigation";

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [focusedField, setFocusedField] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password is not empty
    if (!username.trim() || !password.trim()) {
      setError('Username and password are required');
      return;
    }

    setIsLoading(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      
      if (!baseUrl) {
        throw new Error('API base URL is not configured');
      }

      const response = await fetch(`${baseUrl}/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: username,
          password: password,
          role: 'player',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      // Show success message
      setSuccess(true);
      
      // Start countdown
      let timeLeft = 5;
      const countdownInterval = setInterval(() => {
        timeLeft -= 1;
        setCountdown(timeLeft);
        
        if (timeLeft === 0) {
          clearInterval(countdownInterval);
          router.push('/auth/login');
        }
      }, 1000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during signup');
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
        <h2 className="text-2xl font-bold mb-8 text-center">Sign Up</h2>
        
        <div className="space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-white px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 border border-green-500/50 text-white px-4 py-3 rounded-md text-sm">
              <p className="font-semibold">Signup successful!</p>
              <p className="mt-1">Redirecting to login page in {countdown} second{countdown !== 1 ? 's' : ''}...</p>
            </div>
          )}

          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setFocusedField('username')}
              onBlur={() => setFocusedField('')}
              disabled={isLoading || success}
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
              disabled={isLoading || success}
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

          <div className="relative">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => setFocusedField('confirmPassword')}
              onBlur={() => setFocusedField('')}
              disabled={isLoading || success}
              className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-md text-white focus:outline-none focus:border-white/60 transition-colors disabled:opacity-50"
            />
            <label
              className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                focusedField === 'confirmPassword' || confirmPassword
                  ? 'top-0 -translate-y-1/2 text-xs bg-[#685c5c] px-2'
                  : 'top-1/2 -translate-y-1/2 text-base'
              }`}
            >
              Confirm Password
            </label>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading || success}
            className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-3 rounded-md transition-colors border border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing up...' : success ? 'Signup Complete!' : 'Sign Up'}
          </button>
          
          <p className="text-center text-sm text-white/70">
            Already have an account? <a href="/auth/login" className="text-white underline">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;