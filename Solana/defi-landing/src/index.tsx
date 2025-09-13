import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { WalletConnectionProvider } from "./WalletConnectionProvider";
import "./index.css";

// ✅ Полифилл Buffer для браузера
import { Buffer } from "buffer";
(window as any).Buffer = Buffer;

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <WalletConnectionProvider>
      <App />
    </WalletConnectionProvider>
  </React.StrictMode>
);
