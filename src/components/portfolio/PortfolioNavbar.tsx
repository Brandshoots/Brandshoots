import React from 'react';
import { MainNavbar } from '../navbar/MainNavbar';

interface PortfolioNavbarProps {
  onOpenContact?: () => void;
}

export const PortfolioNavbar: React.FC<PortfolioNavbarProps> = ({ onOpenContact }) => {
  return <MainNavbar onOpenContact={onOpenContact} />;
};

export default PortfolioNavbar;
