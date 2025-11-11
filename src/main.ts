import "./style.css";

class CurrencyConverter {
  private apiUrl = `https://data.fixer.io/api/latest?access_key=${
    import.meta.env.VITE_API_KEY
  }`;

  async convert(base: string, target: string, amount: number): Promise<number> {
    try {
      const response = await fetch(`${this.apiUrl}&symbols=${base},${target}`);
      if (!response.ok) throw new Error("API request failed");

      const data = await response.json();
      console.log("API Data:", data);

      if (!data.success) throw new Error(data.error?.info || "API error");

      // Fixer free plan: base = EUR
      const baseRate = data.rates[base];
      const targetRate = data.rates[target];
      if (!baseRate || !targetRate)
        throw new Error(`Invalid currency rates for ${base}/${target}`);

      const rate = targetRate / baseRate;
      return amount * rate;
    } catch (error) {
      console.error("Error:", error);

      const result = document.getElementById("result") as HTMLParagraphElement;
      if (result) {
        result.textContent = `Error: ${(error as Error).message}`;
      }
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

  result.textContent = "Converting...";
  const converted = await converter.convert(from, to, amount);

  if (converted > 0) {
    result.textContent = `${amount} ${from} = ${converted.toFixed(2)} ${to}`;
    result.classList.add("visible");

    localStorage.setItem(
      "lastConversion",
      JSON.stringify({
        from,
        to,
        amount,
        converted: converted.toFixed(2),
      })
    );
  }
});

window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("lastConversion");
  if (saved) {
    const { from, to, amount, converted } = JSON.parse(saved);

    (document.getElementById("amount") as HTMLInputElement).value = amount;
    (document.getElementById("from") as HTMLSelectElement).value = from;
    (document.getElementById("to") as HTMLSelectElement).value = to;

    const result = document.getElementById("result") as HTMLParagraphElement;
    result.textContent = `${amount} ${from} = ${converted} ${to}`;
  }
});

const themeButton = document.getElementById(
  "theme-toggle"
) as HTMLButtonElement;
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeButton.textContent = "☀️";
  }
});

themeButton.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-mode");
  themeButton.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});
