//node mailer is used to send a mail is a package which need to be install
//npm install node mailer
const nodemailer=require('nodemailer')
async function sendMail({from,to,subject,text,html}){


    let transporter=nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        port:process.env.SMTP_PORT,
        secure:false,
        auth:{
            user: process.env.MAIL_USER,
            pass:process.env.MAIL_PASS
        }

    })
    let info =await transporter.sendMail({
        from:`inShare<${from}>`,
        to:to,
        subject: subject,
        text:text,
        html:html
    })
    console.log(info)


}
module.exports =sendMail
