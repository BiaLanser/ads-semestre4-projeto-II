"use client";
import { useRouter } from "next/navigation";
import Button from "@/app/components/ui/Button";

export default function LandingPage() {
  const router = useRouter();

  return (
    <section className="text-center py-20">
      <h1 className="text-4xl font-bold mb-4">FinTrack</h1>
      <p className="text-lg text-gray-600 mb-6">
        Controle suas finanças de forma inteligente, registre gastos e visualize insights.
      </p>
      <div className="flex gap-4 justify-center">
        <Button onClick={() => router.push("/signup")}>Cadastrar</Button>
        <Button variant="secondary" onClick={() => router.push("/login")}>
          Entrar
        </Button>
         <Button variant="secondary" onClick={() => router.push("/dashboard")}>
          Dashboard
        </Button>
      </div>
    </section>
  );
}
