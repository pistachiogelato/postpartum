import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useFamilyCode } from '@/contexts/FamilyCodeContext';
import { motion } from 'framer-motion';

const FamilyCodeSetup: React.FC = () => {
  const router = useRouter();
  const { code } = router.query;
  const [password, setPassword] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [error, setError] = useState('');

  const { setFamilyCode, setPassword: setContextPassword, 
    setSecurityQuestion: setContextSQ, setSecurityAnswer: setContextSA } = useFamilyCode();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !securityQuestion || !securityAnswer) {
      setError('请填写所有字段');
      return;
    }
    
    setFamilyCode(code as string);
    setContextPassword(password);
    setContextSQ(securityQuestion);
    setContextSA(securityAnswer);
    
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
        <h2 className="text-3xl mb-6 text-felted-brown font-medium text-center">Set Up Your Family Code</h2>
        <div className="mb-4 p-3 bg-yellow-100 rounded text-center font-mono text-lg">
          Your Family Code: {code}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-felted-brown">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border-2 border-warm-peach rounded-lg focus:ring-2 focus:ring-warm-peach text-lg"
              style={{ backgroundColor: 'white' }}
              placeholder="Set a password"
            />
          </div>
          <div>
            <label className="block mb-1 text-felted-brown">Security Question:</label>
            <input
              type="text"
              value={securityQuestion}
              onChange={(e) => setSecurityQuestion(e.target.value)}
              className="w-full p-3 border-2 border-warm-peach rounded-lg focus:ring-2 focus:ring-warm-peach text-lg"
              style={{ backgroundColor: 'white' }}
              placeholder="Set a security question"
            />
          </div>
          <div>
            <label className="block mb-1 text-felted-brown">Answer:</label>
            <input
              type="text"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              className="w-full p-3 border-2 border-warm-peach rounded-lg focus:ring-2 focus:ring-warm-peach text-lg"
              style={{ backgroundColor: 'white' }}
              placeholder="Enter your answer"
            />
          </div>
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          
          <button 
            type="submit" 
            className="w-full bg-warm-peach p-3 rounded-lg hover:bg-opacity-90 transition text-felted-brown font-medium text-lg"
          >
            Complete Setup
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default FamilyCodeSetup;