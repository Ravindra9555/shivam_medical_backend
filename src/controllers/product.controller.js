import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { cloudinayUpload } from "../utils/cloudnary.js";
import { Product } from "../models/product.model.js";

const addproduct = AsyncHandler(async (req, res) => {
  const {
    name,
    mrp,
    price,
    quantity,
    description,
    discount,
    category,
    priceAfterDiscount,
    type,
    isListed
  } = req.body;
  if (!name || !mrp || !description || !priceAfterDiscount) {
    throw new ApiError(400, " Please fill all required fields  ");
  }

  let imageurl;
  if (req.file) {
    const uploadResponse = await cloudinayUpload(req.file.path);
    imageurl = uploadResponse.url;
  }
  let discountedPrice;
  if (discount && discount > 0) {
    discountedPrice = mrp - (mrp * discount) / 100;
  }

  const newProduct = new Product({
    name,
    mrp,
    price: discountedPrice,
    quantity,
    description,
    discount,
    category,
    priceAfterDiscount,
    type,
    isListed,
    image: imageurl,
  });
  const savedProduct = await newProduct.save();
  if (!savedProduct) {
    throw new ApiError(500, "Failed to add product");
  }
  res
    .status(201)
    .json(new ApiResponse(201, "Product added successfully", savedProduct));
});

const getAllProducts = AsyncHandler(async (req, res) => {
    const { page, limit } = req.body;
  
    // Check if page and limit are provided
    if (!page) {
      throw new ApiError(404, "Page number is required");
    }
  
    const pageNo = parseInt(page) || 1;
    const ProductLimit = parseInt(limit) || 20;
  
    // Avoid division by zero if limit is 0
    if (ProductLimit <= 0) {
      throw new ApiError(400, "Limit must be greater than 0");
    }
  
    const skip = (pageNo - 1) * ProductLimit;
  
    // Fetch paginated products
    const products = await Product.find({}).skip(skip).limit(ProductLimit);
  
    // Check if no products are found
    if (products.length === 0) {
      throw new ApiError(404, "No products found");
    }
  
    // Calculate total number of products and pages
    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / ProductLimit); // Ensure limit is not 0
  
    // Pagination information
    const pagination = {
      totalProducts: totalProducts,
      totalPages: totalPages,
      currentPage: pageNo,
      limit: ProductLimit,
    };
  
    // Send response
    res
      .status(200)
      .json(new ApiResponse(200, "All products", { products, pagination }));
  });
  
const getAllProductsIsListed = AsyncHandler(async (req, res) => {
    const { page, limit } = req.body;
  
    // Check if page and limit are provided
    if (!page) {
      throw new ApiError(404, "Page number is required");
    }
  
    const pageNo = parseInt(page) || 1;
    const ProductLimit = parseInt(limit) || 20;
  
    // Avoid division by zero if limit is 0
    if (ProductLimit <= 0) {
      throw new ApiError(400, "Limit must be greater than 0");
    }
  
    const skip = (pageNo - 1) * ProductLimit;
  
    // Fetch paginated products
    const products = await Product.find({isListed: true}).skip(skip).limit(ProductLimit);
  
    // Check if no products are found
    if (products.length === 0) {
      throw new ApiError(404, "No products found");
    }
  
    // Calculate total number of products and pages
    const totalProducts = await Product.countDocuments({isListed: true});
    const totalPages = Math.ceil(totalProducts / ProductLimit); // Ensure limit is not 0
  
    // Pagination information
    const pagination = {
      totalProducts: totalProducts,
      totalPages: totalPages,
      currentPage: pageNo,
      limit: ProductLimit,
    };
  
    // Send response
    res
      .status(200)
      .json(new ApiResponse(200, "All products", { products, pagination }));
  });
  
  const searchproduct = AsyncHandler(async (req, res) => {
    const { searchkey } = req.params;
  
    // Check if search key is provided
    if (!searchkey) {
      throw new ApiError(400, "Search Key is required");
    }
  
    // Create a filter object for keyword search
    const filter = { name: { $regex: `^${searchkey}`, $options: "i" } };
  
    // Fetch paginated products with condition
    const products = await Product.find(filter).limit(20);
  
    // Check if no products are found
    if (products.length === 0) {
      throw new ApiError(404, "No products found");
    }
  
    // Send response
    res.status(200).json(new ApiResponse(200, "Filtered products by keyword", products));
  });
  
  



  export { addproduct, getAllProducts , getAllProductsIsListed, searchproduct};
  