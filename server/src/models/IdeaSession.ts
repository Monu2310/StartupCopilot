import { Schema, model } from "mongoose";

const MessageSchema = new Schema(
  {
    role: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const IdeaSessionSchema = new Schema(
  {
    sessionId: { type: String, required: true, unique: true },
    messages: { type: [MessageSchema], default: [] },
    lastOutput: { type: Schema.Types.Mixed }
  },
  { timestamps: true }
);

export const IdeaSession = model("IdeaSession", IdeaSessionSchema);
