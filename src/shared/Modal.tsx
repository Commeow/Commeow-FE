import { motion } from 'framer-motion';
import { ReactNode } from 'react';

type ChildenType = {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  hasOverlay?: boolean;
};

export const Modal = ({
  children,
  isOpen,
  onClose,
  hasOverlay,
}: ChildenType) => (
  <div>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex flex-col justify-center items-center">
        <div
          role="none"
          className={`fixed inset-0 ${
            hasOverlay ? 'bg-black opacity-75' : ''
          } `}
          onClick={() => onClose()}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: [0, 0.71, 0.2, 1.01] }}
          className="fixed"
        >
          {children}
        </motion.div>
      </div>
    )}
  </div>
);
