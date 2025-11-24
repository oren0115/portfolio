import { Schema, model, models, InferSchemaType } from "mongoose";

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    techStack: { type: [String], default: [] },
    image: String,
    link_demo: String,
    link_repo: String,
  },
  { timestamps: true }
);

export type IProject = InferSchemaType<typeof ProjectSchema>;

export default models.Project || model("Project", ProjectSchema);

