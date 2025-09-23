"use client";
import { useState } from "react";
import Input from "@components/ui/Input";
import Button from "@components/ui/Button";
import { useAuth } from "@context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    login(email, senha);
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Entrar</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input
          label="Senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <Button type="submit">Login</Button>
      </form>
      <p className="mt-4 text-sm text-blue-500 cursor-pointer">Esqueci minha senha</p>
    </div>
  );
}
