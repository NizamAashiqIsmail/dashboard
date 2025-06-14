'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import styles from './login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    await signIn('credentials', {
      email,
      password,
      callbackUrl: '/dashboard',
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className="text-3xl font-bold text-center mb-4 text-white" >Sign In</h1>
           <hr></hr>
        <p className="text-sm text-center text-gray-400 mb-8">Enter your credentials below</p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded-md bg-slate-800 text-white placeholder-gray-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br></br>
          <br></br>
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded-md bg-slate-800 text-white placeholder-gray-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br></br>
           <br></br>
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium shadow-md transition"
          >
            Sign In
          </button>
        </div>
          <hr></hr>
        <p className="text-center text-xs text-gray-500 mt-6">
          Don’t have an account? Contact your administrator.
        </p>
      </div>
    </div>
  );
}
