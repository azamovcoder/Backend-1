import AdminController from "../controller/admin.js";
import CategoryController from "../controller/category.js";
import ProductsController from "../controller/product.js";
import { auth } from "../middleware/auth.js";
import express from "express";
import { files } from "../middleware/files.js";

const router = express.Router();

// Admin
router.get("/admins", [auth], AdminController.getAllAdmins);
router.post("/sign-up", AdminController.singUp);
router.post("/sign-in", AdminController.signIn);
router.post("/profile", [auth], AdminController.getProfile);
router.get("/admins/:id", [auth], AdminController.getOneAdmin);
router.delete("/admins/:id", [auth], AdminController.delete);
router.patch("/admins/:id", AdminController.update);

// Product
router.get("/products", ProductsController.get);
router.get("/product/:id", ProductsController.getProduct);
router.get(
  "/products/category/:categoryId",
  [auth],
  ProductsController.getByCategory
);

router.post(
  "/product",
  [auth, files.array("photos")],
  ProductsController.create
);
router.patch("/product/:id", ProductsController.update);
router.delete("/product/:id", ProductsController.delete);

// Category
router.get("/category", CategoryController.get);
router.post("/category", [auth], CategoryController.create);
router.delete("/category/:id", [auth], CategoryController.delete);
router.patch("/category/:id", [auth], CategoryController.update);

export default router;
