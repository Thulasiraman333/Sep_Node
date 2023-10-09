const express = require('express');
const app = express();
const {MongoClient, ObjectId}= require('mongodb');
const mongourl = "mongodb://127.0.0.1:27017";
const client= new MongoClient(mongourl);
const cors = require('cors');
const bodyparser = require('body-parser');
const port = process.env.PORT || 7710;
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json')
//connecting mongo
async function main(){
  await client.connect();
}
// connnecting db 
const collection = client.db('nareshproject1').collection('dashboard');

app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());
app.use(cors());

app.get('/health',(req,res)=>{
  res.send('Health ok');
});

//swagger
app.use('/api-doc', swaggerUi.serve,swaggerUi.setup(swaggerDocument));

// add user
app.post('/adduser',async(req,res)=>{
  await collection.insertOne(req.body);
  res.send('User Added');
});

//get user

app.get('/users',async(req,res)=>{
  let output = [];
  let query = {};

  if(req.query.city && req.query.role){
    query={
      city:req.query.city,
      role:req.query.role,
      isActive:true
    }
  }else if(req.query.city){
    query={
      city:req.query.city,
      isActive:true
    }
  }else if(req.query.role){
    query={
      role:req.query.role,
      isActive:true
    }
  }else if(req.query.isActive){
    let isActive = req.query.isActive;
    if(isActive == "false"){
      isActive = false;
    }else{
      isActive = true
    }
    query={isActive};
  }else{
    query={isActive:true}
  }

  const cursor = collection.find(query);
  for await (const data of cursor){
    output.push(data);
  } 
  cursor.closed;
  res.send(output);
})

//get particular user
app.get('/user/:id',async(req,res) => {
  const output = [];
  let query = {_id:new ObjectId(req.params.id)}
  const cursor = collection.find(query);
  for await(const data of cursor){
      output.push(data)
  }
  cursor.closed;
  res.send(output);
})

//update user
app.put('/updateuser',async(res,req)=>{
  await collection.updateOne(
    {_id: new ObjectId(req.body.id)},
    {
      $set:{
        role:req.body.role,
        name:req.body.name,
        city:req.body.city,
        phone:req.body.phone,
        isActive:true
      }
    }
  )
  res.send('Record updated successfully');
})

//delete user

app.delete('/deleteuser', async(req,res)=>{
  await collection.deleteOne(
    {_id: new ObjectId(req.body.id)}
    )
    res.send('Record deleted successfully')
});

//soft delete (deactivate)
app.put('/deactivateUser',async(req,res) => {
    await collection.updateOne(
        {_id: new ObjectId(req.body._id)},
        {
            $set:{
                isActive:false

            }
        }
    )
    res.send(`User Deactivated`);
})



//soft delete activate user
app.put('/activateUser',async(req,res) => {
  await collection.updateOne(
      {_id: new ObjectId(req.body._id)},
      {
          $set:{
              isActive:true

          }
      }
  )
  res.send(`User Activated`);
})


app.listen(port, ()=>{
  main(),
  console.log(`server running on port ${port}`);
})