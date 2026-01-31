import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { CreateWorkflowSchema, SigninSchema, SignupSchema, UpdateWorkflowSchema } from "common/types";
import jwt from "jsonwebtoken";

import { ExecutionModel, NodeModel, UserModel, WorkflowModel } from "db/client";

import { authMiddleware } from "./middleware";

mongoose.connect(process.env.MONGO_URL!);
const JWT_SECRET = process.env.JWT_SECRET!;
const app = express();
app.use(express.json())
app.use(cors({
    origin: process.env.WEB_URL || 'http://localhost:5173'
  }));

app.post("/signup", async (req, res) => {
    const {success, data} = SignupSchema.safeParse(req.body);

    if(!success) {
        res.status(403).json({
            message: "Incorrect username/password"
        });
        return 
    }
    try {
        const user = await UserModel.create({
            username: data.username,
            password: data.password
        })
        res.json({
            id: user._id,
        })
    } catch (error) {
        res.status(411).json({
            message: "Username already exists"
        })
    }
});

app.post("/signin", async (req, res) => {
    const {success, data} = SigninSchema.safeParse(req.body);

    if(!success) {
        res.status(403).json({
            message: "Incorrect username/password"
        });
        return 
    }
    try {
        const user = await UserModel.findOne({
            username: data.username,
            password: data.password
        })
        if(user){
            const token = jwt.sign({
                id: user._id
            }, JWT_SECRET)
            res.json({
                id: user._id,
                token
            })
        }else {
            res.status(403).json({
                message: "Incorrect Credentials"
            })
        }
    } catch (error) {
        res.status(411).json({
            message: "Username already exists"
        })
    }
});

app.post("/workflow", authMiddleware, async (req, res) => {
    const userId = req.userId!;
    const {success, data} = CreateWorkflowSchema.safeParse(req.body);

    if(!success) {
        res.status(403).json({
            message: "Incorrect inputs"
        })
        return``
    }

    try {
        const workflow = await WorkflowModel.create({
            userId,
            nodes: data.nodes,
            edges: data.edges
        })
        res.json({
            id: workflow._id
        })
    } catch (error) {
        console.log(error);
        res.status(411).json({
            message: "Failed to create workflow"
        })
    }
});

app.put("/workflow/:workflowId", authMiddleware, async (req, res) => {
    const {success, data} = UpdateWorkflowSchema.safeParse(req.body);

    if(!success) {
        res.status(403).json({
            message: "Incorrect inputs"
        })
        return``
    }

    try {
        const workflow = await WorkflowModel.findByIdAndUpdate(
            req.params.workflowId,
            data,
            {new: true}
        )
        if(!workflow){
            res.status(404).json({
                message: "Workflow not found"
            })
            return
        }
        res.json({
            id: workflow._id
        })
    } catch (error) {
        res.status(411).json({
            message: "Failed to create workflow"
        })
    } 
});

app.get("/workflows", authMiddleware, async (req, res) => {
    try {
        const workflows = await WorkflowModel.find({userId: req.userId})
        res.json(workflows)
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch workflows"
        })
    }
})

app.get("/workflow/:workflowId", authMiddleware, async (req, res) => {
    try {
        const workflow = await WorkflowModel.findById(req.params.workflowId);
        if(!workflow || workflow.userId.toString() !== req.userId) {
            res.status(404).json({
                message: "Workflow not found"
            })
            return
        }

        res.json(workflow)
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch workflow"
        })
    }
});

app.get("/workflow/executions/:workflowId", authMiddleware, async (req, res) => {
    const executions = await ExecutionModel.find({workflowId: req.params.workflowId})
    res.json(executions)
});

app.get("/nodes", async (req, res) => {
    const nodes = await NodeModel.find();
    res.json(nodes)
});



app.listen(process.env.PORT || 3000)