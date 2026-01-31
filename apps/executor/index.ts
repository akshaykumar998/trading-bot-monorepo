import { ExecutionModel, WorkflowModel } from "db/client";
import { execute } from "./execute";
import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URL!);

async function main() {
    while(true) {
        const workflows = await WorkflowModel.find({});
        workflows.map(async workflow => {
            const trigger = workflow.nodes.find(node => node.data?.kind === "TRIGGER");
            if(!trigger) return;

            switch(trigger?.type) {
                case "timer":
                    const execution = await ExecutionModel.findOne({
                        workflowId: workflow.id}).sort({startTime: -1});
                    if(!execution || new Date(execution.startTime).getTime() < Date.now() - (trigger.data?.metadata?.time * 1000)) {
                        const execution = await ExecutionModel.create({
                            workflowId: workflow.id,
                            status: "PENDING",
                            startTime: new Date()
                        });
                        await execute(workflow?.nodes, workflow.edges);
                        execution.endTime = new Date();
                        await execution.save();
                    }
                    
                    break;
            }
        })
    }
}

main();