

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}


export const H1: React.FC<TypographyProps> = ({ children, className = '', as: Component = 'h1' }) => (
  <Component className={`text-3xl md:text-4xl font-bold text-gray-900 dark:text-white ${className}`}>
    {children}
  </Component>
);

export const H2: React.FC<TypographyProps> = ({ children, className = '', as: Component = 'h2' }) => (
  <Component className={`text-2xl md:text-3xl font-bold text-gray-900 dark:text-white ${className}`}>
    {children}
  </Component>
);

export const H3: React.FC<TypographyProps> = ({ children, className = '', as: Component = 'h3' }) => (
  <Component className={`text-xl md:text-2xl font-semibold text-gray-900 dark:text-white ${className}`}>
    {children}
  </Component>
);

export const H4: React.FC<TypographyProps> = ({ children, className = '', as: Component = 'h4' }) => (
  <Component className={`text-lg md:text-xl font-semibold text-gray-900 dark:text-white ${className}`}>
    {children}
  </Component>
);


export const Body: React.FC<TypographyProps> = ({ children, className = '', as: Component = 'p' }) => (
  <Component className={`text-base text-gray-700 dark:text-gray-300 leading-relaxed ${className}`}>
    {children}
  </Component>
);

export const BodySmall: React.FC<TypographyProps> = ({ children, className = '', as: Component = 'p' }) => (
  <Component className={`text-sm text-gray-600 dark:text-gray-400 leading-relaxed ${className}`}>
    {children}
  </Component>
);

export const Caption: React.FC<TypographyProps> = ({ children, className = '', as: Component = 'span' }) => (
  <Component className={`text-xs text-gray-500 dark:text-gray-500 ${className}`}>
    {children}
  </Component>
);


export const Muted: React.FC<TypographyProps> = ({ children, className = '', as: Component = 'span' }) => (
  <Component className={`text-gray-500 dark:text-gray-400 ${className}`}>
    {children}
  </Component>
);

export const Strong: React.FC<TypographyProps> = ({ children, className = '', as: Component = 'strong' }) => (
  <Component className={`font-semibold text-gray-900 dark:text-white ${className}`}>
    {children}
  </Component>
);

export const Link: React.FC<TypographyProps & { href?: string; onClick?: () => void }> = ({ 
  children, 
  className = '', 
  href, 
  onClick,
  as: Component = href ? 'a' : 'button' 
}) => (
  <Component 
    className={`text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline transition-colors ${className}`}
    href={href}
    onClick={onClick}
  >
    {children}
  </Component>
);


export const Section: React.FC<TypographyProps> = ({ children, className = '', as: Component = 'section' }) => (
  <Component className={`space-y-6 ${className}`}>
    {children}
  </Component>
);

export const Container: React.FC<TypographyProps> = ({ children, className = '', as: Component = 'div' }) => (
  <Component className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </Component>
);
