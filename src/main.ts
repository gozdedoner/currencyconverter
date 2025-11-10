import "./style.css";
import type { ExchangeRate } from "./types";

class CurrencyConverter {
  private apiUrl = "https://api.exchangerate.host/latest";

  async convert(base: string, target: string, amount: number): Promise<number> {
    try {
      const response = await fetch(
        `${this.apiUrl}?base=${base}&symbols=${target}`
      );
      if (!response.ok) throw new Error("API request failed");
      const data: ExchangeRate = await response.json();
      const rate = data.rates[target];
      return amount * rate;
    } catch (error) {
      console.error("Error:", error);
      return 0;
    }
  }
}

const converter = new CurrencyConverter();
document.getElementById("convert")?.addEventListener("click", async () => {
  const amount = Number(
    (document.getElementById("amount") as HTMLInputElement).value
  );
  const from = (document.getElementById("from") as HTMLSelectElement).value;
  const to = (document.getElementById("to") as HTMLSelectElement).value;
  const result = document.getElementById("result") as HTMLParagraphElement;

  if (!amount) {
    result.textContent = "Please enter an amount";
    return;
  }

  const converted = await converter.convert(from, to, amount);
  result.textContent = `${amount} ${from} = ${converted.toFixed(2)} ${to}`;
});
