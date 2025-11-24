import { Schema, model, models, InferSchemaType } from "mongoose";

const ExperienceSchema = new Schema(
  {
    company: { type: String, required: true },
    role: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String },
    description: { type: String, required: true },
    highlights: { type: [String], default: [] },
  },
  { timestamps: true }
);

export type IExperience = InferSchemaType<typeof ExperienceSchema>;

export default models.Experience || model("Experience", ExperienceSchema);

