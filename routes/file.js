const router=require('express').Router()
const multer=require('multer')
const path=require('path')
const File=require('../models/file')
const {v4:uuid4}=require('uuid')


//we have to create a disks storage

let storage=multer.diskStorage({

    destination:(request,file,cb)=>cb(null,'uploads/'),
    filename:(request,file,cb)=>{
        const uniqueName=`${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`

        //56465-564546.jpg
        cb(null,uniqueName)

    }

})

let upload =multer({
    storage:storage,
    limit:{filesSize:1000000*100}
}).single('myfile')

router.post('/',(request,res)=>{

    
    //2.store file
    upload(request,res,async(error)=>{
        //1. validate request

    if(!request.file){
        return res.json({error:'All fields are required'})

    }
        if(error){
            return res.status(500).send({error:error.message})
        }

         //store into database
         const file=new File({

            filename:request.file.filename,
            uuid:uuid4(),
            path:request.file.path,
            size:request.file.size
         })

         const response= await file.save()
         return res.json({file:`${process.env.APP_BASE_URL}/files/${response.uuid}`})
         //http://localhost:3000/files/bhjhdbjc1232e3bn
    })
   
    //response->link

})

router.post('/send',async (req,res)=>{
    //object destructuring
    const {uuid,emailTo,emailFrom}=req.body
    //validate request
    if(!uuid||!emailTo||!emailFrom){

        return res.status(422).send({error:'All fields are required'})
    }


    //get data from database

    const file=await File.findOne({uuid:uuid})
    if(file.sender){
        return res.status(422).send({error:'EMail already send'})
    }

    file.sender=emailFrom
    file.receiver=emailTo
    const response =await file.save
    //send email

    const sendMail=require('../services/emailService')
    sendMail({
        from:emailFrom,
        to:emailTo,
        subject:'InShare file sharing',
        text:`${emailFrom}  shared a file with you`,
        html:require('../services/emailTemplate')({
            emailFrom:emailFrom,
            downloadLink:`${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size:parseInt(file.size/1000) + ' KB',
            expires:'24 hours'
        })
    })
    return res.send({success:true})



})



module.exports=router
