"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { Transaction } from "@/components/transactions/TransactionForm";

type FirestoreTransaction = {
  tipo?: "despesa" | "receita";
  descricao?: string;
  valor?: number;
  data?: string | { toDate: () => Date };
  categoria?: string;
  status?: "Pendente" | "Pago";
  recorrencia?: "fixa" | "variavel";
  createdAt?: { toDate: () => Date };
  userId?: string;
};

type TransactionsContextType = {
  transactions: Transaction[];
  reload: () => void;
  upcomingTransactions: Transaction[];
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
    const userId = auth.currentUser?.uid;
    if (!userId) return () => {};

    // só buscar transações do usuário logado
    const q = query(collection(db, "transacoes"), where("userId", "==", userId));

    const unsub = onSnapshot(q, (snap) => {
      const lista: Transaction[] = [];

      snap.forEach((d) => {
        const data = d.data() as FirestoreTransaction;

        // normalizar a data
        let dateString = "";
        if (typeof data.data === "string") {
          dateString = data.data;
        } else if (data.data && "toDate" in data.data) {
          dateString = data.data.toDate().toISOString().slice(0, 10);
        } else if (data.createdAt && "toDate" in data.createdAt) {
          dateString = data.createdAt.toDate().toISOString().slice(0, 10);
        }

        lista.push({
          id: d.id,
          tipo: data.tipo ?? "despesa",
          descricao: data.descricao ?? "",
          valor: Number(data.valor ?? 0),
          data: dateString,
          categoria: data.categoria ?? "",
          status: data.status ?? "Pendente", // garante que não seja undefined
          recorrencia: data.recorrencia ?? "variavel",
        });
      });

      lista.sort((a, b) => (a.data < b.data ? 1 : -1));
      setTransactions(lista);

      // Calcular próximas despesas pendentes
      const hoje = new Date();
      const proximos = lista.filter((t) => {
        if (t.tipo !== "despesa") return false;
        if (t.status === "Pago") return false;

        const tData = new Date(t.data);
        const diff = (tData.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24);
        return diff >= 0 && diff <= 7;
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
    <TransactionsContext.Provider
      value={{ transactions, reload: loadTransactions, upcomingTransactions }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  return useContext(TransactionsContext);
}
