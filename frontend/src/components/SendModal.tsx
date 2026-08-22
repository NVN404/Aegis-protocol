"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, X, Fingerprint, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { PasskeyIdentity, PasskeySignatureResult, signWithHardwarePasskey, signWithSimulatedPasskey } from "@/lib/webauthn";
import { ethers } from "ethers";

interface SendModalProps {
  isOpen: boolean;
  onClose: () => void;
  identity: PasskeyIdentity;
  onSuccess: (result?: { transactionHash: string; explorerUrl?: string; amount?: string }) => void;
}

export function SendModal({ isOpen, onClose, identity, onSuccess }: SendModalProps) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("0.1");
  const [isSending, setIsSending] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setTxHash(null);

    if (!recipient || !ethers.isAddress(recipient)) {
      setError("Please enter a valid Monad EVM address (0x...)");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid MON amount");
      return;
    }

    setIsSending(true);

    try {
      // 1. Biometric verification prompt
      const challengeBytes = crypto.getRandomValues(new Uint8Array(32));
      let sig: PasskeySignatureResult;

      if (identity.isSimulated) {
        sig = signWithSimulatedPasskey(identity, ethers.hexlify(challengeBytes));
      } else {
        sig = await signWithHardwarePasskey(identity.rawCredentialId, challengeBytes);
      }

      // 2. Submit to Relayer / Send endpoint
      const relayerApi = process.env.NEXT_PUBLIC_RELAYER_URL || "http://localhost:3006";
      const res = await fetch(`${relayerApi}/api/send-mon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: identity.counterfactualAddress,
          pubKeyX: identity.pubKeyX,
          pubKeyY: identity.pubKeyY,
          to: recipient,
          amount: amount,
          signature: sig,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Transaction failed");
      }

      setTxHash(data.transactionHash);
      onSuccess({
        transactionHash: data.transactionHash,
        explorerUrl: data.explorerUrl || `https://testnet.monadexplorer.com/tx/${data.transactionHash}`,
        amount: amount,
      });
    } catch (err: any) {
      console.error("Send error:", err);
      setError(err?.message || "Failed to complete biometric transfer");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-sm rounded-3xl bg-white border border-neutral-200/90 p-6 text-neutral-900 shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 transition"
        >
          <X size={16} />
        </button>

        <div className="flex items-center space-x-2.5 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-[#0a0a0a] flex items-center justify-center text-white shadow-sm">
            <Send size={18} className="text-[#ff6b00]" />
          </div>
          <div>
            <h3 className="font-bold text-base text-neutral-900">Send Monad (MON)</h3>
            <p className="text-xs text-neutral-500">Biometrically signed transfer</p>
          </div>
        </div>

        {txHash ? (
          <div className="text-center py-4 space-y-3">
            <CheckCircle2 size={48} className="text-emerald-500 mx-auto" />
            <h4 className="font-bold text-sm text-neutral-900">Transfer Confirmed!</h4>
            <p className="text-xs text-neutral-600">
              Sent <span className="text-[#ff6b00] font-bold">{amount} MON</span> to{" "}
              <span className="font-mono text-neutral-800">{recipient.slice(0, 6)}...{recipient.slice(-4)}</span>
            </p>
            <a
              href={`https://testnet.monadexplorer.com/tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
              className="inline-block text-xs font-mono text-[#cc5400] hover:underline font-bold"
            >
              View on Monad Explorer →
            </a>
            <button
              onClick={onClose}
              className="w-full mt-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-bold text-neutral-800 transition"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Recipient Address</label>
              <input
                type="text"
                placeholder="0x..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full rounded-xl bg-neutral-50 border border-neutral-200 px-3 py-2.5 text-xs font-mono text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#ff6b00]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Amount (MON)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-xl bg-neutral-50 border border-neutral-200 px-3 py-2.5 text-xs font-mono text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#ff6b00]"
                />
                <span className="absolute right-3 top-2.5 text-xs font-bold text-neutral-500">MON</span>
              </div>
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-1.5">
                <AlertTriangle size={14} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSending}
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-[#0a0a0a] hover:bg-[#222] text-white font-bold text-xs shadow-sm active:scale-[0.98] transition disabled:opacity-50"
            >
              {isSending ? (
                <>
                  <Loader2 size={16} className="animate-spin text-[#ff6b00]" />
                  <span>Authorizing via Biometrics...</span>
                </>
              ) : (
                <>
                  <Fingerprint size={16} className="text-[#ff6b00]" />
                  <span>Authorize with FaceID / TouchID</span>
                </>
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
