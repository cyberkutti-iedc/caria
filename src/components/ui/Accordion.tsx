import React, { useState } from "react";

interface AccordionProps {
  children: React.ReactNode;
  type?: string;
  collapsible?: boolean;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({ children, className }) => {
  return <div className={`accordion ${className}`}>{children}</div>;
};

interface AccordionItemProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({ children, className }) => {
  return <div className={`accordion-item ${className}`}>{children}</div>;
};

interface AccordionTriggerProps {
  children: React.ReactNode;
  className?: string;
}

export const AccordionTrigger: React.FC<AccordionTriggerProps> = ({ children, className }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`accordion-trigger ${className}`}
      onClick={() => setIsOpen(!isOpen)}
    >
      {children}
      <span>{isOpen ? "-" : "+"}</span>
    </div>
  );
};

interface AccordionContentProps {
  children: React.ReactNode;
  className?: string;
}

export const AccordionContent: React.FC<AccordionContentProps> = ({ children, className }) => {
  return <div className={`accordion-content ${className}`}>{children}</div>;
};