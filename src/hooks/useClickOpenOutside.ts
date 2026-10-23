import { RefObject, useCallback, useEffect, useState } from 'react';

type ClickOutsideParams = {
  ref: RefObject<HTMLElement>;
};

export const useClickOpenOutside = ({ ref }: ClickOutsideParams) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClickOutside = useCallback((event: MouseEvent) => {
    const element = event.target as HTMLElement;
    if (ref?.current && !ref.current.contains(element)) {
      setIsOpen(false);
    }
  }, [ref]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, handleClickOutside]);

  return {
    isOpen,
    setIsOpen,
  };
};
