/*
 * Utilities for Categories, collections and products pages.
 * **** They must to be PURE functions ****
 */

export const getCategoryIdFromSlug = (categories, slug) => {
    const category = categories.find(c => c.slug === slug);
    return category ? category.idCategory : null;
};

/**
 * Get a database of categories and an ID of category and return the slug of that category
 * @param categories - array
 * @param idCategory - int
 */
export const getCategorySlugFromId = (categories, idCategory) => categories.find(cat => cat.idCategory === idCategory).slug;

/**
 * Get a database of collections and a slug of a collection and return the ID of that collection
 * @param collections
 * @param slug
 * @returns {*}
 */
export const getCollectionIdFromSlug = (collections, slug) => {
    const collection = collections.find(c => c.slug === slug);
    return collection ? collection.idCollection : null;
};

export const getProductIdFromSlug = (products, slug) => {
    const product = products.find(p => p.slug === slug);
    return product ? product.idProduct : null;
};

export const getCollectionByIdCollection = (collections, idCollection) => collections.find(c => c.idCollection === idCollection) || {};

export const getCollectionsByIdCategory = (collections, idCategory, isArchived = false) => collections.filter(c => c.idCategory === idCategory && c.isArchived === isArchived);

export const getFirstCollectionOfCategory = (collections, idCategory) => {
    const collection = collections.find(c => c.idCategory === idCategory);
    return collection ? collection.idCollection : null;
};

/**
 * Return the array of products of a specific collection
 * @param products - array of all products
 * @param idCollection - id of the collection
 */
export const getProductsByIdCollection = (products, idCollection) => products.filter(p => p.idCollection === idCollection) || [];

export const getProductByIdProduct = (products, idProduct) => products.find(p => p.idProduct === idProduct) || {};

export const getGallery = (galleries, idGallery) => galleries.find(g => g.idGallery === idGallery) || {};

export const getPicById = (pics, idPic) => pics.find(p => p.idPic === idPic) || {};

export const getProductsFromIdArray = (products, arrayOfId) => {
    const prods = [];
    arrayOfId.map(id => {
        const prod = products.find(p => p.idProduct === parseInt(id, 10));
        if (typeof id !== 'undefined' && typeof prod !== 'undefined') {
            prods.push(prod);
        }
    });
    return prods;
};


