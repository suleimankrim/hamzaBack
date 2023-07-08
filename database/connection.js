
import mongoose from "mongoose";
import {MongoClient} from "mongodb";
async function connect(){
   const client =new MongoClient ('mongodb://localhost:27017/test')

   return client;
}
export default connect;