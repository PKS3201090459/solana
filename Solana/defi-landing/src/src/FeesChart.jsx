import React, { useEffect, useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import FeesChart from "./FeesChart";
import "./wallet.css";

function App() {
  const [prices, setPrices] = useState([
    { exchange: "Binance", price: 0, fee: 0 },
    { exchange: "Bybit", price: 0, fee: 0 },
    { exchange: "Kraken", price: 0, fee: 0 },
    { exchange: "Coinbase", price: 0, fee: 0 },
  ]);

  useEffect(() => {
    const socket = new WebSocket("wss://stream.binance.com:9443/ws/solusdt@trade");
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const binancePrice = parseFloat(message.p);
      setPrices((prev) =>
        prev.map((item) =>
          item.exchange === "Binance"
            ? { ...item, price: binancePrice, fee: 0.1 }
            : item
        )
      );
    };
    return () => socket.close();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices((prev) =>
        prev.map((item) =>
          item.exchange !== "Binance"
            ? {
                ...item,
                price: parseFloat((Math.random() * 5 + 140).toFixed(2)),
                fee: parseFloat((Math.random() * 0.3 + 0.05).toFixed(2)),
              }
            : item
        )
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in");
          }
        });
      },
      { threshold: 0.2 }
    );
    document.querySelectorAll(".fade-section").forEach((section) => {
      observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <section
        id="chart"
        className="fade-section py-20 px-6 bg-gray-800 text-center opacity-0 translate-y-10 transition-all duration-1000"
      >
        <h2
          className="text-2xl md:text-3xl font-bold mb-6 text-yellow-400"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          Сравнение цен Solana (USD)
        </h2>
        <div className="w-full max-w-3xl h-64 bg-gray-900 rounded-xl p-4 shadow-lg mx-auto mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={prices}>
              <XAxis dataKey="exchange" tick={{ fill: "#aaa", fontSize: 12 }} />
              <YAxis tick={{ fill: "#aaa", fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: "#222", border: "none", color: "#fff" }}
                labelStyle={{ color: "#ffdd00" }}
              />
              <Legend />
              <Bar dataKey="price" fill="#ffdd00" name="Цена (USD)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <h2
          className="text-2xl md:text-3xl font-bold mb-6 text-green-400"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          Сравнение комиссий (%)
        </h2>
        <FeesChart prices={prices} />
      </section>

      <style>
        {`
          .fade-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
          }
        `}
      </style>
    </div>
  );
}

export default App;
