# 🛡️ Aegis Protocol — Browser Extension

**Aegis** is the Aegis Protocol browser extension wallet. It lets you create a hardware-bound Monad Smart Account using your laptop's **TouchID / Windows Hello / Fingerprint** sensor — zero seed phrases, zero cloud keys.

---

## 🚀 How to Install (Chrome / Brave / Edge / Arc)

### Step 1: Download the Extension

Clone the repo (or download the ZIP):

```bash
git clone https://github.com/NVN404/Aegis-protocol.git
```

The extension lives in the `/extension` folder.

### Step 2: Open Extensions Page

1. Open your Chromium browser (Chrome, Brave, Edge, Arc, etc.)
2. Navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right corner)

### Step 3: Load the Extension

1. Click **"Load unpacked"** button (top-left)
2. Browse to the `/extension` folder inside the cloned repo:
   ```
   Aegis-protocol/extension/
   ```
3. Click **Select Folder**

### Step 4: Pin & Use

1. Click the puzzle icon 🧩 in your browser toolbar
2. Find **Aegis** and click the 📌 pin icon
3. Click the Aegis icon to open the wallet popup
4. Tap **"👆 Create with TouchID"** to generate your hardware-bound wallet!

---

## 🖥️ What You Can Do

| Feature | Description |
| :--- | :--- |
| **1-Tap Wallet Creation** | TouchID / Windows Hello generates a `secp256r1` (P-256) key pair trapped in your device's Secure Enclave |
| **Send MON** | Sign & send MON tokens to any address on Monad Testnet |
| **Receive MON** | Copy your smart account address and share it |
| **Faucet Drip** | Request testnet MON from the built-in faucet relay |
| **Fall Guys Arena** | Quick-launch the on-chain 3D game directly from the extension |
| **Transaction History** | View all your on-chain activity |
| **0x0100 Tech Specs** | See live Monad Precompile verification details |

---

## 🔐 Security Model

- **Private key never leaves the hardware chip** — Apple Secure Enclave / Android Titan / TPM 2.0
- **No seed phrases** — keys are non-extractable by design
- **No cloud custody** — unlike Privy, Turnkey, or Fireblocks
- **On-chain verification** via Monad Precompile `0x0100` at flat 6,900 gas

---

## 🔗 Deployed Smart Contracts

| Contract | Address | Explorer |
| :--- | :--- | :--- |
| **PasskeyAccountFactory** | `0x29373c0172c89eA61df297ca76A252815b012bd1` | [MonadVision ↗](https://testnet.monadvision.com/address/0x29373c0172c89eA61df297ca76A252815b012bd1) |
| **ProofOfPersonhoodRegistry** | `0xeE575e3C061c85a14cb44152adDC5baB28Ce68a4` | [MonadVision ↗](https://testnet.monadvision.com/address/0xeE575e3C061c85a14cb44152adDC5baB28Ce68a4) |
| **FallGuysArena** | `0x129D936cfbBe50FA0Ce7e61b36B33A35d8D08DCa` | [MonadVision ↗](https://testnet.monadvision.com/address/0x129D936cfbBe50FA0Ce7e61b36B33A35d8D08DCa) |

---

## 🧪 Troubleshooting

| Issue | Fix |
| :--- | :--- |
| Extension not showing | Make sure **Developer mode** is ON in `chrome://extensions/` |
| TouchID not working | Your browser must support WebAuthn — use Chrome 67+ or Brave 1.0+ |
| Balance shows 0 | Click the 🔄 refresh button, or request a drip from the faucet |
| Send fails | Ensure the relayer is running at `http://localhost:3006` for gas sponsorship |

---

## 📄 License

MIT — Built for the Monad Blitz Hackathon 🟣
