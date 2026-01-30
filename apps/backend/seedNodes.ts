/**
 * Seed action and trigger nodes with credentialsType and metadataNodeSchema.
 * Run: bun run seedNodes.ts (from apps/backend, with MONGO_URL set)
 */
import mongoose from "mongoose";
import { NodeModel } from "db/client";

const TRIGGER_NODES = [
  {
    slug: "timer",
    title: "Timer",
    description: "Run this trigger every x seconds/minutes",
    type: "TRIGGER",
    credentialsType: [],
    metadataNodeSchema: [{ fieldKey: "time", title: "Timer", type: "text", required: true }],
  },
  {
    slug: "price-trigger",
    title: "Price Trigger",
    description: "Runs whenever the price goes above or below a certain number",
    type: "TRIGGER",
    credentialsType: [],
    metadataNodeSchema: [
      { fieldKey: "price", title: "Price", type: "text", required: true },
      { fieldKey: "decimals", title: "Decimals", type: "text", required: true },
      { fieldKey: "asset", title: "Assets", type: "asset", required: true },
    ],
  },
];

const ACTION_NODES = [
  {
    slug: "hyperliquid",
    title: "Hyperliquid",
    description: "Place a trade on hyperliquid",
    type: "ACTION",
    credentialsType: [{ key: "apiKey", title: "API Key", required: true }],
    metadataNodeSchema: [
      { fieldKey: "type", title: "Type", type: "select", required: true, options: ["LONG", "SHORT"] },
      { fieldKey: "qty", title: "Qty", type: "number", required: true },
      { fieldKey: "symbol", title: "Symbol", type: "asset", required: true },
    ],
  },
  {
    slug: "lighter",
    title: "Lighter",
    description: "Place a trade on lighter",
    type: "ACTION",
    credentialsType: [{ key: "apiKey", title: "API Key", required: true }],
    metadataNodeSchema: [
      { fieldKey: "type", title: "Type", type: "select", required: true, options: ["LONG", "SHORT"] },
      { fieldKey: "qty", title: "Qty", type: "number", required: true },
      { fieldKey: "symbol", title: "Symbol", type: "asset", required: true },
    ],
  },
  {
    slug: "backpack",
    title: "Backpack",
    description: "Place a trade on backpack",
    type: "ACTION",
    credentialsType: [
      { key: "username", title: "Username", required: true },
      { key: "password", title: "Password", required: true },
    ],
    metadataNodeSchema: [
      { fieldKey: "type", title: "Type", type: "select", required: true, options: ["LONG", "SHORT"] },
      { fieldKey: "qty", title: "Qty", type: "number", required: true },
      { fieldKey: "symbol", title: "Symbol", type: "asset", required: true },
    ],
  },
];

async function seed() {
  const mongoUrl = process.env.MONGO_URL;
  if (!mongoUrl) {
    console.error("MONGO_URL is required");
    process.exit(1);
  }
  await mongoose.connect(mongoUrl);
  for (const node of TRIGGER_NODES) {
    await NodeModel.findOneAndUpdate({ slug: node.slug }, node, {
      upsert: true,
      new: true,
    });
  }
  for (const node of ACTION_NODES) {
    await NodeModel.findOneAndUpdate({ slug: node.slug }, node, {
      upsert: true,
      new: true,
    });
  }
  console.log("Seeded", TRIGGER_NODES.length, "trigger nodes and", ACTION_NODES.length, "action nodes");
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
