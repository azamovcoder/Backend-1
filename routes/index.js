import AdminController from "../controller/admin.js";
import CategoryController from "../controller/category.js";
import ProductsController from "../controller/product.js";
import { auth } from "../middleware/auth.js";
import express from "express";
import { files } from "../middleware/files.js";

const router = express.Router();

// Admin
router.get("/get/admins", [auth], AdminController.getAllAdmins);
router.post("/sign-up", AdminController.singUp);
router.post("/sign-in", AdminController.signIn);
router.post("/get/profile", [auth], AdminController.getProfile);
router.get("/get/admins/:id", [auth], AdminController.getOneAdmin);
router.delete("/delete/admins/:id", [auth], AdminController.delete);
router.patch("/update/admins/:id", AdminController.update);

// Product
router.get("/get/products", ProductsController.get);
router.get("/get/product/:id", ProductsController.getProduct);
router.get(
  "/get/products/category/:categoryId",
  [auth],
  ProductsController.getByCategory
);

router.post(
  "/create/product",
  [auth, files.array("photos")],
  ProductsController.create
);
router.patch("/update/product/:id", ProductsController.update);
router.delete("/delete/product/:id", ProductsController.delete);

// Category
router.get("/get/category", CategoryController.get);
router.post("/create/category", [auth], CategoryController.create);
router.delete("/delete/category/:id", [auth], CategoryController.delete);
router.patch("/update/category/:id", [auth], CategoryController.update);

export default router;
