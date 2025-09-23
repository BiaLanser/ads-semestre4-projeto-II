"use client";
import { useState } from "react";
import Input from "../../../components/ui/Input";
import Button from "@components/ui/Button";

export default function SignupPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log({ nome, email, cpf, senha });
    alert("Cadastro mock realizado!");
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Cadastro</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        <Input label="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="CPF" value={cpf} onChange={(e) => setCpf(e.target.value)} />
        <Input
          label="Senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <Button type="submit">Cadastrar</Button>
      </form>
    </div>
  );
}
