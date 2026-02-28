import {
    CategoriesCollection
} from "../models/category.js";

export const getAllCategoriesService = async () => {
    return await CategoriesCollection.find();
};