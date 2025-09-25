"use client";
import { useEffect, useState } from "react";

export default function CurrencyAPI() {
  const [cotacoes, setCotacoes] = useState<{ dolar: number; ibovespa: number } | null>(null);

  useEffect(() => {
    const fetchCotacoes = async () => {
      try {
        const res = await fetch("/api/cotacoes");
        const data = await res.json();
        setCotacoes(data);
      } catch (err) {
        console.error("Erro ao buscar cotações:", err);
      }
    };

    fetchCotacoes();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Cotações</h2>
      {cotacoes ? (
        <>
          <p>
            Dólar (USD):{" "}
            <span className="font-bold">R$ {cotacoes.dolar.toFixed(2)}</span>
          </p>
          <p>
            Ibovespa:{" "}
            <span className="font-bold">{cotacoes.ibovespa.toLocaleString("pt-BR")}</span>
          </p>
        </>
      ) : (
        <p>Carregando...</p>
      )}
    </div>
  );
}
