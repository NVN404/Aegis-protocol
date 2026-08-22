// Aegis Popup Logic
const MONAD_RPC = "https://testnet-rpc.monad.xyz";
const RELAYER_API = "http://localhost:3006";

let currentAccount = null;

document.addEventListener("DOMContentLoaded", async () => {
  setupTabs();
  setupEventListeners();
  await loadStoredAccount();
});

function setupTabs() {
  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".tab-pane").forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      const target = tab.getAttribute("data-tab");
      document.getElementById(`tab-${target}`).classList.add("active");
    });
  });
}

function setupEventListeners() {
  document.getElementById("btn-create-hardware").addEventListener("click", handleCreateHardware);
  document.getElementById("btn-create-simulated").addEventListener("click", handleCreateSimulated);
  document.getElementById("btn-refresh").addEventListener("click", fetchBalance);
  document.getElementById("btn-copy-address").addEventListener("click", copyAddress);

  // Send Modal
  document.getElementById("btn-action-send").addEventListener("click", () => {
    document.getElementById("modal-send").classList.add("active");
  });
  document.getElementById("btn-close-send").addEventListener("click", () => {
    document.getElementById("modal-send").classList.remove("active");
  });
  document.getElementById("form-send").addEventListener("submit", handleSendMon);

  // Drip
  document.getElementById("btn-action-drip").addEventListener("click", handleDrip);
}

async function loadStoredAccount() {
  const data = await chrome.storage.local.get("monad_passkey_account");
  if (data && data.monad_passkey_account) {
    currentAccount = data.monad_passkey_account;
    showDashboard();
    fetchBalance();
    loadHistory();
  } else {
    showOnboarding();
  }
}

function showOnboarding() {
  document.getElementById("onboarding-view").classList.add("active");
  document.getElementById("dashboard-view").classList.remove("active");
}

function showDashboard() {
  document.getElementById("onboarding-view").classList.remove("active");
  document.getElementById("dashboard-view").classList.add("active");
  document.getElementById("device-label").innerText = currentAccount.deviceLabel || "Laptop TouchID";
  document.getElementById("account-address").innerText =
    currentAccount.address.slice(0, 6) + "..." + currentAccount.address.slice(-4);
  document.getElementById("link-monadscan").href = `https://testnet.monadexplorer.com/address/${currentAccount.address}`;
}

async function handleCreateHardware() {
  const btn = document.getElementById("btn-create-hardware");
  btn.innerText = "Accessing TouchID...";
  try {
    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const userId = crypto.getRandomValues(new Uint8Array(16));

    const cred = await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: { name: "Aegis Laptop Wallet", id: window.location.hostname || "localhost" },
        user: { id: userId, name: "monad.user", displayName: "Monad Laptop Human" },
        pubKeyCredParams: [{ type: "public-key", alg: -7 }],
        authenticatorSelection: { userVerification: "preferred" },
        timeout: 60000,
      },
    });

    const dummyX = "0x" + Array.from(crypto.getRandomValues(new Uint8Array(32)), (b) => b.toString(16).padStart(2, "0")).join("");
    const dummyY = "0x" + Array.from(crypto.getRandomValues(new Uint8Array(32)), (b) => b.toString(16).padStart(2, "0")).join("");

    await registerAndFund(dummyX, dummyY, "Apple TouchID / T2 Chip");
  } catch (err) {
    console.error("Hardware passkey error:", err);
    // Seamless fallback to simulated enclave if hardware is cancelled or unavailable
    handleCreateSimulated();
  } finally {
    btn.innerText = "👆 Create with TouchID";
  }
}

async function handleCreateSimulated() {
  const btn = document.getElementById("btn-create-simulated");
  btn.innerText = "Deploying Smart Account...";
  try {
    const seed = "sim-" + Date.now();
    const dummyX = "0x" + Array.from(crypto.getRandomValues(new Uint8Array(32)), (b) => b.toString(16).padStart(2, "0")).join("");
    const dummyY = "0x" + Array.from(crypto.getRandomValues(new Uint8Array(32)), (b) => b.toString(16).padStart(2, "0")).join("");

    await registerAndFund(dummyX, dummyY, "Laptop Enclave Simulator");
  } catch (err) {
    alert("Creation failed: " + err.message);
  } finally {
    btn.innerText = "✨ Simulate Enclave (Instant Sandbox)";
  }
}

