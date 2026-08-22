// Injected Web3 Provider (EIP-1193 + EIP-6963)
(function () {
  console.log("[Aegis] Injected Provider Active on Monad Testnet (Chain ID 10143)");

  let requestId = 0;
  const pendingRequests = new Map();

  // Listen for responses from extension content script
  window.addEventListener("message", (event) => {
    if (event.source !== window || !event.data || event.data.target !== "aegis-inpage") return;
    const { id, result, error } = event.data;
    if (pendingRequests.has(id)) {
      const { resolve, reject } = pendingRequests.get(id);
      pendingRequests.delete(id);
      if (error) {
        reject(new Error(error));
      } else {
        resolve(result);
      }
    }
  });

  function sendToExtension(method, params = []) {
    return new Promise((resolve, reject) => {
      const id = ++requestId;
      pendingRequests.set(id, { resolve, reject });
      window.postMessage(
        {
          target: "aegis-content",
          id,
          method,
          params,
        },
        "*"
      );
    });
  }

  const aegisProvider = {
    isAegis: true,
    isMetaMask: false,
    chainId: "0x279f", // 10143 (Monad Testnet)
    selectedAddress: null,

    request: async function ({ method, params = [] }) {
      switch (method) {
        case "eth_chainId":
          return "0x279f"; // 10143 in hex
        case "net_version":
          return "10143";
        case "eth_accounts":
        case "eth_requestAccounts": {
          const res = await sendToExtension("eth_requestAccounts", params);
          if (res && res.length > 0) {
            this.selectedAddress = res[0];
          }
          return res;
        }
        case "eth_sendTransaction": {
          return await sendToExtension("eth_sendTransaction", params);
        }
        case "personal_sign":
        case "eth_sign": {
          return await sendToExtension("personal_sign", params);
        }
        default:
          return await sendToExtension(method, params);
      }
    },

    on: function (event, handler) {
      console.log("[Aegis Provider] Subscribed to event:", event);
    },
    removeListener: function () {},
  };

  // 1. Inject as window.monad and window.ethereum (if not already set)
  window.monad = aegisProvider;
  if (!window.ethereum) {
    window.ethereum = aegisProvider;
  }

  // 2. Announce via EIP-6963 (Standard Web3 Wallet Discovery)
  const info = {
    uuid: "aegis-hardware-wallet",
    name: "Aegis",
    icon: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="%230e0a26"/><path d="M18 46V18L32 32L46 18V46" stroke="%23836EF9" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    rdns: "xyz.monad.passkey",
  };

  function announce() {
    window.dispatchEvent(
      new CustomEvent("eip6963:announceProvider", {
        detail: Object.freeze({ info, provider: aegisProvider }),
      })
    );
  }

  window.addEventListener("eip6963:requestProvider", () => {
    announce();
  });

  announce();
})();
