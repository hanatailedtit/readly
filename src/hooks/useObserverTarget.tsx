import { ReactNode, useEffect, useRef } from 'react';

type ObserverTargetParams = {
  children?: ReactNode;
  options?: IntersectionObserverInit;
  callback: () => void;
};

export const useObserverTarget = ({
  children,
  options,
  callback,
}: ObserverTargetParams) => {
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!targetRef.current) return;

    const intersectionObserver = new IntersectionObserver((entries) => {
      if (!entries[0] || entries[0].intersectionRatio <= 0) return;

      callback();
    }, options);

    intersectionObserver.observe(targetRef.current);
    return () => intersectionObserver.disconnect();
  }, [callback, options]);

  const observerTarget = () => {
    return <div ref={targetRef}>{children}</div>;
  };

  return { targetRef, observerTarget };
};
