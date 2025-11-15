import mongoose from "mongoose";

export const connectDB = async ()=>{
    await mongoose.connect("mongodb+srv://rajpalrajwara2001_db_user:Coder2001@cluster0.9mkmljk.mongodb.net/food-delivery").then(()=>{
        console.log("DB Connected");
    });
};
