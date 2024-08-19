import { Products, validateProduct } from "../modules/productSchema.js";

import { Category } from "../modules/categorySchema.js";
import fs from "fs";
import path from "path";

class ProductsController {
  async get(req, res) {
    try {
      let { limit, skip } = req.query;
      const products = await Products.find()
        .populate([{ path: "adminId", select: ["fname", "username"] }])
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(limit * skip);

      if (!products.length) {
        return res.status(400).json({
          msg: "Product is not defined",
          variant: "error",
          payload: null,
        });
      }
      res.status(200).json({
        msg: "All Products",
        variant: "success",
        payload: products,
        totalCount: products.length,
      });
    } catch (error) {
      res.status(500).json({
        msg: "Server error",
        variant: "error",
        payload: null,
      });
    }
  }
  async getByCategory(req, res) {
    try {
      const { limit = 10, skip = 0 } = req.query;
      const { categoryId } = req.params;

      const categoryData = await Category.findById(categoryId);
      if (!categoryData) {
        return res.status(404).json({
          variant: "error",
          msg: "Category not found",
          payload: null,
        });
      }

      const products = await Product.find({ categoryId })
        .populate([{ path: "categoryId", select: "title" }])
        .limit(parseInt(limit))
        .skip(parseInt(skip));
      const totalCount = await Product.countDocuments({
        categoryId,
      });

      res.status(200).json({
        variant: "success",
        msg: `All products for category ${categoryData?.title}`,
        payload: products,
        totalCount,
      });
    } catch (error) {
      res.status(500).json({
        variant: "error",
        msg: "Server error",
        payload: null,
      });
    }
  }
  async getProduct(req, res) {
    try {
      const { id } = req.params;
      const product = await Products.findById(id);

      res.status(200).json({
        msg: " Product successfully",
        variant: "success",
        payload: product,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        msg: "Server error",
        variant: "error",
        payload: null,
      });
    }
  }
  async create(req, res) {
    try {
      const { error } = validateProduct(req.body);
      if (error) {
        return res.status(400).json({
          msg: error.details[0].message,
          variant: "warning",
          payload: null,
        });
      }

      const urls = req.files
        ? req.files.map(
            (file) =>
              `${req.protocol}://${req.get("host")}/images/${file.filename}`
          )
        : [];

      const product = await Products.create({
        ...req.body,
        // categoryId: req.admin._id,
        adminId: req.admin._id,
        urls,
        info: JSON.parse(req.body.info),
      });

      res.status(201).json({
        msg: "Product is created",
        variant: "success",
        payload: product,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        msg: "Server error",
        variant: "error",
        payload: null,
      });
    }
  }
  async update(req, res) {
    try {
      const { id } = req.params;
      let product = await Products.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json({
        msg: "product updated",
        variant: "success",
        payload: product,
      });
    } catch (err) {
      res.status(500).json({
        msg: err.message,
        variant: "error",
        payload: null,
      });
    }
  }
  async delete(req, res) {
    try {
      const { id } = req.params;
      const existProduct = await Products.findById(id);

      if (!existProduct) {
        return res.status(400).json({
          msg: "Product is not defined",
          variant: "warning",
          payload: null,
        });
      }
      existProduct?.urls?.forEach((el) => {
        let name = el.split("/").slice(-1)[0];
        const filePath = path.join("files", name);
        fs.unlinkSync(filePath);
      });

      await Products.findByIdAndDelete(id);
      res.status(200).json({
        msg: "Product is deleted",
        variant: "success",
        payload: existProduct,
      });
    } catch {
      res.status(500).json({
        msg: "Server error",
        variant: "error",
        payload: null,
      });
    }
  }
}

export default new ProductsController();
