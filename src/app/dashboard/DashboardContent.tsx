"use client";
import { useState } from "react";
import BalanceCard from "./components/BalanceCard";
import ExpensesChart from "./components/ExpensesChart";
import Alerts from "./components/Alerts";
import CurrencyAPI from "./components/CurrencyAPI";

import TransactionForm, { Transaction } from "@/components/transactions/TransactionForm";
import TransactionTable from "@/components/transactions/TransactionTable";

export default function DashboardContent() {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  function handleEdit(t: Transaction) {
    setSelectedTransaction(t);
    document.getElementById("transaction-form")?.scrollIntoView({ behavior: "smooth" });
  }

  function handleSaved() {
    setSelectedTransaction(null);
  }

  function handleCancelEdit() {
    setSelectedTransaction(null);
  }

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BalanceCard />
        <ExpensesChart />
        <CurrencyAPI />
      </div>

      <div className="mt-8">
        <Alerts />
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Gerenciar Transações</h2>

        <div id="transaction-form" className="mb-6">
          <TransactionForm selected={selectedTransaction} onSaved={handleSaved} onCancelEdit={handleCancelEdit} />
        </div>

        <TransactionTable onEdit={handleEdit} />
      </div>
    </div>
  );
}
