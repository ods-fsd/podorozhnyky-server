import {
    Router
} from "express";
import {
    getCategoriesController
} from "../controllers/categories.js";
import {
    ctrlWrapper
} from "../utils/ctrlWrapper.js";

const categoriesRouter = Router();

categoriesRouter.get("/", ctrlWrapper(getCategoriesController));

export default categoriesRouter;