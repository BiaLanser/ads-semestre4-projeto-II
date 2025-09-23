"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="font-bold text-xl">FinTrack</Link>
        <div className="space-x-4">
          <Link href="/login">Entrar</Link>
          <Link href="/signup">Cadastrar</Link>
        </div>
      </div>
    </nav>
  );
}
