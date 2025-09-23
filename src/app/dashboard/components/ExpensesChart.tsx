import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ExpensesChart() {
  const data = {
    labels: ["Moradia", "Alimentação", "Lazer", "Transporte"],
    datasets: [
      {
        label: "Despesas",
        data: [1200, 800, 600, 600],
        backgroundColor: ["#34D399", "#60A5FA", "#FBBF24", "#F87171"],
        hoverOffset: 10,
      },
    ],
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Distribuição de Despesas</h2>
      <Pie data={data} />
    </div>
  );
}
