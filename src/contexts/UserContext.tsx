import React, { createContext, useState, useContext, ReactNode } from 'react';

interface UserContextType {
  userName: string | null;
  setUserName: (name: string) => void;
  userType: 'mother' | 'partner' | null;
  setUserType: (type: 'mother' | 'partner') => void;
}

const UserContext = createContext<UserContextType>({
  userName: null,
  setUserName: () => {},
  userType: null,
  setUserType: () => {}
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userName, setUserName] = useState<string | null>(null);
  const [userType, setUserType] = useState<'mother' | 'partner' | null>(null);

  return (
    <UserContext.Provider value={{ 
      userName, 
      setUserName, 
      userType, 
      setUserType 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
