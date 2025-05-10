import React, { createContext, useContext, useState } from 'react';

interface FamilyCodeContextType {
  familyCode: string;
  setFamilyCode: (code: string) => void;
  password: string;
  setPassword: (password: string) => void;
  securityQuestion: string;
  setSecurityQuestion: (question: string) => void;
  securityAnswer: string;
  setSecurityAnswer: (answer: string) => void;
  generateFamilyCode: () => string;
}

const FamilyCodeContext = createContext<FamilyCodeContextType | undefined>(undefined);

export const FamilyCodeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [familyCode, setFamilyCode] = useState('');
  const [password, setPassword] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');

  const generateFamilyCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setFamilyCode(code);
    return code;
  };

  return (
    <FamilyCodeContext.Provider 
      value={{
        familyCode,
        setFamilyCode,
        password,
        setPassword,
        securityQuestion,
        setSecurityQuestion,
        securityAnswer,
        setSecurityAnswer,
        generateFamilyCode
      }}
    >
      {children}
    </FamilyCodeContext.Provider>
  );
};

export const useFamilyCode = () => {
  const context = useContext(FamilyCodeContext);
  if (context === undefined) {
    throw new Error('useFamilyCode must be used within a FamilyCodeProvider');
  }
  return context;
};