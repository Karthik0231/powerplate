const express=require("express")
const app=express();
app.use(express.json())
const cors=require('cors')

const connectToMongo=require("./DB.js")
connectToMongo()

app.use(cors())

const port=8000;
app.listen(port,()=>{
    console.log("................................")
    console.log("Server is running on port,"+port)
})

//customer
app.use("/customer", require("./Router/CustomerRoute"));
app.use("/uploads/customer", express.static("./uploads/customer"));
// app.use("/uploads/customer/getImage", express.static("./uploads/admin"));

//admin
app.use("/admin", require("./Router/AdminRoute"));
app.use("/uploads", express.static("./uploads"));

//nutritionist
app.use("/nutritionist", require("./Router/NutritionistRoute"));
app.use("/uploads/nutritionist", express.static("./uploads/nutritionist"));
