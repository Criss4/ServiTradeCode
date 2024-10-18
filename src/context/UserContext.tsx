import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';

interface User {
  uid: string;
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userType: string;
  businessName?: string; // Solo para emprendedores
  businessDescription?: string; // Solo para emprendedores
  labor?: string; // Solo para independientes
}

interface UserContextProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
}

// Crear el contexto con valores por defecto
const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Función de cierre de sesión
  const logout = () => {
    setUser(null); // Limpiar el usuario actual
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook para usar el contexto del usuario
export const useUserContext = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext debe ser usado dentro de un UserProvider');
  }
  return context;
};

// Función para mapear un usuario de Firebase al contexto de la app
export const mapFirebaseUserToAppUser = (firebaseUser: FirebaseUser, additionalData: Partial<User>): User => {
  return {
    uid: firebaseUser.uid,
    name: additionalData.name || '',
    lastName: additionalData.lastName || '',
    email: firebaseUser.email || '',
    phoneNumber: additionalData.phoneNumber || '',
    userType: additionalData.userType || '',
    businessName: additionalData.businessName,
    businessDescription: additionalData.businessDescription,
    labor: additionalData.labor,
  };
};
