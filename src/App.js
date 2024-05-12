import { useEffect, useState } from "react";
import "./App.css";

const host = "api.frankfurter.app";

function App() {
  const [fromCurrency, setFromCurrecny] = useState("USD");
  const [toCurrency, setToCurrecny] = useState("EUR");
  const [amount, setAmount] = useState(10);
  const [result, setResult] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  function handleSetFromCurrency(e) {
    setFromCurrecny(e.target.value);
  }
  function handleSetToCurrency(e) {
    setToCurrecny(e.target.value);
  }

  useEffect(
    function () {
      const controller = new AbortController();
      async function convertCurrency() {
        try {
          setIsLoading(true);

          const res = await fetch(
            `https://${host}/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
          );

          console.log(res);

          if (!res) throw Error("Failed to convert");

          const data = await res.json();

          setResult(data.rates[toCurrency]);

          console.log(data.rates[toCurrency]);

          setIsLoading(false);
        } catch (err) {
          setResult(err.message);
        }
      }
      if (fromCurrency === toCurrency) {
        setResult(amount);
        return;
      }
      convertCurrency();

      return function () {
        controller.abort(); // It will abort the current fetch request each time there is a new request.
      };
    },
    [amount, fromCurrency, toCurrency]
  );
  return (
    <div>
      <input
        type="text"
        value={amount}
        onChange={(e) => {
          setAmount(Number(e.target.value));
        }}
        // disabled={isLoading}
      />
      <select
        value={fromCurrency}
        onChange={handleSetFromCurrency}
        // disabled={isLoading}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <select
        value={toCurrency}
        onChange={handleSetToCurrency}
        // disabled={isLoading}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      {isLoading && <Loader />}
      {!isLoading && <p>{result}</p>}
    </div>
  );
}
export default App;

function Loader() {
  return <p>Converting.....</p>;
}
