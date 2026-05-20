export interface ValidationRules {
  [key: string]: (value: string) => boolean | string;
}

export function useFormValidation(rules: ValidationRules = {}) {
  const defaultRules: ValidationRules = {
    email: (value) => {
      if (!value) return 'Email é obrigatório';
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Email inválido';
    },
    telefone: (value) => {
      if (!value) return 'Telefone é obrigatório';
      const cleaned = value.replace(/\D/g, '');
      return cleaned.length >= 10 && cleaned.length <= 11 || 'Telefone deve ter 10 ou 11 dígitos';
    },
    nome: (value) => {
      if (!value) return 'Nome é obrigatório';
      return value.trim().length >= 3 || 'Nome deve ter pelo menos 3 caracteres';
    },
    endereco: (value) => {
      if (!value) return 'Endereço é obrigatório';
      return value.trim().length >= 10 || 'Endereço incompleto (mínimo 10 caracteres)';
    },
  };

  const mergedRules = { ...defaultRules, ...rules };

  const validate = (field: string, value: string): boolean => {
    const rule = mergedRules[field];
    if (!rule) return true;
    return rule(value) === true;
  };

  const getError = (field: string, value: string): string | null => {
    const rule = mergedRules[field];
    if (!rule) return null;
    const result = rule(value);
    return typeof result === 'string' ? result : null;
  };

  return { validate, getError };
}
