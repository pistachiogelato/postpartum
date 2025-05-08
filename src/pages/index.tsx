import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useUser } from '@/contexts/UserContext';
import Questionnaire from '@/components/Questionnaire';

type Stage = 'name' | 'type' | 'questionnaire';

const encouragementMessages = [
  "Every journey begins with a single step 🌱",
  "You're doing amazing already! 💖",
  "Your well-being matters most 🌈"
];

export default function Home() {
  const { userName, setUserName, userType, setUserType } = useUser();
  const [stage, setStage] = useState<Stage>('name');
  const { register, handleSubmit, formState: { errors } } = useForm<{ name: string }>();

  const onNameSubmit: SubmitHandler<{ name: string }> = (data) => {
    setUserName(data.name);
    setStage('type');
  };

  const selectUserType = (type: 'mother' | 'partner') => {
    setUserType(type);
    setStage('questionnaire');
  };

  const getEncouragementMessage = () => {
    return encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
  };

  return (
    <main className="min-h-screen bg-warm-cream flex items-center justify-center p-4">
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
          maxWidth: '500px', // 限制最大宽度
          margin: '0 auto'
        }}
      >
        <AnimatePresence mode="wait">
          {stage === 'name' && (
            <motion.div 
              key="name-stage"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-3xl mb-6 text-felted-brown font-medium text-center">Hi, what's your name?</h2>
              <form onSubmit={handleSubmit(onNameSubmit)} className="space-y-6">
                <input 
                  {...register('name', { required: 'Name is required', minLength: 2 })}
                  placeholder="Enter your name"
                  className="w-full p-3 border-2 border-warm-peach rounded-lg focus:ring-2 focus:ring-warm-peach text-lg"
                  style={{ backgroundColor: 'white' }}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message as string}</p>}
                <button 
                  type="submit" 
                  className="w-full bg-warm-peach p-3 rounded-lg hover:bg-opacity-90 transition text-felted-brown font-medium text-lg"
                >
                  Continue
                </button>
              </form>
            </motion.div>
          )}

          {stage === 'type' && (
            <motion.div 
              key="type-stage"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-3xl mb-4 text-felted-brown font-medium text-center">Welcome, {userName}!</h2>
              <p className="mb-6 text-warm-peach text-center text-lg">{getEncouragementMessage()}</p>
              <p className="mb-4 text-felted-brown text-center">I am a:</p>
              <div className="grid grid-cols-2 gap-6">
                <button 
                  onClick={() => selectUserType('mother')}
                  className="bg-warm-peach p-6 rounded-lg hover:scale-105 transition flex flex-col items-center"
                >
                  <span className="text-3xl mb-2">👩‍🍼</span>
                  <span className="font-medium">Mother</span>
                </button>
                <button 
                  onClick={() => selectUserType('partner')}
                  className="bg-warm-peach p-6 rounded-lg hover:scale-105 transition flex flex-col items-center"
                >
                  <span className="text-3xl mb-2">👨‍👩‍👧</span>
                  <span className="font-medium">Partner</span>
                </button>
              </div>
            </motion.div>
          )}

          {stage === 'questionnaire' && userType && (
            <motion.div 
              key="questionnaire-stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ 
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 100
              }}
            >
              <Questionnaire type={userType} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}


