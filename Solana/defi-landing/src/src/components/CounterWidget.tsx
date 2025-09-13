// src/components/CounterWidget.tsx
import React, { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { getProgram } from "../utils/anchorClient";
import * as anchor from "@project-serum/anchor";
import { PublicKey, Keypair } from "@solana/web3.js";

// Тип для state account
type StateAccount = {
    data: anchor.BN;
};

export default function CounterWidget() {
    const wallet = useWallet();
    const [program, setProgram] = useState<anchor.Program | null>(null);
    const [counter, setCounter] = useState<number | null>(null);
    const [statePubkey, setStatePubkey] = useState<PublicKey | null>(null);

    useEffect(() => {
        if (wallet.connected) {
            const p = getProgram(wallet);
            setProgram(p);
        }
    }, [wallet]);

    const initializeCounter = async () => {
        if (!program || !wallet.publicKey) return;

        // Генерируем новый PDA/State account
        const state = Keypair.generate();
        setStatePubkey(state.publicKey);

        await program.methods
            .initialize(new anchor.BN(0)) // initial_data = 0
            .accounts({
                state: state.publicKey,
                user: wallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            })
            .signers([state])
            .rpc();

        alert("Counter initialized!");
        setCounter(0);
    };

    const incrementCounter = async () => {
        if (!program || !wallet.publicKey || !statePubkey) return;

        // Загружаем текущее состояние
        const stateAccount = (await program.account.state.fetch(statePubkey)) as StateAccount;
        const current = stateAccount.data.toNumber(); // convert BN -> number

        await program.methods
            .update(new anchor.BN(current + 1))
            .accounts({
                state: statePubkey,
                user: wallet.publicKey,
            })
            .rpc();

        setCounter(current + 1);
    };

    return (
        <div>
            <h3>Simple Counter</h3>
            <p>Current value: {counter ?? "-"}</p>
            <button onClick={initializeCounter} disabled={!wallet.connected}>
                Initialize Counter
            </button>
            <button onClick={incrementCounter} disabled={!wallet.connected || !statePubkey}>
                Increment
            </button>
        </div>
    );
}