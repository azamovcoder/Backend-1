import { Products, validateProduct } from "../modules/productSchema.js";

class ProductsController {
  async get(req, res) {
    try {
      const product = await Products.find().sort({ createdAt: -1 });
      if (!product.length) {
        return res.status(400).json({
          msg: "Products is not defined",
          variant: "error",
          payload: null,
        });
      }
      res.status(200).json({
        msg: "All product",
        variant: "success",
        payload: product,
      });
    } catch {
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
              `${req.protocol}://${req.get("host")}/upload/${file.filename}`
          )
        : [];

      const product = await Products.create({
        ...req.body,
        categoryId: req.admin._id,
        adminId: req.admin._id,
        urls,
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
}

export default new ProductsController();
