import React, { createContext, useState, useContext, ReactNode } from 'react';

// Tipagem do nosso estado global
interface UserContextType {
  autenticado: boolean;
  setAutenticado: (val: boolean) => void;
  nome: string;
  setNome: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  telefone: string;
  setTelefone: (val: string) => void;
  endereco: string;
  setEndereco: (val: string) => void;
  cep: string;
  setCep: (val: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// O Provedor que vai envolver o nosso aplicativo
export function UserProvider({ children }: { children: ReactNode }) {
  const [autenticado, setAutenticado] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cep, setCep] = useState('');

  return (
    <UserContext.Provider value={{
      autenticado, setAutenticado,
      nome, setNome,
      email, setEmail,
      telefone, setTelefone,
      endereco, setEndereco,
      cep, setCep
    }}>
      {children}
    </UserContext.Provider>
  );
}

// Hook customizado para facilitar o uso do contexto nos componentes
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  return context;
}