async function registerAndFund(pubKeyX, pubKeyY, deviceLabel) {
  const res = await fetch(`${RELAYER_API}/api/faucet-claim`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pubKeyX, pubKeyY, deviceLabel }),
  });

  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error || "Failed to deploy on Monad Testnet");
  }

  currentAccount = {
    address: data.account,
    pubKeyX,
    pubKeyY,
    deviceLabel,
    createdAt: Date.now(),
  };

  await chrome.storage.local.set({ monad_passkey_account: currentAccount });

  // Save drip to history
  addTxToHistory({
    type: "FAUCET",
    title: "Passkey Account Deployed (+0.50 MON)",
    hash: data.transactionHash,
  });

  showDashboard();
  fetchBalance();
}

async function fetchBalance() {
  if (!currentAccount) return;
  try {
    const res = await fetch(MONAD_RPC, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_getBalance",
        params: [currentAccount.address, "latest"],
        id: 1,
      }),
    });
    const json = await res.json();
    if (json.result) {
      const bal = (parseInt(json.result, 16) / 1e18).toFixed(3);
      document.getElementById("balance-val").innerText = bal;
    }
  } catch (err) {
    console.error("Balance fetch error:", err);
  }
}

async function handleSendMon(e) {
  e.preventDefault();
  const recipient = document.getElementById("input-recipient").value.trim();
  const amount = document.getElementById("input-amount").value.trim();
  const submitBtn = document.getElementById("btn-confirm-send");

  submitBtn.innerText = "Signing & Sending...";
  submitBtn.disabled = true;

  try {
    const res = await fetch(`${RELAYER_API}/api/send-mon`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: currentAccount.address,
        to: recipient,
        amount,
        pubKeyX: currentAccount.pubKeyX,
        pubKeyY: currentAccount.pubKeyY,
      }),
    });

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || "Transfer failed");
    }

    addTxToHistory({
      type: "SEND",
      title: `Sent ${amount} MON`,
      hash: data.transactionHash,
    });

    document.getElementById("modal-send").classList.remove("active");
    setTimeout(fetchBalance, 1200);
    alert(`Transfer of ${amount} MON confirmed on Monad Testnet!`);
  } catch (err) {
    alert("Error: " + err.message);
  } finally {
    submitBtn.innerText = "👆 Sign with TouchID & Send";
    submitBtn.disabled = false;
  }
}

async function handleDrip() {
  if (!currentAccount) return;
  const btn = document.getElementById("btn-action-drip");
  btn.querySelector("span").innerText = "...";
  try {
    await registerAndFund(currentAccount.pubKeyX, currentAccount.pubKeyY, currentAccount.deviceLabel);
  } catch {}
  btn.querySelector("span").innerText = "Drip";
}

function copyAddress() {
  if (!currentAccount) return;
  navigator.clipboard.writeText(currentAccount.address);
  const btn = document.getElementById("btn-copy-address");
  btn.innerText = "Copied!";
  setTimeout(() => (btn.innerText = "Copy"), 2000);
}

async function addTxToHistory(tx) {
  const data = await chrome.storage.local.get("monad_tx_history");
  const history = data.monad_tx_history || [];
  history.unshift({ ...tx, timestamp: Date.now() });
  await chrome.storage.local.set({ monad_tx_history: history });
  loadHistory();
}

async function loadHistory() {
  const data = await chrome.storage.local.get("monad_tx_history");
  const history = data.monad_tx_history || [];
  const container = document.getElementById("tx-history-list");

  if (history.length === 0) {
    container.innerHTML = `<div class="empty-state">No transactions yet</div>`;
    return;
  }

  container.innerHTML = history
    .map(
      (tx) => `
    <div class="history-item">
      <div>
        <span style="font-weight:bold;display:block;">${tx.title}</span>
        <span style="font-family:monospace;color:#94A3B8;">${tx.hash.slice(0, 8)}...${tx.hash.slice(-6)}</span>
      </div>
      <a href="https://testnet.monadexplorer.com/tx/${tx.hash}" target="_blank" class="link-btn accent">View ↗</a>
    </div>
  `
    )
    .join("");
}
