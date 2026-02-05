const express=require('express');

const app=express();

app.use("/hi",(req,res)=>{
    res.send('Hello World');
});
app.use("/bye",(req,res)=>{
    res.send('Goodbye World');
}
app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});

