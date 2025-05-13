import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useUser } from '@/contexts/UserContext';

const MainMenu: React.FC = () => {
  const router = useRouter();
  const { userName } = useUser();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        minHeight: '100vh',
        backgroundColor: '#FFF5E1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <motion.div 
        style={{
          backgroundColor: '#F5E9DC',
          padding: '2.5rem',
          borderRadius: '1rem',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '500px'
        }}
      >
        <h2 className="text-3xl mb-6 text-felted-brown font-medium text-center">
          欢迎回来, {userName}!
        </h2>
        
        <div className="grid gap-4">
          <button
            onClick={() => router.push('/daily-challenge')}
            className="bg-warm-peach p-4 rounded-lg hover:scale-105 transition"
          >每日闯关任务</button>
          <button
            onClick={() => router.push('/family-story')}
            className="bg-warm-peach p-4 rounded-lg hover:scale-105 transition"
          >家庭故事集</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MainMenu;