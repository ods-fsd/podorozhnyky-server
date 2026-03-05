import {
    CategoriesCollection
} from '../db/models/category.js';

const parseCategory = async (category) => {
    if (typeof category !== 'string') return undefined;

    const foundCategory = await CategoriesCollection.findOne({
        name: category
    });

    return foundCategory ? foundCategory._id : undefined;
};

export const parseFilterParams = async (query) => {
    const {
        category
    } = query;

    const parsedCategory = await parseCategory(category);

    return {
        ...(parsedCategory !== undefined && {
            category: parsedCategory
        }),
    };
};