import React from 'react';
import { motion } from 'framer-motion';

interface RevealTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  disabled?: boolean;
  as?: 'div' | 'span';
}

export const RevealText: React.FC<RevealTextProps> = ({ children, className = '', delay = 0, disabled = false, as: Tag = 'div' }) => {
  if (disabled) {
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = Tag === 'span' ? motion.span : motion.div;

  return (
    <Tag className={`overflow-hidden ${className}`}>
      <MotionTag
        initial={{ y: "100%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8, delay, ease: [0.76, 0, 0.24, 1] }}
        style={{ display: Tag === 'span' ? 'inline-block' : 'block' }}
      >
        {children}
      </MotionTag>
    </Tag>
  );
};