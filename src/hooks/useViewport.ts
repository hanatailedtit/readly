import { useEffect, useMemo, useState } from 'react';

export const useViewport = () => {
  const [width, setWidth] = useState<number>(0);
  const isSm = useMemo(() => width <= 640, [width]);
  const isMd = useMemo(() => width <= 768, [width]);
  const isLg = useMemo(() => width <= 1024, [width]);
  const isXl = useMemo(() => width <= 1280, [width]);
  const is2Xl = useMemo(() => width <= 1536, [width]);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { width, isSm, isMd, isLg, isXl, is2Xl };
};
