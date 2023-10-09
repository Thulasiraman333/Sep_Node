const express = require('express');
const app = express();
const {MongoClient,ObjectId} = require('mongodb');
const mongoUrl = "mongodb://127.0.0.1/27017";
const client = new MongoClient(mongoUrl);
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json')


async function main(){
    await client.connect()
}

const collection = client.db('nareshproject1').collection('dashboard');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 7710;

app.use('/api-doc',swaggerUi.serve,swaggerUi.setup(swaggerDocument))
app.use(express.static(__dirname+'/public'));
app.set('views','./src/views');
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cors())

app.get('/health',(req,res) => {
    res.send('Health ok')
})

app.get('/new',async(req,res)=>{
    res.render('forms')
})

app.get('/',async(req,res) => {
    const output = [];
    const cursor = collection.find();
    for await (const data of cursor){
        output.push(data)
    }
    cursor.closed;
    res.render('index',{data:output})
})

// add User
app.post('/addUser', async(req,res) => {
    let data = {
        name:req.body.name,
        city:req.body.city,
        phone:req.body.phone,
        role:req.body.body?req.body.body:'User',
        isActive:true
    }
    await collection.insertOne(data);
    // res.send('User Added')
    res.redirect('/')
})

//get user
app.get('/users',async(req,res) => {
    let output = [];
    let query = {};
    if(req.query.role && req.query.city){
        query ={
            role:req.query.role,
            city:req.query.city,
            isActive:true
        }
    }else if(req.query.role){
        query ={
            role:req.query.role,
            isActive:true
        }
    }else if(req.query.city){
        query ={
            city:req.query.city,
            isActive:true
        }
    }else if(req.query.isActive){
        let isActive = req.query.isActive;
        if(isActive == "false"){
            isActive = false
        }else{
            isActive = true
        }
        query = {isActive}
    }else{
        query={
            isActive:true
        }
    }

    const cursor = collection.find(query);
    for await(const data of cursor){
        output.push(data)
    }

    cursor.closed;
    res.send(output);
})

//get Particular User
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


//update User
app.put('/updateUser',async(req,res) => {
    await collection.updateOne(
        {_id: new ObjectId(req.body._id)},
        {
            $set:{
                name:req.body.name,
                city:req.body.city,
                role:req.body.role,
                phone:req.body.phone,
                isActive:true

            }
        }
    )
    res.send(`Record Updated`);
})

//delete User
app.delete('/deleteUser',async(req,res) => {
    await collection.deleteOne({
        _id: new ObjectId(req.body._id)
    })
    res.send(`Record Deleted`);
})


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

//soft delete (deactivate)
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


app.listen(port,() => {
    main()
    console.log(`Server is running on port ${port}`)
})