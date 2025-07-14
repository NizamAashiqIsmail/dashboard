'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../login/login.module.css'; // Correct relative path

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    if (password !== confirm) {
      alert('Passwords do not match');
      return;
    }

    const res = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await res.json();
    if (res.ok) {
      alert('Account created successfully');
      router.push('/login'); // Redirect to login
    } else {
      alert(data.error || 'Registration failed');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className="text-3xl font-bold text-center mb-4 text-white">Create Account</h1>
        <hr />
        <p className="text-sm text-center text-gray-400 mb-8">Enter your details below</p>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="User Name"
            className="w-full px-4 py-2 rounded-md bg-slate-800 text-white placeholder-gray-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
<br/>
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded-md bg-slate-800 text-white placeholder-gray-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
<br/>
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full px-4 py-2 rounded-md bg-slate-800 text-white placeholder-gray-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <br />
<br/>
          <button
            onClick={handleRegister}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium shadow-md transition"
          >
            Create Account
          </button>
        </div>

        <hr />
        <p className="text-center text-xs text-gray-500 mt-6">
          Already have an account? <a href="/login" className="underline">Sign In</a>
        </p>
      </div>
    </div>
  );
}
