export default function CurrencyAPI() {
  const dollar = 5.12;
  const ibovespa = 135000;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Cotações</h2>
      <p>Dólar (USD): <span className="font-bold">R$ {dollar}</span></p>
      <p>Ibovespa: <span className="font-bold">{ibovespa}</span></p>
    </div>
  );
}
