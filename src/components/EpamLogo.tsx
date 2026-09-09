import React from 'react';

interface EpamLogoProps {
  className?: string;
  isDark?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const EpamLogo: React.FC<EpamLogoProps> = ({
  className = '',
  isDark = false,
  size = 'md',
}) => {
  const heightClass = size === 'sm' ? 'h-5' : size === 'lg' ? 'h-8' : 'h-6';
  const logoSrc = isDark ? '/epam_logo_white.png' : '/epam_logo_dark.png';

  return (
    <div
      className={`inline-flex items-center select-none transition-opacity hover:opacity-90 ${className}`}
      title="EPAM Systems"
    >
      <img
        src={logoSrc}
        alt="EPAM Systems"
        className={`${heightClass} w-auto object-contain pointer-events-none transition-all duration-150`}
        loading="eager"
      />
    </div>
  );
};
