const express = require("express");
const cors = require("cors");
var jwt = require("jsonwebtoken");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 7000;

//middleware
app.use(cors());
app.use(express.json());
const env = process.env;



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${env.DB_USER}:${env.DB_PASS}@cluster0.bwilrcc.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const productCollection =client.db('emajohnDb').collection('products');

app.get('/products', async(req,res)=>{
  const page = parseInt(req.query.page);
  const size = parseInt(req.query.size);

  console.log('pagination query', page, size);
  const result = await productCollection.find()
  .skip(page * size)
  .limit(size)
  .toArray();
  res.send(result);
})
app.post('/productByIds', async(req, res) =>{
  const ids = req.body;
  const idsWithObjectId = ids.map(id => new ObjectId(id))
  const query = {
    _id: {
      $in: idsWithObjectId
    }
  }
  const result = await productCollection.find(query).toArray();
  res.send(result)
})
app.get('/totalProducts', async(req,res)=>{
  const result = await productCollection.estimatedDocumentCount();
  res.send({total_products: result});
})
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   
  }
}
run().catch(console.dir);


 app.get('/', (req,res)=>{
    res.send('ema and john is getting ready for shopping')
 })
 app.listen( port ,()=>{
    console.log(`ema john is runnig on port ${port}`)
 })

 

