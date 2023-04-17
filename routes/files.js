const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const File = require("../models/file");
const {v4: uuid4} = require("uuid");


let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "upload/"),

    filename: (req, file, cb) =>{
        const uniqueName = `${Date.now()} - ${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        cb(null,uniqueName);
    },
});

let upload=multer({
    storage,
    limits: {fileSize: 1000000*100},
}).single("myfile");

router.post("/", (req,res) =>{

    // validate data request

    // store file
    upload(req,res, async (err)=>{
        if(!req.file){
            return res.json({error: "All fields are required!"});
        }
        
        if(err){
            return res.status(500).send({error: err.message});
        }
        // store into database
        const file = new File({
            filename: req.file.filename,
            uuid: uuid4(),
            path: req.file.path,
            size: req.file.size
        });
        const response = await file.save();
        return res.json({file:`${process.env.APP_BASE_URL}/files/${response.uuid}`});
        
    });
});
    // response - create Link

//     router.post("/send",async(req,res) =>{
//         const {uuid,emailTo,emailFrom} = req.body;

//         if(!uuid || !emailTo || !emailFrom){
//             return res.status(422).send({error: "All Fields are required."});
//         }

//         const file = await File.findOne({uuid: uuid});
//         if(file.sender){
//             return res.status(422).send({error: "Files Already sent"});
//         }

//         file.sender = emailFrom;
//         file.receiver = emailTo;

//         const response = await file.save();

//         const sendMail = require("../services/emailServices");
//         sendMail({
//             from: emailFrom,
//             to: emailTo,
//             subject:"File Sharing",
//             text: `${emailFrom} shared a file with you.`,
//             html:require("../services/emailTemplate")({
//                 emailFrom: emailFrom,
//                 downloadLink:`${process.env.APP_BASE_URL}/files/${file.uuid}`,
//                 size: parseInt(file.size/1000) + "kb",
//                 expires: "24 Hours"
//             })
//         })

//     })

//     return res.send({success: "Email sent."});
// });

module.exports = router;