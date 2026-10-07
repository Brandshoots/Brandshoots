import React from 'react';
import { MainNavbar } from '../navbar/MainNavbar';

interface AboutNavbarProps {
  onOpenContact?: () => void;
}

export const AboutNavbar: React.FC<AboutNavbarProps> = ({ onOpenContact }) => {
  return <MainNavbar onOpenContact={onOpenContact} />;
};

export default AboutNavbar;
