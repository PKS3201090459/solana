import React, { useEffect, useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { WalletActions } from "./src/components/WalletActions";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "./wallet.css";


function App() {
  const [prices, setPrices] = useState([
    { exchange: "Binance", price: 0, fee: 0 },
    { exchange: "Bybit", price: 0, fee: 0 },
    { exchange: "Kraken", price: 0, fee: 0 },
    { exchange: "Coinbase", price: 0, fee: 0 },
  ]);

  // Binance WS
  useEffect(() => {
    const socket = new WebSocket("wss://stream.binance.com:9443/ws/solusdt@trade");
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const binancePrice = parseFloat(message.p);
      setPrices((prev) =>
        prev.map((item) =>
          item.exchange === "Binance"
            ? {
                ...item,
                price: binancePrice,
                fee: parseFloat((binancePrice * 0.001).toFixed(2)), // комиссия 0.1%
              }
            : item
        )
      );
    };
    return () => socket.close();
  }, []);

  // Random prices + fees imitation
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices((prev) =>
        prev.map((item) =>
          item.exchange !== "Binance"
            ? {
                ...item,
                price: parseFloat((Math.random() * 5 + 140).toFixed(2)),
                fee: parseFloat((Math.random() * 0.5 + 0.1).toFixed(2)), // комиссия 0.1–0.6$
              }
            : item
        )
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Анимация появления
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
      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full bg-black/70 backdrop-blur-md z-50 flex justify-between items-center px-6 py-4">
        <div className="flex items-center space-x-2">
          <img src="/Group 673 (1).png" alt="Logo" className="w-8 h-8" />
          <span
            className="text-xl font-bold text-yellow-400 title-glow"
            style={{ fontFamily: "'Press Start 2P', cursive" }}
          >
            SolendX
          </span>
        </div>
        <nav className="hidden md:flex space-x-6 text-gray-300 font-medium">
          <a href="#hero" className="hover:text-yellow-400">Главная</a>
          <a href="#problem" className="hover:text-yellow-400">Проблема</a>
          <a href="#solution" className="hover:text-yellow-400">Решение</a>
          <a href="#features" className="hover:text-yellow-400">Функции</a>
          <a href="#chart" className="hover:text-yellow-400">График</a>
          <a href="#cta" className="hover:text-yellow-400">Контакты</a>
        </nav>
      </header>

      {/* HERO */}
      <section
        id="hero"
        className="fade-section flex flex-col items-center justify-center min-h-screen text-center px-6 bg-hero opacity-0 translate-y-10 transition-all duration-1000"
      >
        <h1
          className="text-4xl md:text-5xl font-bold mb-4 text-yellow-400 title-glow"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          SolendX – протокол кредитования на Solana
        </h1>
        <p className="text-md md:text-lg max-w-2xl mb-6 text-gray-300">
          Кредитование и заимствование с минимальными комиссиями.<br />
          Быстро. Дёшево. Безопасно.
        </p>
        <WalletMultiButton>🍕 Выберите кошелек</WalletMultiButton> 
        <WalletActions />
      </section>

      {/* PROBLEM */}
      <section id="problem" className="fade-section py-20 px-6 bg-problem text-center opacity-0 translate-y-10 transition-all duration-1000">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 title-glow" style={{ fontFamily: "'Press Start 2P', cursive" }}>
          В чём проблема?
        </h2>
        <p className="max-w-3xl mx-auto text-gray-400">
          Текущие DeFi-платформы медленные и дорогие. Высокие комиссии и сложные механики
          отпугивают новичков и мешают массовому использованию.
        </p>
      </section>

      {/* SOLUTION */}
      <section id="solution" className="fade-section py-20 px-6 text-center bg-solution opacity-0 translate-y-10 transition-all duration-1000">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 title-glow" style={{ fontFamily: "'Press Start 2P', cursive" }}>
          Наше решение
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="card"><h3 className="text-lg mb-2">⚡ Быстро</h3><p>Solana обрабатывает до 65,000 транзакций в секунду.</p></div>
          <div className="card"><h3 className="text-lg mb-2">💰 Дёшево</h3><p>Средняя комиссия за займ меньше $0.01.</p></div>
          <div className="card"><h3 className="text-lg mb-2">🔒 Надёжно</h3><p>Займы под залог SOL, USDC и даже NFT.</p></div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="fade-section py-20 px-6 text-center bg-gray-900 opacity-0 translate-y-10 transition-all duration-1000">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 title-glow" style={{ fontFamily: "'Press Start 2P', cursive" }}>
          Что мы предлагаем
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="card"><h3 className="text-lg mb-2">📥 Взять займ</h3><p>Используйте USDC, SOL или NFT в качестве залога.</p></div>
          <div className="card"><h3 className="text-lg mb-2">📤 Выдать займ</h3><p>Станьте кредитором и получайте процент.</p></div>
          <div className="card"><h3 className="text-lg mb-2">⚡ Flash Loans</h3><p>Беззалоговые займы для арбитража и ликвидаций.</p></div>
        </div>
      </section>

      {/* CHART */}
      <section id="chart" className="fade-section py-20 px-6 bg-gray-800 text-center opacity-0 translate-y-10 transition-all duration-1000">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-yellow-400" style={{ fontFamily: "'Press Start 2P', cursive" }}>
          Сравнение цен и комиссий
        </h2>
        <div className="w-full max-w-3xl h-64 bg-gray-900 rounded-xl p-4 shadow-lg mx-auto">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={prices}>
              <XAxis dataKey="exchange" tick={{ fill: "#aaa", fontSize: 12 }} />
              <YAxis tick={{ fill: "#aaa", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "#222", border: "none", color: "#fff" }} labelStyle={{ color: "#ffdd00" }} />
              <Legend />
              <Bar dataKey="price" fill="#ffdd00" name="Цена" />
              <Bar dataKey="fee" fill="#00ff99" name="Комиссия" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* CTA */}
      <section
        id="cta"
        className="fade-section py-20 px-6 text-center opacity-0 translate-y-10 transition-all duration-1000"
        style={{
          backgroundColor: "#ffdd00",
          backgroundImage: "url('/Group 676.png')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <h2
          className="text-2xl md:text-3xl font-bold mb-4"
          style={{
            fontFamily: "'Press Start 2P', cursive",
            color: "#000",
            WebkitTextStroke: "1px #000",
            textShadow: "none",
          }}
        >
          Готовы попробовать?
        </h2>
        <button
          className="px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-300"
          style={{
            fontFamily: "'Press Start 2P', cursive",
            color: "#000",
            backgroundColor: "#ffdd00",
            boxShadow: "0 0 10px rgba(255, 221, 0, 0.7)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 0 20px rgba(0, 0, 0, 1)";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.7)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          🚀 Запустить демо
        </button>
      </section>

      {/* CSS inline */}
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
