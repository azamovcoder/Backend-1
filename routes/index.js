import AdminController from "../controller/admin.js";
import CategoryController from "../controller/category.js";
import ProductsController from "../controller/product.js";
import { auth } from "../middleware/auth.js";
import express from "express";

const router = express.Router();

// Admin
router.get("/get/admins", [auth], AdminController.getAllAdmins);
router.post("/sign-up", AdminController.singUp);
router.post("/sign-in", AdminController.signIn);
router.post("/get/profile", [auth], AdminController.getProfile);
router.patch("/update/admins/:id", AdminController.updateAdmin);

// Product
router.get("/get/products", ProductsController.get);
router.post("/create/product", [auth], ProductsController.create);
router.patch("/update/product/:id", ProductsController.update);

// Category
router.get("/get/category", CategoryController.get);
router.post("/create/category", [auth], CategoryController.create);

export default router;
