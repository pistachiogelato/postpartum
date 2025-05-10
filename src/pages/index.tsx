import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useUser } from '@/contexts/UserContext';
import { useFamilyCode } from '@/contexts/FamilyCodeContext';
import Questionnaire from '@/components/Questionnaire';

type Stage = 'name' | 'type' | 'questionnaire';

const encouragementMessages = [
  "Every journey begins with a single step 🌱",
  "You're doing amazing already! 💖",
  "Your well-being matters most 🌈"
];

export default function Home() {
  const [error, setError] = useState('');  // 添加这行
  const { userName, setUserName, userType, setUserType } = useUser();
  const { 
    familyCode,
    setFamilyCode,
    password,
    setPassword,
    generateFamilyCode
  } = useFamilyCode();
  const [stage, setStage] = useState<Stage>('name');
  const [showLogin, setShowLogin] = useState(false);
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
      {!showLogin && stage !== 'questionnaire' && (
        <button 
          onClick={() => setShowLogin(true)}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#F5E9DC',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}
        >
          Login
        </button>
      )}
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
    {showLogin && (
        <motion.div 
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
            backgroundColor: 'rgba(255, 245, 235, 0.95)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Login with Family Code</h2>
            
            {/* 添加角色选择 */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Role:</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setUserType('mother')}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: userType === 'mother' ? '#E67300' : '#F5E9DC',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  Mother
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('partner')}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: userType === 'partner' ? '#E67300' : '#F5E9DC',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  Partner
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Family Code:</label>
              <input 
                type="text" 
                value={familyCode}
                onChange={(e) => setFamilyCode(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  border: '1px solid #ddd', 
                  borderRadius: '0.5rem'
                }}
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password:</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  border: '1px solid #ddd', 
                  borderRadius: '0.5rem'
                }}
              />
            </div>
            
            {/* 添加错误提示 */}
            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <button 
              onClick={() => {
                // 直接调用验证逻辑，不使用表单提交
                if (!userType) {
                  setError('Please select your role');
                } else if (!familyCode) {
                  setError('Family code is required');
                } else if (!password) {
                  setError('Password is required');
                } else {
                  // 这里添加实际的登录验证逻辑
                  console.log('Login attempt:', { userType, familyCode, password });
                  
                  // 登录成功后的处理
                  setShowLogin(false);
                  setStage('questionnaire');
                  // 可以添加成功提示
                  alert('Login successful!');
                }
              }}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#E67300',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Login
            </button>
            <button 
              onClick={() => {
                setShowLogin(false);
                setError('');
              }}
              style={{
                marginTop: '1rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: 'transparent',
                color: '#E67300',
                border: '1px solid #E67300',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}
    </main>
  );
}



