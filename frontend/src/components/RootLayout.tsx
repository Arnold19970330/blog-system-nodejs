import React from 'react';
import { Analytics } from '@vercel/analytics/react';

type RootLayoutProps = {
  children: React.ReactNode;
};

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <div className="font-sans antialiased">
      {children}
      <Analytics />
    </div>
  );
};

export default RootLayout;
