import express from "express"
import {db} from "./database/db"
import {dvdrouter} from "./routes/dvd"
import bodyParser from "body-parser"
const app = express(); 
  
  
db.authenticate()
  .then(()=>{ console.log('Database Connected');})
  .catch((err)=>{ console.log('Database not Connected '+err);})

app.use(bodyParser.json())
app.use(dvdrouter)


app.listen(4000,()=>{
    console.log('Port is set on 4000');    
})