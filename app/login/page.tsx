// This MUST be a client component because it uses interactivity (useState, onSubmit)
'use client'; 

import { useState } from 'react';
import { signIn } from 'next-auth/react'; // This is the magic function!
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] =useState('');
  const [error, setError] = useState('');
  
  const router = useRouter(); // To redirect after login

  // This function will be called when the form is submitted
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setError(''); // Clear any previous errors

    try {
      // 1. Try to sign in using the 'credentials' provider
      const result = await signIn('credentials', {
        // 2. We handle the redirect ourselves
        redirect: false, 
        username: email,
        password: password,
      });

      // 3. Check if the sign-in was successful
      if (result?.ok) {
        // Login was successful!
        // Redirect to a protected page (e.g., a dashboard)
        router.push('/dashboard');
      } else {
        // Login failed. 'result.error' will contain the error message.
        setError('Invalid email or password. Please try again.');
      }

    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        {/* Display an error message if login fails */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}