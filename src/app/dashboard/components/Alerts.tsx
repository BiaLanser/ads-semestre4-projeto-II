export default function Alerts() {
  const alerts = [
    "Conta de luz vence em 3 dias",
    "Aluguel vence em 5 dias",
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Alertas de Vencimentos</h2>
      <ul className="list-disc list-inside text-gray-700 dark:text-gray-200">
        {alerts.map((alert, index) => (
          <li key={index}>{alert}</li>
        ))}
      </ul>
    </div>
  );
}
