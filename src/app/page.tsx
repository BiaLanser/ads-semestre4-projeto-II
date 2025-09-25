"use client";
import { useRouter } from "next/navigation";
import Button from "@components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function LandingPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <section className="text-center py-20">
      <h1 className="text-4xl font-bold mb-4">FinTrack</h1>
      <p className="text-lg text-gray-600 mb-6">
        Controle suas finanças de forma inteligente, registre gastos e visualize insights.
      </p>
      <div className="flex gap-4 justify-center">
        {!user && (
          <>
            <Button onClick={() => router.push("/signup")}>Cadastrar</Button>
            <Button variant="secondary" onClick={() => router.push("/login")}>
              Entrar
            </Button>
          </>
        )}

        {user && (
          <>
            <Button onClick={() => router.push("/dashboard")}>Dashboard</Button>
            <Button variant="secondary" onClick={() => router.push("/profile")}>
              Perfil
            </Button>
            <Button variant="secondary" onClick={logout}>
              Sair
            </Button>
          </>
        )}
      </div>
    </section>
  );
}
