"use client"; 
import React, { useState } from "react";
import { auth } from "../../../lib/firebase";
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  GithubAuthProvider 
} from "firebase/auth";

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const loginEmail = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      console.log("Login email ok!");
    } catch (err: any) {
      setErro(err.message);
    }
  };

  const loginGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      console.log("Login Google ok!");
    } catch (err: any) {
      setErro(err.message);
    }
  };

  const loginGithub = async () => {
    try {
      await signInWithPopup(auth, githubProvider);
      console.log("Login GitHub ok!");
    } catch (err: any) {
      setErro(err.message);
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
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
        <h2 style={{marginBottom: "20px"}}>Login</h2>
        <input 
          type="email" 
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "16px"
          }}
        />
        <input 
          type="password" 
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)} 
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "16px"
          }}
        />
        <button 
          onClick={loginEmail} 
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "4px",
            border: "none",
            background: "#0070f3",
            color: "#fff",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          Login com Email
        </button>
        <button 
          onClick={loginGoogle} 
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "4px",
            border: "none",
            background: "#db4437",
            color: "#fff",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          Login com Google
        </button>
        <button 
          onClick={loginGithub} 
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "4px",
            border: "none",
            background: "#333",
            color: "#fff",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          Login com GitHub
        </button>
        {erro && <p style={{color:"red", marginTop:"15px"}}>{erro}</p>}
      </div>
    </div>
  );
}
