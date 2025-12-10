import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'white';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "inline-flex items-center justify-center px-8 py-4 text-xs uppercase tracking-[0.2em] font-medium transition-all duration-500 ease-out border focus:outline-none group relative overflow-hidden cursor-pointer";
  
  const variants = {
    primary: "bg-neutral-900 text-white border-neutral-900 hover:text-neutral-900 hover:bg-white",
    secondary: "bg-transparent text-neutral-900 border-neutral-200 hover:border-neutral-900",
    white: "bg-transparent text-white border-white/30 hover:bg-white hover:text-neutral-900"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`} 
      data-cursor="Click"
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
};