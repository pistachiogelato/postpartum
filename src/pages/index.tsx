import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useUser } from '@/contexts/UserContext';

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
          padding: '2rem',
          borderRadius: '0.75rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '28rem'
        }}
      >
        <AnimatePresence mode="wait">
          {stage === 'name' && (
            <motion.div 
              key="name-stage"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
            >
              <h2 className="text-2xl mb-4 text-felted-brown">Hi, what's your name?</h2>
              <form onSubmit={handleSubmit(onNameSubmit)} className="space-y-4">
                <input 
                  {...register('name', { required: 'Name is required', minLength: 2 })}
                  placeholder="Enter your name"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-warm-peach"
                />
                {errors.name && <p className="text-red-500">{errors.name.message as string}</p>}
                <button 
                  type="submit" 
                  className="w-full bg-warm-peach p-2 rounded-lg hover:bg-opacity-90 transition"
                >
                  Continue
                </button>
              </form>
            </motion.div>
          )}

          {stage === 'type' && (
            <motion.div 
              key="type-stage"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
            >
              <h2 className="text-2xl mb-4 text-felted-brown">Welcome, {userName}!</h2>
              <p className="mb-4 text-warm-peach">{getEncouragementMessage()}</p>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => selectUserType('mother')}
                  className="bg-warm-peach p-4 rounded-lg hover:scale-105 transition"
                >
                  👩‍🍼 Mother
                </button>
                <button 
                  onClick={() => selectUserType('partner')}
                  className="bg-warm-peach p-4 rounded-lg hover:scale-105 transition"
                >
                  👨‍👩‍👧 Partner
                </button>
              </div>
            </motion.div>
          )}

          {stage === 'questionnaire' && (
            <motion.div 
              key="questionnaire-stage"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
            >
              {/* Placeholder for Questionnaire component */}
              <h2>Questionnaire for {userType}</h2>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
