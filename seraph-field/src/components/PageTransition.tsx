import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

type PageTransitionProps = {
  children: ReactNode;
  routeKey: string;
};

export const PageTransition = ({ children, routeKey }: PageTransitionProps) => {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence initial={false} mode="popLayout">
      <motion.div
        animate={{ filter: 'blur(0px)', opacity: 1 }}
        className="page-transition"
        exit={
          reduceMotion
            ? { filter: 'blur(0px)', opacity: 1 }
            : { filter: 'blur(3px)', opacity: 0 }
        }
        initial={
          reduceMotion
            ? { filter: 'blur(0px)', opacity: 1 }
            : { filter: 'blur(3px)', opacity: 0 }
        }
        key={routeKey}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 0.26, ease: 'easeInOut' }
        }
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
