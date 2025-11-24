import { Schema, model, models, InferSchemaType, Types } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, unique: true, required: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin"], default: "admin" },
  },
  { timestamps: true }
);

export type IUser = InferSchemaType<typeof UserSchema> & {
  _id: Types.ObjectId;
};

export default models.User || model("User", UserSchema);

