import React, { useEffect, useState } from "react";
import { loadMarket, getOrderbookSnapshot, placeLimitOrder } from "../utils/serumClient";
import { swapRaydium } from "../utils/raydiumSwap";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, clusterApiUrl } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

export default function SerumWidget({ marketAddress }: { marketAddress: string }) {
    const wallet = useWallet();
    const [market, setMarket] = useState<any | null>(null);
    const [book, setBook] = useState<any>(null);

    useEffect(() => {
        (async () => {
            const m = await loadMarket(marketAddress);
            setMarket(m);
            const snap = await getOrderbookSnapshot(m);
            setBook(snap);
        })();
    }, [marketAddress]);

    const onBuy = async () => {
        if (!market) return;

        // Пример limit buy через Serum
        const bestAsk = book?.topAsks?.[0]?.price || (await market.loadAsks(connection)).getL2(1)[0][0];
        const price = bestAsk * 0.995;
        const size = 0.01;
        const txid = await placeLimitOrder(market, wallet, "buy", price, size);
        alert("Serum limit buy placed: " + txid);
    };

    const onRaydiumSwap = async () => {
        if (!wallet.publicKey) return;

        try {
            const txid = await swapRaydium({
                wallet,
                poolId: "RAY-SOL", // пример poolId, замени на актуальный
                inputMint: "So11111111111111111111111111111111111111112", // SOL
                outputMint: "RAY111111111111111111111111111111111111111", // RAY
                amountIn: 0.01,
            });
            alert("Raydium swap tx: " + txid);
        } catch (e: any) {
            alert("Ошибка swap: " + e.message);
        }
    };

    return (
        <div>
            <h3>Serum market {marketAddress}</h3>
            <pre>{JSON.stringify(book, null, 2)}</pre>
            <button onClick={onBuy} disabled={!wallet.publicKey}>Buy (limit)</button>
            <button onClick={onRaydiumSwap} disabled={!wallet.publicKey}>Raydium Swap</button>
        </div>
    );
}