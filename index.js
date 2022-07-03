const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;
const app = express();


// middleware 
app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h0m7hgr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const furnitureCollection = client.db('furnitureInventory').collection('furniture')
        const stockCollection = client.db('furnitureInventory').collection('stock');

        app.get('/furniture', async(req,res) =>{
            const query ={};
            const cursor = furnitureCollection.find(query);
            const furnitures = await cursor.toArray();

            res.send(furnitures);

        })

        app.get('/furniture/:id', async(req, res) =>{
            const id = req.params.id;
            const query={_id: ObjectId(id)};
            const furnitures = await furnitureCollection.findOne(query);
            res.send(furnitures);
        });
         // POST
         app.post('/furniture', async(req, res) =>{
            const newService = req.body;
            const result = await furnitureCollection.insertOne(newService);
            res.send(result);
        });
         // Put
         app.put('/furniture/:serviceId', async(req, res) =>{
            const query={_id: ObjectId(req.params.serviceId)};
            const count = req.body.quantity 
            const options = { upsert: true }
            const updatedProduct = {
                $set: {
                    quantity: count
                }
            }
            const result = await furnitureCollection.updateOne(query,updatedProduct , options)
            res.send(result)
           
        });
        
        // DELETE
        app.delete('/furniture/:serviceId', async(req, res) =>{
            let id = req.params.serviceId;
            const query = {_id: ObjectId(id)};
            const result = await furnitureCollection.deleteOne(query);
            res.send(result);
        });

        // stock item
    app.post('/stock', async (req, res) => {
        const stock = req.body;
        const result = await stockCollection.insertOne(stock);
        res.send(result);
      })
      app.get('/stock', async(req,res) =>{
        const query ={};
        const cursor = stockCollection.find(query);
        const stock = await cursor.toArray();

        res.send(stock);

    })
       
      app.get('/stock', async (req, res) => {
        const email = req.query.email;
        const query = { email: email };
        const cursor = stockCollection.find(query);
        const item = await cursor.toArray();
        res.send(item);
      })
      app.get('/stock', async(req,res) =>{
        const query ={};
        const cursor = stockCollection.find(query);
        const stock = await cursor.toArray();

        res.send(stock);

    })
 
  // delete stock
      app.delete('/stock/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) }
        const result = await stockCollection.deleteOne(query);
        res.send(result);
      })
  
        

    }
    finally{}
}
run().catch(console.dir);




app.get('/',(req,res) =>{
    res.send('Furniture will be commming soons!!!')


})

app.listen(port,() =>{
    console.log ('Furniture  is running on port',port)

})
