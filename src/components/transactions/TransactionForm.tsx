"use client";
import { useEffect, useState } from "react";
import { db, auth  } from "@/lib/firebase";
import { collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { useTransactions } from "@/context/TransactionsContext";
import { useToast } from "@/context/ToastContext"; // ✅ import do Toast

type PayloadTransaction = Omit<Transaction, "id" | "valor"> & {
  valor: number;
  userId: string;
};


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

  const initial = {
    tipo: "despesa" as "despesa" | "receita",
    descricao: "",
    valor: "",
    data: "",
    categoria: "",
    status: "Pendente" as "Pendente" | "Pago",
    recorrencia: "variavel" as "fixa" | "variavel",
  };

export default function TransactionForm({ selected, onSaved, onCancelEdit }: Props) {
  const { reload } = useTransactions();
  const { addToast } = useToast(); // ✅ hook do Toast

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
  }, [selected, initial]);

  function change<K extends keyof typeof form>(k: K, v: typeof form[K]) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    const userId = auth.currentUser?.uid;
    if (!userId) return alert("Usuário não logado");

    e.preventDefault();

    if (!form.descricao.trim() || !form.valor || !form.data || !form.categoria.trim()) {
      addToast("Preencha: descrição, valor, data e categoria.", "error"); // ✅ toast de erro
      return;
    }

    const payload: PayloadTransaction  = {
      tipo: form.tipo,
      descricao: form.descricao.trim(),
      valor: Number(form.valor),
      data: form.data,
      categoria: form.categoria.trim(),
      recorrencia: form.recorrencia,
      userId,
    };

    if (form.tipo === "despesa") payload.status = form.status;

    setLoading(true);
    try {
      if (selected && selected.id) {
        await updateDoc(doc(db, "transacoes", selected.id), {
          ...payload,
          updatedAt: serverTimestamp(),
        });
        addToast("Transação atualizada com sucesso!", "success"); // ✅ toast sucesso atualização
      } else {
        await addDoc(collection(db, "transacoes"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        addToast("Transação adicionada com sucesso!", "success"); // ✅ toast sucesso adição
      }

      setForm(initial);
      onSaved?.();
      reload(); // Atualiza dados
    } catch (err) {
      console.error("Erro salvar transação:", err);
      addToast("Erro ao salvar transação. Veja console.", "error"); // ✅ toast erro
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 rounded shadow-sm space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <select value={form.tipo} onChange={(e) => change("tipo", e.target.value as "despesa" | "receita")} className="p-2 border rounded">
          <option value="despesa">Despesa</option>
          <option value="receita">Receita</option>
        </select>

        <select value={form.recorrencia} onChange={(e) => change("recorrencia", e.target.value as "variavel" | "fixa")} className="p-2 border rounded">
          <option value="variavel">Variável</option>
          <option value="fixa">Fixa</option>
        </select>
      </div>

      <input
        className="w-full p-2 border rounded"
        placeholder="Descrição"
        value={form.descricao}
        onChange={(e) => change("descricao", e.target.value)}
      />

      <div className="grid grid-cols-3 gap-2">
        <input
          className="p-2 border rounded"
          placeholder="Valor"
          type="number"
          step="0.01"
          value={form.valor}
          onChange={(e) => change("valor", e.target.value)}
        />

        <input className="p-2 border rounded" type="date" value={form.data} onChange={(e) => change("data", e.target.value)} />

        <input
          className="p-2 border rounded"
          placeholder="Categoria"
          value={form.categoria}
          onChange={(e) => change("categoria", e.target.value)}
        />
      </div>

      {form.tipo === "despesa" && (
        <select className="w-full p-2 border rounded" value={form.status} onChange={(e) => change("status", e.target.value as "Pendente" | "Pago")}>
          <option value="Pendente">Pendente</option>
          <option value="Pago">Pago</option>
        </select>
      )}

      <div className="flex gap-2">
        <button className="bg-teal-600 text-white px-4 py-2 rounded disabled:opacity-60" disabled={loading} type="submit">
          {selected ? "Atualizar" : "Adicionar"}
        </button>
        {selected && (
          <button
            type="button"
            onClick={() => {
              setForm(initial);
              onCancelEdit?.();
            }}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
