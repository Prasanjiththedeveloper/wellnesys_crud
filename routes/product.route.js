const express = require("express");
const router = new express.Router();

const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');


const Product = require("../models/product.model");
const auth = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: './', 
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = uuidv4() + ext; 
    cb(null, filename);
  }
});

const upload = multer({ storage });

router.post("/api/products", auth, upload.single('product_image') , async (req, res, next) => {
  try {
    const { name , price } = req.body;
    const product_image = req.file.filename; 
    const product = new Product({name , price , product_image});
    await product.save();
    res.status(201).json({
      status: "Success",
      data: product,
      message: "Product Created",
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.get("/api/products", auth, async (req, res, next) => {

  const { page = 1 , limit = 10 , search , filters} = req.query
  const skip = (page-1) * limit

  let query = {}

  if(filters) {
     for(const [key, value] of Object.entries(filters)){
      query[key] = value;
     }
  }

  if(search){
    query = {name:{$regex:search}}
  }
 
  try {
    const totalProducts = await Product.find().countDocuments();
    const products = await Product.find(query).skip(skip).limit(limit);
    if (!products.length) {
      return res.status(404).json({
        status: "Failure",
        data: [],
        message: "No Products! Please Add one",
      });
    }
    res.json({
      status: "Success",
      data: { products, totalProducts },
      message: "Products Fetched ",
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.get("/api/products/:id", auth, async (req, res, next) => {
  try {
    const product = await Product.findById({ _id: req.params.id });
    if (!product) {
      return res.json(404).json({
        status: "Failure",
        data: task,
        message: "Product Not Found",
      });
    }
    res.json({
      status: "Success",
      data: product,
      message: "Product Found",
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.delete("/api/products/:id", auth, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete({ _id: req.params.id });
    if (!product) {
      return res.status(404).json({
        status: "Failure",
        data: product,
        message: "Product Not Found",
      });
    }
    res.json({
      status: "Success",
      data: product,
      message: "Product Deleted",
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.patch("/api/products/:id", auth, async (req, res, next) => {
  const updates = Object.keys(req.body);
  try {
    const product = await Product.findById({ _id: req.params.id });
    if (!product) {
      return res.status(404).json({
        code: 0,
        status: "Failure",
        data: product,
        message: "Product Not Found",
      });
    }
    updates.forEach((update) => {
      product[update] = req.body[update];
    });
    await product.save();
    res.json({
      status: "Success",
      data: product,
      message: "Product Updated",
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;
