import React from 'react';
import type { AppProps } from 'next/app';
import { motion } from 'framer-motion';
import '../styles/globals.css';
import { UserProvider } from '../contexts/UserContext';
import { FamilyCodeProvider } from '@/contexts/FamilyCodeContext';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <UserProvider>
      <FamilyCodeProvider>
        <Component {...pageProps} />
      </FamilyCodeProvider>
    </UserProvider>
  );
};

export default MyApp;
// ... existing code ...
