import AppHeader from '@/components/AppHeader';
import SteganoShieldAppClient from '@/components/SteganoShieldAppClient';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <AppHeader />
      <main className="flex-grow container mx-auto p-4 sm:p-6 md:p-8">
        <SteganoShieldAppClient />
      </main>
      <footer className="text-center p-4 text-muted-foreground text-sm border-t">
        SteganoShield &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
