import { ShieldCheck } from 'lucide-react';

const AppHeader = () => {
  return (
    <header className="bg-primary text-primary-foreground p-4 shadow-md">
      <div className="container mx-auto flex items-center space-x-3">
        <ShieldCheck size={36} aria-hidden="true" />
        <h1 className="text-2xl sm:text-3xl font-bold font-headline">SteganoShield</h1>
      </div>
    </header>
  );
};

export default AppHeader;
