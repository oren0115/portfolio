import { Schema, model, models, InferSchemaType } from "mongoose";

const SkillSchema = new Schema(
  {
    name: { type: String, required: true },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "expert"],
      required: true,
    },
    category: {
      type: String,
      enum: ["frontend", "backend", "jaringan", "database"],
      default: "frontend",
      required: true,
    },
    icon: String,
  },
  { timestamps: true }
);

export type ISkill = InferSchemaType<typeof SkillSchema>;

export default models.Skill || model("Skill", SkillSchema);

