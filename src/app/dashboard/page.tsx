"use client";
import { TransactionsProvider } from "@/context/TransactionsContext";
import DashboardContent from "./DashboardContent";

export default function DashboardPage() {
  return (
    <TransactionsProvider>
      <DashboardContent />
    </TransactionsProvider>
  );
}
