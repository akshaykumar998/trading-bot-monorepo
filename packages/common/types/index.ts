import { z } from "zod";

export const SignupSchema = z.object({
    username: z.string().min(3).max(100),
    password: z.string()
})

export const SigninSchema = z.object({
    username: z.string().min(3).max(100),
    password: z.string()
})

export const CreateWorkflowSchema= z.object({
    nodes: z.array(z.object({
        nodeId: z.string(),
        data: z.object({
            kind: z.enum(["ACTION", "TRIGGER"]),
            metadata: z.any()
        }),
        type: z.string(),
        id: z.string(),
        credentials: z.any(),
        position: z.object({
            x: z.number(),
            y: z.number()
        })
    })),
    edges: z.array(z.object({
        id: z.string(),
        source: z.string(),
        target: z.string()
    }))
})

export const UpdateWorkflowSchema = z.object({
    id: z.string(),
    nodes: z.array(z.object({
        id: z.string(),
        credentials: z.any(),
        type: z.string(),
        nodeId: z.string(),
        data: z.object({
            kind: z.enum(["ACTION", "TRIGGER"]),
            metadata: z.any()
        })
    })),
    edges: z.array(z.object({
        source: z.string(),
        target: z.string()
    }))
})