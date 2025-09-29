"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { useTransactions } from "@/context/TransactionsContext";

export type Transaction = {
  id?: string;
  tipo: "despesa" | "receita";
  descricao: string;
  valor: number;
  data: string; // "YYYY-MM-DD"
  categoria: string;
  status?: "Pendente" | "Pago";
  recorrencia?: "fixa" | "variavel";
};

type Props = {
  selected?: Transaction | null;
  onSaved?: () => void;
  onCancelEdit?: () => void;
};

export default function TransactionForm({ selected, onSaved, onCancelEdit }: Props) {
  const { reload } = useTransactions();

  const initial = {
    tipo: "despesa" as "despesa" | "receita",
    descricao: "",
    valor: "",
    data: "",
    categoria: "",
    status: "Pendente" as "Pendente" | "Pago",
    recorrencia: "variavel" as "fixa" | "variavel",
  };

  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selected) {
      setForm({
        tipo: selected.tipo,
        descricao: selected.descricao,
        valor: String(selected.valor ?? ""),
        data: selected.data ?? "",
        categoria: selected.categoria ?? "",
        status: (selected.status as "Pendente" | "Pago") ?? "Pendente",
        recorrencia: (selected.recorrencia as "fixa" | "variavel") ?? "variavel",
      });
    } else {
      setForm(initial);
    }
  }, [selected]);

  function change<K extends keyof typeof form>(k: K, v: typeof form[K]) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.descricao.trim() || !form.valor || !form.data || !form.categoria.trim()) {
      alert("Preencha: descrição, valor, data e categoria.");
      return;
    }

    const payload: any = {
      tipo: form.tipo,
      descricao: form.descricao.trim(),
      valor: Number(form.valor),
      data: form.data,
      categoria: form.categoria.trim(),
      recorrencia: form.recorrencia,
    };

    if (form.tipo === "despesa") payload.status = form.status;

    setLoading(true);
    try {
      if (selected && selected.id) {
        await updateDoc(doc(db, "transacoes", selected.id), {
          ...payload,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "transacoes"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
      }

      setForm(initial);
      onSaved?.();
      reload(); // Atualiza dashboard automaticamente
    } catch (err) {
      console.error("Erro salvar transação:", err);
      alert("Erro ao salvar transação. Veja console.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 rounded shadow-sm space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <select value={form.tipo} onChange={(e) => change("tipo", e.target.value as any)} className="p-2 border rounded">
          <option value="despesa">Despesa</option>
          <option value="receita">Receita</option>
        </select>

        <select value={form.recorrencia} onChange={(e) => change("recorrencia", e.target.value as any)} className="p-2 border rounded">
          <option value="variavel">Variável</option>
          <option value="fixa">Fixa</option>
        </select>
      </div>

      <input className="w-full p-2 border rounded" placeholder="Descrição" value={form.descricao} onChange={(e) => change("descricao", e.target.value)} />

      <div className="grid grid-cols-3 gap-2">
        <input className="p-2 border rounded" placeholder="Valor" type="number" step="0.01" value={form.valor} onChange={(e) => change("valor", e.target.value)} />
        <input className="p-2 border rounded" type="date" value={form.data} onChange={(e) => change("data", e.target.value)} />
        <input className="p-2 border rounded" placeholder="Categoria" value={form.categoria} onChange={(e) => change("categoria", e.target.value)} />
      </div>

      {form.tipo === "despesa" && (
        <select className="w-full p-2 border rounded" value={form.status} onChange={(e) => change("status", e.target.value as any)}>
          <option value="Pendente">Pendente</option>
          <option value="Pago">Pago</option>
        </select>
      )}

      <div className="flex gap-2">
        <button className="bg-teal-600 text-white px-4 py-2 rounded disabled:opacity-60" disabled={loading} type="submit">
          {selected ? "Atualizar" : "Adicionar"}
        </button>
        {selected && (
          <button type="button" onClick={() => { setForm(initial); onCancelEdit?.(); }} className="bg-gray-300 px-4 py-2 rounded">
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
