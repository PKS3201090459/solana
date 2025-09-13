import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { swapRaydium } from "../utils/raydiumSwap"; // Импортируем нашу функцию

const connection = new Connection("https://api.mainnet-beta.solana.com"); // Меняем на мейннет

export function WalletActions() {
  const { publicKey, wallet } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (publicKey) {
      connection.getBalance(publicKey).then(bal => {
        setBalance(bal / LAMPORTS_PER_SOL);
      });
    }
  }, [publicKey]);

  // РЕАЛЬНАЯ покупка SOL через свап USDC -> SOL
  const buySol = async () => {
    if (!publicKey || !wallet) return;
    
    setIsLoading(true);
    try {
      // USDC -> SOL свап через Raydium
      const txId = await swapRaydium({
        wallet,
        poolId: "58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2", // USDC/SOL пул
        inputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC mint
        outputMint: "So11111111111111111111111111111111111111112", // SOL mint
        amountIn: 10, // 10 USDC
        slippagePct: 1.0, // 1% slippage
        connection
      });

      alert(`✅ Покупка выполнена! TX: ${txId}`);
      // Обновляем баланс после свапа
      const newBalance = await connection.getBalance(publicKey);
      setBalance(newBalance / LAMPORTS_PER_SOL);

    } catch (error: any) {
      console.error("Ошибка покупки:", error);
      alert(`❌ Ошибка: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // РЕАЛЬНАЯ продажа SOL через свап SOL -> USDC
  const sellSol = async () => {
    if (!publicKey || !wallet) return;
    
    setIsLoading(true);
    try {
      // SOL -> USDC свап через Raydium
      const txId = await swapRaydium({
        wallet,
        poolId: "58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2", // USDC/SOL пул
        inputMint: "So11111111111111111111111111111111111111112", // SOL mint
        outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC mint
        amountIn: 0.1, // 0.1 SOL
        slippagePct: 1.0, // 1% slippage
        connection
      });

      alert(`✅ Продажа выполнена! TX: ${txId}`);
      // Обновляем баланс после свапа
      const newBalance = await connection.getBalance(publicKey);
      setBalance(newBalance / LAMPORTS_PER_SOL);

    } catch (error: any) {
      console.error("Ошибка продажи:", error);
      alert(`❌ Ошибка: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4">
      {publicKey && (
        <>
          <p>💰 Баланс: {balance !== null ? balance.toFixed(4) : "Загрузка..."} SOL</p>
          <div className="flex space-x-4 mt-2">
            <button
              onClick={buySol}
              disabled={isLoading}
              className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? "⏳..." : "🟢 Купить SOL за USDC"}
            </button>
            <button
              onClick={sellSol}
              disabled={isLoading}
              className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
            >
              {isLoading ? "⏳..." : "🔴 Продать SOL за USDC"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}