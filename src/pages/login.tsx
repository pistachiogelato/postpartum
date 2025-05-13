import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@/contexts/UserContext';
import { useFamilyCode } from '@/contexts/FamilyCodeContext';
import { motion } from 'framer-motion';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { userType, setUserType } = useUser();
  const { familyCode, setFamilyCode, password, setPassword } = useFamilyCode();
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!userType) {
      setError('Please select your role');
      return;
    }
    if (!familyCode) {
      setError('Family code is required');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    router.push('/mainmenu');
  };

  return (
    <div className="min-h-screen bg-warm-cream flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          backgroundColor: '#F5E9DC',
          padding: '2.5rem',
          borderRadius: '1rem',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '500px'
        }}
      >
        <h2 className="text-3xl mb-6 text-felted-brown font-medium text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-felted-brown">Role:</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setUserType('mother')}
                className={`flex-1 py-2 rounded-lg ${userType === 'mother' ? 'bg-warm-peach text-felted-brown' : 'bg-gray-200'}`}
              >Mother</button>
              <button
                type="button"
                onClick={() => setUserType('partner')}
                className={`flex-1 py-2 rounded-lg ${userType === 'partner' ? 'bg-warm-peach text-felted-brown' : 'bg-gray-200'}`}
              >Partner</button>
            </div>
          </div>
          <div>
            <label className="block mb-1 text-felted-brown">Family Code:</label>
            <input
              type="text"
              value={familyCode}
              onChange={e => setFamilyCode(e.target.value)}
              className="w-full p-3 border-2 border-warm-peach rounded-lg focus:ring-2 focus:ring-warm-peach text-lg"
              style={{ backgroundColor: 'white' }}
              placeholder="Enter family code"
            />
          </div>
          <div>
            <label className="block mb-1 text-felted-brown">Password:</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-3 border-2 border-warm-peach rounded-lg focus:ring-2 focus:ring-warm-peach text-lg"
              style={{ backgroundColor: 'white' }}
              placeholder="Enter password"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button 
            type="submit" 
            className="w-full bg-warm-peach p-3 rounded-lg hover:bg-opacity-90 transition text-felted-brown font-medium text-lg"
          >
            Login
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
