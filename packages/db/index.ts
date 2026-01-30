import mongoose, {Schema} from "mongoose";

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const EdgesSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    source: {
        type: String,
        required: true
    },
    target: {
        type: String,
        required: true
    }
}, {
    _id: false
})

const PositionSchema = new Schema({
    x: {
        type: Number,
        required: true
    },
    y: {
        type: Number,
        required: true
    }
},{_id: false})

const NodeDataSchema = {
    kind: {
        type: String,
        enum: ["ACTION", "TRIGGER"]
    },
    metadata: Schema.Types.Mixed

}

const WorkflowNodesSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    credentials: Schema.Types.Mixed,
    position: PositionSchema,
    nodeId: {
        type: mongoose.Types.ObjectId,
        ref: "Nodes"
    },
    data: NodeDataSchema,
}, {
    _id: false
})

const WorkFlowSchema = new Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Users"
    },
    nodes: [WorkflowNodesSchema],
    edges: [EdgesSchema]
})

const CredentialsTypeSchema = new Schema({
    key: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    required: {
        type: Boolean,
        required: true
    }
}, { _id: false })

const MetadataNodeFieldSchema = new Schema({
    fieldKey: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["select", "number", "asset", "text"],
        required: true
    },
    required: {
        type: Boolean,
        default: true
    },
    options: [String]
}, { _id: false })

const NodesSchema = new Schema({
    slug: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["ACTION", "TRIGGER"],
        required: true
    },
    credentialsType: [CredentialsTypeSchema],
    metadataNodeSchema: [MetadataNodeFieldSchema]
})

const ExecutionsSchema = new Schema({
    workflowId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Workflows"
    },
    status: {
        type: String,
        enum: ["PENDING", "SUCCESS", "FAILURE"]
    },
    startTime: {
        type: Date,
        default: Date.now(),
        required: true
    },
    endTime: Date
})

export const UserModel = mongoose.model("Users", UserSchema);
export const WorkflowModel = mongoose.model("Workflows", WorkFlowSchema);
export const NodeModel = mongoose.model("Nodes", NodesSchema)
export const ExecutionModel = mongoose.model("Executions", ExecutionsSchema)