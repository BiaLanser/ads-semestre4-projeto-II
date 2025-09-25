"use client";
import { useState, useEffect } from "react";
import { auth } from "../../lib/firebase";
import { updateProfile, signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [nome, setNome] = useState("");
  const router = useRouter();

  // Monitorar usuário logado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuario) => {
      if (usuario) {
        setUser(usuario);
        setNome(usuario.displayName || "");
      } else {
        router.push("/login"); // redireciona se não estiver logado
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Atualizar nome do usuário
  const handleUpdate = async () => {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: nome });
      alert("Perfil atualizado!");
    }
  };

  // Logout
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (!user) return <p>Carregando...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-gray-100">
          Meu Perfil
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nome
          </label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            E-mail
          </label>
          <input
            type="text"
            value={user.email}
            disabled
            className="w-full p-2 border rounded-lg bg-gray-200 dark:bg-gray-600 dark:text-white"
          />
        </div>

        <button
          onClick={handleUpdate}
          className="w-full bg-blue-600 text-white py-2 rounded-lg mb-2"
        >
          Atualizar
        </button>

        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white py-2 rounded-lg"
        >
          Sair
        </button>
      </div>
    </div>
  );
}
