// Aegis Background Service Worker
const MONAD_RPC = "https://testnet-rpc.monad.xyz";
const RELAYER_API = "http://localhost:3006";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  handleRequest(request)
    .then((result) => sendResponse({ result }))
    .catch((error) => sendResponse({ error: error.message }));
  return true; // Keep channel open for async response
});

async function handleRequest({ method, params }) {
  console.log(`[Aegis Background] Handling RPC: ${method}`, params);

  switch (method) {
    case "eth_chainId":
      return "0x279f"; // 10143 in hex

    case "net_version":
      return "10143";

    case "eth_accounts":
    case "eth_requestAccounts": {
      const data = await chrome.storage.local.get("monad_passkey_account");
      if (data && data.monad_passkey_account) {
        return [data.monad_passkey_account.address];
      }
      // If no account, return empty or open extension popup
      return [];
    }

    case "eth_getBalance": {
      const address = params[0];
      const res = await fetch(MONAD_RPC, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_getBalance",
          params: [address, "latest"],
          id: 1,
        }),
      });
      const json = await res.json();
      return json.result;
    }

    case "eth_sendTransaction": {
      const txParams = params[0];
      const data = await chrome.storage.local.get("monad_passkey_account");
      if (!data || !data.monad_passkey_account) {
        throw new Error("No active Aegis account found. Open Aegis extension to unlock.");
      }

      const account = data.monad_passkey_account;
      const res = await fetch(`${RELAYER_API}/api/send-mon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: account.address,
          to: txParams.to,
          amount: (parseInt(txParams.value || "0", 16) / 1e18).toString(),
          pubKeyX: account.pubKeyX,
          pubKeyY: account.pubKeyY,
        }),
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || "Transaction failed");
      }
      return json.transactionHash;
    }

    default: {
      // Forward directly to Monad RPC
      const res = await fetch(MONAD_RPC, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method,
          params,
          id: 1,
        }),
      });
      const json = await res.json();
      return json.result;
    }
  }
}
