const nodemailer = require("nodemailer");
const Users = require("../../sequelize/models/users");
const moment = require("moment");

const smtpTransport = nodemailer.createTransport({
    host: "156.147.1.150",
    port: 25,
    auth: {
      user: "",
      pass: "",
    },
  });

async function sendMail(userId, datelastlogin) {
    //get from db the email of the user

    // const datelastlogin =  "2022-04-11T11:38:57Z"
    // const userid = "031b8cbc-febb-46d2-b06d-272db4057a0c"

    const user = await Users.findAll({
        where: {
            id: userId
        }
    });
    //compare to se if date is smaller than 30 days
    console.log(user.address);
    console.log(user.name);

    const lastlogin = moment(datelastlogin).format("DD/MM/YYYY HH:mm:ss");
    
    const date = new Date(datelastlogin);
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    console.log(diffDays);
    if (diffDays > 30 && user.license == "cloudCX3" && user.name != "WALLBOARD 1" && user.name != "WALLBOARD 2" && user.name != "WALLBOARD 3" && user.name != "WALLBOARD 4" && user.name != "WALLBOARD 5") {
        //send email
        await smtpTransport.sendMail({
            from: "genesys-monitoring@lge.com",
            to: "isaac.goncalves1@lgcns.com;",
            subject: "[Genesys] Usuário Inativo",
            text: "email",
            html: `<p style='margin-right:0cm;margin-left:0cm;font-size:15px;font-family:"Calibri",sans-serif;margin:0cm;margin-bottom:.0001pt;'>Foi detectado que o usu&aacute;rio: <strong><span style='font-family:"Calibri",sans-serif;'>${user.name},</span></strong></p>
            <p style='margin-right:0cm;margin-left:0cm;font-size:15px;font-family:"Calibri",sans-serif;margin:0cm;margin-bottom:.0001pt;'><br></p>
            <p style='margin-right:0cm;margin-left:0cm;font-size:15px;font-family:"Calibri",sans-serif;margin:0cm;margin-bottom:.0001pt;'><span style='font-family:"Calibri",sans-serif;'>Licen&ccedil;a tipo</span><strong><span style='font-family:"Calibri",sans-serif;'>&nbsp;:&nbsp;</span></strong><strong><span style='font-family:"Calibri",sans-serif;'>${user.license.toUpperCase()},</span></strong></p>
            <p style='margin-right:0cm;margin-left:0cm;font-size:15px;font-family:"Calibri",sans-serif;margin:0cm;margin-bottom:.0001pt;'><br></p>
            <p style='margin-right:0cm;margin-left:0cm;font-size:15px;font-family:"Calibri",sans-serif;margin:0cm;margin-bottom:.0001pt;'><span style='font-family:"Calibri",sans-serif;'><span style='font-family:"Calibri",sans-serif;'>F</span><span style='font-family:"Calibri",sans-serif;'>ez o ultimo login a mais de 30 dias.&nbsp;</span></span></p>
            <p style='margin-right:0cm;margin-left:0cm;font-size:15px;font-family:"Calibri",sans-serif;margin:0cm;margin-bottom:.0001pt;'><br></p>
            <p style='margin-right:0cm;margin-left:0cm;font-size:15px;font-family:"Calibri",sans-serif;margin:0cm;margin-bottom:.0001pt;'><span style='font-family:"Calibri",sans-serif;'><span style='font-family:"Calibri",sans-serif;'>Data do ultimo login:&nbsp;</span></span><strong><span style='font-family:"Calibri",sans-serif;'><strong><span style='font-family:"Calibri",sans-serif;'>&nbsp;${lastlogin},</span></strong></span></strong></p>
            <p style='margin-right:0cm;margin-left:0cm;font-size:15px;font-family:"Calibri",sans-serif;margin:0cm;margin-bottom:.0001pt;'><br></p>
            <p style='margin-right:0cm;margin-left:0cm;font-size:15px;font-family:"Calibri",sans-serif;margin:0cm;margin-bottom:.0001pt;'><span style='font-family:"Calibri",sans-serif;'>O usu&aacute;rio foi comunicado pelo email:</span><strong><span style='font-family:"Calibri",sans-serif;'>&nbsp;${user.address},</span></strong></p>
            <p style='margin-right:0cm;margin-left:0cm;font-size:15px;font-family:"Calibri",sans-serif;margin:0cm;margin-bottom:.0001pt;'><br></p>
            <p style='margin-right:0cm;margin-left:0cm;font-size:15px;font-family:"Calibri",sans-serif;margin:0cm;margin-bottom:.0001pt;'><span style='font-family:"Calibri",sans-serif;'>Gerente respons&aacute;vel</span><strong><span style='font-family:"Calibri",sans-serif;'>:&nbsp;</span></strong><strong><span style='font-family:"Calibri",sans-serif;'>${user.manager},</span></strong></p>
            <p style='margin-right:0cm;margin-left:0cm;font-size:15px;font-family:"Calibri",sans-serif;margin:0cm;margin-bottom:.0001pt;'><br></p>
            <p><strong><img src="data:image/png;base64,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"></strong></p>
            <p><strong><br></strong></p>
            <p><strong><br></strong></p>
            <p><br></p>`,
          });
        console.log("Mail sent to " + user.address)   
    }

}

module.exports = { sendMail }
