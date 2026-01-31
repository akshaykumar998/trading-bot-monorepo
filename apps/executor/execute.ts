import { NodeModel } from "db/client";
import { executor as executeLighter } from "./executor";

export type Node = {
    id: string;
    type: string;
    credentials?: any;
    nodeId?: string;
    position?: {
        x: number;
        y: number;
    };
    data?: {
        kind?: string;
        metadata?: any;
    };
}

type Edge = {
    id: string;
    source: string;
    target: string;
}

export async function execute(nodes: Node[], edges: Edge[]) {
    const trigger = nodes.find(node => node.data?.kind === "TRIGGER");
    if(!trigger) return;

    await executeRecursive(nodes, edges, trigger.id);
}

export async function executeRecursive(nodes: Node[], edges: Edge[], sourceId: string) {
    const nodesToExecute = edges.filter(({source}) => source === sourceId).map(({target}) => target);

    await Promise.all(nodesToExecute.map(async nodeClientId => {
        const node = nodes.find(({id}) => id === nodeClientId);
        if(!node) return;
        switch(node.type) {
            case "lighter":
                executeLighter(node.data?.metadata?.symbol, node.data?.metadata?.qty, node.data?.metadata?.type, node.credentials?.apiKey);

        }
    }));

    await Promise.all(nodesToExecute.map(id => executeRecursive(nodes, edges, id)));
}