"use client";
import { useMemo, useState } from "react";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Transaction } from "./TransactionForm";
import { useTransactions } from "@/context/TransactionsContext";
import { useToast } from "@/context/ToastContext"; // Importa ToastContext

type Props = {
  onEdit?: (t: Transaction) => void;
};

export default function TransactionTable({ onEdit }: Props) {
  const { transactions, reload } = useTransactions();
  const { addToast } = useToast(); // Usa ToastContext

  const [categoriaFilter, setCategoriaFilter] = useState<string>("Todas");
  const [recorrenciaFilter, setRecorrenciaFilter] = useState<string>("Todas");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const categorias = useMemo(() => {
    const s = new Set<string>();
    transactions.forEach((t) => t.categoria && s.add(t.categoria));
    return Array.from(s).sort();
  }, [transactions]);

  function applyFilters(list: Transaction[]) {
    return list.filter((t) => {
      if (categoriaFilter !== "Todas" && t.categoria !== categoriaFilter) return false;
      if (recorrenciaFilter !== "Todas" && t.recorrencia !== recorrenciaFilter) return false;
      if (startDate && t.data < startDate) return false;
      if (endDate && t.data > endDate) return false;
      return true;
    });
  }

  const filtered = applyFilters(transactions);

  async function handleDelete(id?: string) {
    if (!id) return;
    if (!confirm("Confirmar exclusão?")) return;
    try {
      await deleteDoc(doc(db, "transacoes", id));
      reload(); // Atualiza tabela e gráficos
      addToast("Transação excluída com sucesso!", "success"); // TOAST
    } catch (err) {
      console.error(err);
      addToast("Erro ao excluir transação.", "error"); // TOAST
    }
  }

  async function toggleStatus(t: Transaction) {
    if (!t.id) return;
    try {
      await updateDoc(doc(db, "transacoes", t.id), {
        status: t.status === "Pago" ? "Pendente" : "Pago",
      });
      reload();
      addToast(`Status da transação "${t.descricao}" atualizado para "${t.status === "Pago" ? "Pendente" : "Pago"}".`, "success"); // TOAST
    } catch (err) {
      console.error(err);
      addToast("Erro ao atualizar status.", "error"); // TOAST
    }
  }

  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-3 mb-3 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm">Categoria:</label>
          <select value={categoriaFilter} onChange={(e) => setCategoriaFilter(e.target.value)} className="p-2 border rounded">
            <option value="Todas">Todas</option>
            {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm">Recorrência:</label>
          <select value={recorrenciaFilter} onChange={(e) => setRecorrenciaFilter(e.target.value)} className="p-2 border rounded">
            <option value="Todas">Todas</option>
            <option value="fixa">Fixa</option>
            <option value="variavel">Variável</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm">De:</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="p-2 border rounded" />
          <label className="text-sm">Até:</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="p-2 border rounded" />
        </div>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded">
        <table className="w-full table-auto">
          <thead className="bg-gray-100 dark:bg-gray-700 text-left">
            <tr>
              <th className="px-3 py-2">Tipo</th>
              <th className="px-3 py-2">Descrição</th>
              <th className="px-3 py-2">Valor</th>
              <th className="px-3 py-2">Data</th>
              <th className="px-3 py-2">Categoria</th>
              <th className="px-3 py-2">Recorrência</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-3 py-6 text-center text-gray-500">Nenhuma transação</td></tr>
            )}
            {filtered.map((t) => (
              <tr key={t.id} className="border-t dark:border-gray-700">
                <td className="px-3 py-2">{t.tipo}</td>
                <td className="px-3 py-2">{t.descricao}</td>
                <td className="px-3 py-2">R$ {Number(t.valor).toFixed(2)}</td>
                <td className="px-3 py-2">{t.data}</td>
                <td className="px-3 py-2">{t.categoria}</td>
                <td className="px-3 py-2">{t.recorrencia}</td>
                <td className="px-3 py-2">{t.status ?? "-"}</td>
                <td className="px-3 py-2 flex gap-2">
                  {t.tipo === "despesa" && (
                    <button onClick={() => toggleStatus(t)} className="px-2 py-1 rounded bg-yellow-500 text-white text-sm">
                      {t.status === "Pago" ? "Marcar Pendente" : "Marcar Pago"}
                    </button>
                  )}
                  <button onClick={() => onEdit?.(t)} className="px-2 py-1 rounded bg-blue-600 text-white text-sm">Editar</button>
                  <button onClick={() => handleDelete(t.id)} className="px-2 py-1 rounded bg-red-600 text-white text-sm">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
