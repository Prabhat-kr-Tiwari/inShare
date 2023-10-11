const express=require('express')
const path=require('path')


const app=express()


const PORT=process.env.PORT||3000
app.use(express.static('public'))
app.use(express.json())
const connectDB=require('./config/db')
connectDB()
//template engine
app.set('views',path.join(__dirname,'/views'))
app.set('view engine','ejs')

//Routes
app.use('/api/files',require('./routes/file'))
app.use('/files',require('./routes/show'))
app.use('/files/download',require('./routes/download'))

app.listen(PORT,(request,response)=>{
    console.log(`Server is listening on ${PORT}`)

})