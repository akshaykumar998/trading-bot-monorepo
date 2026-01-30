export const SUPPORTED_ASSETS = ["SOL", "BTC", "ETH"] as const;
export type SupportedAsset = (typeof SUPPORTED_ASSETS)[number];

export type TradingMetaData = {
  action: string;
  type: "LONG" | "SHORT";
  qty: number;
  symbol: SupportedAsset;
  credentials?: Record<string, unknown>;
  /** Node document id from GET /nodes, sent as nodeId in POST /workflow */
  nodeId?: string;
};

export type PriceTriggerMetaData = {
  asset: SupportedAsset;
  price: number;
  decimals: number;
  /** Node document id from GET /nodes, sent as nodeId in POST /workflow */
  nodeId?: string;
};

export type TimerNodeMetaData = {
  time: number;
  /** Node document id from GET /nodes, sent as nodeId in POST /workflow */
  nodeId?: string;
};