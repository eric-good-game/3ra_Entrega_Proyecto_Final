import { Router } from "express";
import ApiController from "../controllers/api";
import isAuth from "../middleware/isAuth";

const router = Router();

// router.get("/", (req, res) => {
//     res.send("Hello World!");
// });
router
    .get("/products", ApiController.getAllProducts)
    .post("/products", ApiController.create)
    .get("/authors", ApiController.getAllAuthors)
    .get("/genres", ApiController.getAllGenres)
    .post("/order", isAuth, ApiController.order)

export default router;