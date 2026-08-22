"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PaperPlaneTilt, X, Fingerprint, CheckCircle, Warning } from "@phosphor-icons/react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-sm rounded-3xl bg-[#0e0a26] border border-white/10 p-6 text-white shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition"
        >
          <X size={18} />
        </button>

        <div className="flex items-center space-x-2.5 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#836EF9] to-[#20E2D7] flex items-center justify-center text-white shadow-lg">
            <PaperPlaneTilt size={20} weight="bold" />
          </div>
          <div>
            <h3 className="font-extrabold text-base">Send Monad (MON)</h3>
            <p className="text-xs text-gray-400">Biometrically signed transfer</p>
          </div>
        </div>

        {txHash ? (
          <div className="text-center py-4 space-y-3">
            <CheckCircle size={48} className="text-[#10B981] mx-auto animate-bounce" weight="fill" />
            <h4 className="font-bold text-sm text-white">Transfer Confirmed!</h4>
            <p className="text-xs text-gray-400">
              Sent <span className="text-[#20E2D7] font-bold">{amount} MON</span> to{" "}
              <span className="font-mono text-gray-300">{recipient.slice(0, 6)}...{recipient.slice(-4)}</span>
            </p>
            <a
              href={`https://testnet.monadexplorer.com/tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
              className="inline-block text-xs font-mono text-[#836EF9] hover:underline"
            >
              View on Monad Explorer →
            </a>
            <button
              onClick={onClose}
              className="w-full mt-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Recipient Address</label>
              <input
                type="text"
                placeholder="0x..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2.5 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-[#836EF9]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Amount (MON)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2.5 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-[#836EF9]"
                />
                <span className="absolute right-3 top-2.5 text-xs font-bold text-gray-400">MON</span>
              </div>
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-1.5">
                <Warning size={14} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSending}
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-[#836EF9] to-[#6049E2] text-white font-bold text-xs shadow-lg hover:brightness-110 active:scale-[0.98] transition disabled:opacity-50"
            >
              <Fingerprint size={16} weight="bold" />
              <span>{isSending ? "Authorizing via Biometrics..." : "Authorize with FaceID / TouchID"}</span>
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
