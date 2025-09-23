import "./globals.css";
import { AuthProvider } from "@context/AuthContext";
import Navbar from "@components/shared/Navbar";
import Footer from "@components/shared/Footer";

export const metadata = {
  title: "FinTrack",
  description: "Sua Plataforma Inteligente de Gestão Financeira Pessoal",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-6">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
