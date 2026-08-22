import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@monad-passkey/react", "@monad-passkey/core", "@monad-passkey/contracts"],
};

export default nextConfig;
