import { LogisticsProviderName } from "../../models/Shipping";

import { LogisticsProvider } from "./LogisticsProvider";
import { ShiprocketProvider } from "./shiprocket/ShiprocketProvider";

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function createLogisticsProviders(): Record<
  LogisticsProviderName,
  LogisticsProvider
> {
  const providers = {} as Record<LogisticsProviderName, LogisticsProvider>;

  providers.shiprocket = new ShiprocketProvider({
    email: requireEnv("SHIPROCKET_EMAIL"),

    password: requireEnv("SHIPROCKET_PASSWORD"),

    channelId: process.env.SHIPROCKET_CHANNEL_ID
      ? Number(process.env.SHIPROCKET_CHANNEL_ID)
      : undefined,
  });

  return providers;
}
