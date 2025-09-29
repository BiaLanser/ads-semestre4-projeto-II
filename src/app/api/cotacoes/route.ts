import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Cotação do Dólar
    const dollarRes = await fetch("https://economia.awesomeapi.com.br/json/last/USD-BRL");
    const dollarData = await dollarRes.json();

    // Simulação de Ibovespa (até conectar uma API real)
    const ibovespa = 134521.77;

    return NextResponse.json({
      dolar: parseFloat(dollarData?.USDBRL?.bid || "0"),
      ibovespa,
    });
  } catch {
    return NextResponse.json({ error: "Erro ao buscar cotações" }, { status: 500 });
  }
}
