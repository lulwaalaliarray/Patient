import { useState, useCallback } from 'react';

export const useNotesExpansion = (initialState: boolean = false) => {
  const [isExpanded, setIsExpanded] = useState(initialState);

  const toggleExpansion = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const expand = useCallback(() => {
    setIsExpanded(true);
  }, []);

  const collapse = useCallback(() => {
    setIsExpanded(false);
  }, []);

  return {
    isExpanded,
    toggleExpansion,
    expand,
    collapse
  };
};