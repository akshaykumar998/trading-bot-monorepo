export const SUPPORTED_ASSETS = ["SOL", "BTC", "ETH"] as const;
export type SupportedAsset = (typeof SUPPORTED_ASSETS)[number];

export type TradingMetaData = {
  action: string;
  type: "LONG" | "SHORT";
  qty: number;
  symbol: SupportedAsset;
};

export type PriceTriggerMetaData = {
  asset: SupportedAsset;
  price: number;
  decimals: number;
};

export type TimerNodeMetaData = {
    time: number
};