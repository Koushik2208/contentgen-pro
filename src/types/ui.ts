import React from 'react';

export interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  hover?: boolean;
  className?: string;
}

export interface FilterState {
  searchTerm: string;
  selectedPillar: string;
  selectedTone: string;
}
