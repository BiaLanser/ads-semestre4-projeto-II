"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { Transaction } from "@/components/transactions/TransactionForm";

type TransactionsContextType = {
  transactions: Transaction[];
  reload: () => void;
  upcomingTransactions: Transaction[]; // NOVO
};

const TransactionsContext = createContext<TransactionsContextType>({
  transactions: [],
  reload: () => {},
  upcomingTransactions: [],
});

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [upcomingTransactions, setUpcomingTransactions] = useState<Transaction[]>([]);

  const loadTransactions = () => {
    const unsub = onSnapshot(collection(db, "transacoes"), (snap) => {
      const lista: Transaction[] = [];
      snap.forEach((d) => {
        const data = d.data() as any;
        let dateString = "";
        if (typeof data.data === "string") dateString = data.data;
        else if (data.data && data.data.toDate) dateString = data.data.toDate().toISOString().slice(0, 10);
        else if (data.createdAt && data.createdAt.toDate) dateString = data.createdAt.toDate().toISOString().slice(0, 10);

        lista.push({
          id: d.id,
          tipo: data.tipo ?? "despesa",
          descricao: data.descricao ?? "",
          valor: Number(data.valor ?? 0),
          data: dateString,
          categoria: data.categoria ?? "",
          status: data.status ?? undefined,
          recorrencia: data.recorrencia ?? "variavel",
        });
      });
      lista.sort((a, b) => (a.data < b.data ? 1 : -1));
      setTransactions(lista);

      // calcular vencimentos próximos
      const hoje = new Date();
      const proximos = lista.filter((t) => {
        const tData = new Date(t.data);
        const diff = (tData.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24);
        return diff >= 0 && diff <= 7; // nos próximos 7 dias
      });
      setUpcomingTransactions(proximos);
    });

    return unsub;
  };

  useEffect(() => {
    const unsub = loadTransactions();
    return () => unsub();
  }, []);

  return (
    <TransactionsContext.Provider value={{ transactions, reload: loadTransactions, upcomingTransactions }}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  return useContext(TransactionsContext);
}
