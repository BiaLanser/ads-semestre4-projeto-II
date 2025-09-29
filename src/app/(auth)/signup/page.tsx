"use client";
import React, { useState } from "react";
import { auth } from "../../../lib/firebase";
import { sendEmailVerification, updateProfile } from "firebase/auth";

function validarCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;

  return true;
}

export default function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cpf, setCpf] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const handleRegister = async () => {
    setErro("");
    setSucesso("");

    if (!nome || !email || !senha || !cpf) {
      setErro("Preencha todos os campos.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErro("Formato de e-mail inválido.");
      return;
    }
    if (senha.length < 6) {
      setErro("A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    if (!validarCPF(cpf)) {
      setErro("CPF inválido.");
      return;
    }

    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: nome });
        await sendEmailVerification(auth.currentUser);
      }
      setSucesso("Cadastro realizado! Verifique seu e-mail para ativar a conta.");
      setNome(""); setEmail(""); setSenha(""); setCpf("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErro(err.message);
      } else {
        setErro("Erro desconhecido");
      }
    }

  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "#f0f2f5",
      fontFamily: "Arial, sans-serif",
      padding: "20px"
    }}>
      <div style={{
        background: "#fff",
        padding: "30px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "400px",
        textAlign: "center"
      }}>
        <h2 style={{ marginBottom: "20px" }}>Cadastro</h2>
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={{
            width: "100%", padding: "10px", marginBottom: "10px",
            borderRadius: "4px", border: "1px solid #ccc", fontSize: "16px"
          }}
        />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%", padding: "10px", marginBottom: "10px",
            borderRadius: "4px", border: "1px solid #ccc", fontSize: "16px"
          }}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          style={{
            width: "100%", padding: "10px", marginBottom: "10px",
            borderRadius: "4px", border: "1px solid #ccc", fontSize: "16px"
          }}
        />
        <input
          type="text"
          placeholder="CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          style={{
            width: "100%", padding: "10px", marginBottom: "20px",
            borderRadius: "4px", border: "1px solid #ccc", fontSize: "16px"
          }}
        />
        <button
          onClick={handleRegister}
          style={{
            width: "100%", padding: "10px", borderRadius: "4px",
            border: "none", background: "#0070f3", color: "#fff",
            fontSize: "16px", cursor: "pointer"
          }}
        >
          Cadastrar
        </button>
        {erro && <p style={{ color: "red", marginTop: "15px" }}>{erro}</p>}
        {sucesso && <p style={{ color: "green", marginTop: "15px" }}>{sucesso}</p>}
      </div>
    </div>
  );
}
