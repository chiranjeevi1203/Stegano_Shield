import { ShieldCheck } from 'lucide-react';

const AppHeader = () => {
  return (
    <header className="bg-card text-foreground p-4 border-b">
      <div className="container mx-auto flex items-center space-x-3">
        <ShieldCheck size={32} className="text-primary" aria-hidden="true" />
        <h1 className="text-2xl sm:text-3xl font-semibold font-headline">SteganoShield</h1>
      </div>
    </header>
  );
};

export default AppHeader;
