import { Schema, model } from "mongoose";

import Joi from "joi";

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    oldPrice: {
      type: Number,
      required: false,
      default: 0,
    },
    Stock: {
      type: Number,
      required: true,
    },
    Rating: {
      type: Number,
      required: true,
    },
    Views: {
      type: Number,
      required: false,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "admin",
      required: true,
    },
    units: {
      type: String,
      required: true,
      enum: ["kg", "m", "litr"],
    },
    description: {
      type: String,
      required: true,
    },
    urls: {
      type: Array,
      required: false,
      default: [],
    },
    info: {
      type: Array,
      required: true,
      default: [],
    },
    available: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Products = model("product", productSchema);

export const validateProduct = (body) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required(),
    oldPrice: Joi.number().allow("0"),
    Stock: Joi.number().required(),
    Rating: Joi.number().required(),
    Views: Joi.number(),
    categoryId: Joi.string().required(),
    // adminId: Joi.string().required(),
    units: Joi.string().valid("kg", "m", "litr").required(),
    description: Joi.string().required(),
    urls: Joi.array().items(Joi.string().uri()).allow("[]"),
    info: Joi.string(),
    available: Joi.boolean().required().allow(true),
  });
  return schema.validate(body);
};
