import { Schema, model, models, InferSchemaType } from "mongoose";

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    tags: { type: [String], default: [] },
    coverImage: String,
  },
  { timestamps: true }
);

export type IBlog = InferSchemaType<typeof BlogSchema>;

export default models.Blog || model("Blog", BlogSchema);

