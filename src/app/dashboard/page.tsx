  "use client";

import BalanceCard from "./components/BalanceCard";
import ExpensesChart from "./components/ExpensesChart";
import Alerts from "./components/Alerts";
import CurrencyAPI from "./components/CurrencyAPI";


  export default function DashboardPage() {
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
      </div>
    );
  }
