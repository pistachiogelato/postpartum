import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '../contexts/UserContext';
import { generateFamilyCode } from '../utils/familyCodeGenerator';

const RegisterPage: React.FC = () => {
  const [userName, setUserName] = useState('');
  const [userType, setUserType] = useState<'mother' | 'partner' | null>(null);
  const [familyCode, setFamilyCode] = useState('');
  const [error, setError] = useState('');

  const { setUserName: setContextUserName, setUserType: setContextUserType } = useUser();
  const router = useRouter();

  const handleGenerateFamilyCode = async () => {
    try {
      // Simulate survey results for code generation
      const surveyResults = {
        deviceId: 'unique-device-id', // In real app, use actual device identifier
        userName,
        userType
      };

      const code = await generateFamilyCode(surveyResults);
      setFamilyCode(code);
    } catch (err) {
      setError('Failed to generate family code');
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userName || !userType) {
      setError('Please fill in all fields');
      return;
    }

    try {
      // Validate family code if needed
      if (familyCode) {
        // Implement additional validation if required
        setContextUserName(userName);
        setContextUserType(userType);
        
        // Redirect to dashboard or next step
        router.push('/dashboard');
      } else {
        setError('Please generate a family code first');
      }
    } catch (err) {
      setError('Registration failed');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-warm-cream flex items-center justify-center">
      <div className="felted-background p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-felted text-felted-brown mb-6 text-center">
          Postpartum Support Registration
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-felted-brown">
              Name
            </label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-warm-peach focus:ring focus:ring-warm-peach focus:ring-opacity-50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-felted-brown mb-2">
              User Type
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setUserType('mother')}
                className={`px-4 py-2 rounded-md ${
                  userType === 'mother' 
                    ? 'bg-warm-peach text-white' 
                    : 'bg-white text-felted-brown border border-gray-300'
                }`}
              >
                Mother
              </button>
              <button
                type="button"
                onClick={() => setUserType('partner')}
                className={`px-4 py-2 rounded-md ${
                  userType === 'partner' 
                    ? 'bg-warm-peach text-white' 
                    : 'bg-white text-felted-brown border border-gray-300'
                }`}
              >
                Partner
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-felted-brown mb-2">
              Family Code
            </label>
            {familyCode ? (
              <div className="bg-warm-beige p-3 rounded-md text-center font-bold tracking-wider">
                {familyCode}
              </div>
            ) : (
              <button
                type="button"
                onClick={handleGenerateFamilyCode}
                className="w-full bg-warm-peach text-white py-2 rounded-md hover:bg-opacity-90 transition-colors"
              >
                Generate Family Code
              </button>
            )}
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!familyCode}
            className={`w-full py-2 rounded-md ${
              familyCode 
                ? 'bg-felted-brown text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Complete Registration
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
