export default function BalanceCard() {
  const totalIncome = 5000;
  const totalExpenses = 3200;
  const balance = totalIncome - totalExpenses;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Balanço Geral</h2>
      <p>Receitas: <span className="font-bold">R$ {totalIncome}</span></p>
      <p>Despesas: <span className="font-bold">R$ {totalExpenses}</span></p>
      <p className="mt-2 font-bold">Saldo: R$ {balance}</p>
    </div>
  );
}
