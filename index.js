const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

//midleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jfl1bty.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const productsCollection = client.db("beautyHub").collection("products");

    //for best selling products api
    app.get("/best-selling-products/:subcategory", async (req, res) => {
      const subCategory = req.params.subcategory;
      const query = { subCategory: subCategory };
      const subCategoryProducts = await productsCollection
        .find(query)
        .toArray();
      res.send(subCategoryProducts);
    });

    //for new arrival products api
    app.get("/new-arrival-products/:subcategory", async (req, res) => {
      const subCategory = req.params.subcategory;
      const query = { subCategory: subCategory };
      const subCategoryProducts = await productsCollection
        .find(query)
        .toArray();
      res.send(subCategoryProducts);
    });

    //get for only one products
    app.get('/product-details/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const product = await productsCollection.findOne(query);
      res.send(product);
    })

    //for categories products api
    app.get('/categories', async(req, res)=>{
      const query = {};
      const getAllProducts = await productsCollection.find(query).toArray();
      const key = "category";
      const getOnlyCategoryProducts = [...new Map(getAllProducts.map(item => [item[key], item])).values()];
      // console.log(getAllProducts);
      res.send(getOnlyCategoryProducts);
    })
  } finally {
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("beauty hub server is running");
});

app.listen(port, () => {
  console.log(`beauty hub server is running on ${port}`);
});
