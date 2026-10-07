import React from 'react';
import { MainNavbar } from '../navbar/MainNavbar';

interface ContactNavbarProps {
  onScrollToForm?: () => void;
}

export const ContactNavbar: React.FC<ContactNavbarProps> = ({ onScrollToForm }) => {
  return <MainNavbar onOpenContact={onScrollToForm} />;
};

export default ContactNavbar;
