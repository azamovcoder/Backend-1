import { Products, validateProduct } from "../modules/productSchema.js";

class ProductsController {
  async get(req, res) {
    try {
      const product = await Products.find()
        .populate([{ path: "adminId", select: ["fname", "lname"] }])
        .sort({ createdAt: -1 });
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
  async getCategory(req, res) {
    try {
      let { categoryId } = req.params;

      const product = await Products.find({ categoryId })
        .populate([
          { path: "adminId", select: ["fname", "lname"] },
          { path: "categoryId", select: ["title"] },
        ])
        .sort({ createdAt: -1 });
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
}

export default new ProductsController();
