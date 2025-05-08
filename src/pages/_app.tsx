import React from 'react';
import type { AppProps } from 'next/app';
import { motion } from 'framer-motion';
import '../styles/globals.css';
import { UserProvider } from '../contexts/UserContext';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <UserProvider>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Component {...pageProps} />
      </motion.div>
    </UserProvider>
  );
};

export default MyApp;
