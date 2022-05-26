
const nodemailer = require('nodemailer')
const express = require('express')
const app = express()
const fetch = require('node-fetch');
require('dotenv').config();

var state = {
    items: [],
    JsonEdge: [],
    Edge0PreviousStatuscode: 'ACTIVE',
    Edge1PreviousStatuscode: 'ACTIVE',
    Edge2PreviousStatuscode: 'ACTIVE',
};
var state2 = {
    items: [],
    sendMailtrigger: 5,
    Trunk0InboundCalls: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    Trunk1InboundCalls: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    Trunk2InboundCalls: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    TimeData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
};
global.issueReported = false;

const bodyParser = require("body-parser")
const cors = require("cors")
var jsonParser = bodyParser.json()

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/get_edge_status", async (req, res) => {
    res.json({
        json: {
            items: state.JsonEdge,
            Trunk0InboundCalls: state2.Trunk0InboundCalls,
            Trunk1InboundCalls: state2.Trunk1InboundCalls,
            Trunk2InboundCalls: state2.Trunk2InboundCalls,
            TimeData: state2.TimeData,
        }
    })
})

app.listen(4000,
    () => {
        console.log("server is listening on port 4000")
    }
)

function callApi() {
    const clientId = process.env.REACT_APP_GENESYS_CLOUD_CLIENT_ID;
    const clientSecret = process.env.REACT_APP_GENESYS_CLOUD_CLIENT_SECRET;
    const environment = process.env.REACT_APP_GENESYS_CLOUD_ENVIRONMENT;
    console.log(process.env.REACT_APP_GENESYS_CLOUD_ENVIRONMENT)
    // const clientId = '01116766-51c1-46b7-95f1-adff32b85374';
    // const clientSecret = 'BJZCipWwlMrvasBSn6e44jPYC0CYC6N76Vcp7f4tO4M';
    // const environment = 'mypurecloud.com'

    var today = new Date();
    var date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var hours = today.getHours();
    var day = today.getDay();
    console.log('Hora: ' + hours)
    console.log('Dia da semana: ' + day)
    var dateTime = time + ' do dia ' + date;

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');

    //  Parte que pega o token -------------------------------------------------------------------------

    fetch(`https://login.mypurecloud.com/oauth/token?grant_type=client_credentials`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${Buffer.from(clientId + ':' + clientSecret).toString('base64')}`,
            // 'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization, ININ-Client-Path',
            // 'Access-Control-Allow-Origin': 'https://api.mypurecloud.com',
            // 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH'
        }
    })
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw Error(res.statusText);
            }
        })
        .then(jsonResponse => {
            // console.log(jsonResponse);
            getEdges(jsonResponse);
            getTrunks(jsonResponse);
        })
        .catch(e => console.error(e));

    //  parte que faz o GET dos trunks na API -------------------------------------------------------------------------

    const getEdges = (body) => {
        fetch(`https://api.${environment}/api/v2/telephony/providers/edges?pageNumber=1`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${body.token_type} ${body.access_token}`
            }
        }).then(res => {
            return res.json();
        })
            .then(jsonResponse => {
                // console.log(jsonResponse)
                console.log('Edge -----------------------------')
                console.log('New.Val: ' + jsonResponse.entities[0].statusCode)
                console.log('New.Val: ' + jsonResponse.entities[1].statusCode)
                console.log('New.Val: ' + jsonResponse.entities[2].statusCode)
                console.log('Edge -----------------------------')
                console.log('Prev.Val: ' + state.Edge0PreviousStatuscode)
                console.log('Prev.Val: ' + state.Edge1PreviousStatuscode)
                console.log('Prev.Val: ' + state.Edge2PreviousStatuscode)
                //  Parte compara se houve mudança de estado e chama função email -------------------------------------------------------------------------
                if (jsonResponse.entities[0].statusCode !== state.Edge0PreviousStatuscode) {
                    sendEmail(
                        jsonResponse.entities[0].name,
                        jsonResponse.entities[0].id,
                        state.Edge0PreviousStatuscode,
                        jsonResponse.entities[0].statusCode,
                        dateTime
                    )
                    console.log('Problem detected on ' + jsonResponse.entities[0].name)
                }
                if (jsonResponse.entities[1].statusCode !== state.Edge1PreviousStatuscode) {
                    sendEmail(
                        jsonResponse.entities[1].name,
                        jsonResponse.entities[1].id,
                        state.Edge1PreviousStatuscode,
                        jsonResponse.entities[1].statusCode,
                        dateTime
                    )
                    console.log('Problem detected on ' + jsonResponse.entities[1].name)
                }
                if (jsonResponse.entities[2].statusCode !== state.Edge2PreviousStatuscode) {
                    sendEmail(
                        jsonResponse.entities[2].name,
                        jsonResponse.entities[2].id,
                        state.Edge2PreviousStatuscode,
                        jsonResponse.entities[2].statusCode,
                        dateTime
                    )
                    console.log('Problem detected on ' + jsonResponse.entities[2].name)
                }

                else {
                    console.log('==================================')
                    console.log('Nenhum problema detectado nos EDGE')
                    console.log('==================================')
                }

                //  Parte compara se houve mudança de estado e chama função email -------------------------------------------------------------------------
                async function sendEmail(
                    edge_name,
                    edge_id,
                    edge_state,
                    edge_actual,
                    edge_date) {

                    console.log('Email Enviado!')
                    const smtpTransport = nodemailer.createTransport({
                        host: '156.147.1.150',
                        port: 25,
                        auth: {
                            user: '',
                            pass: ''
                        }
                    })

                    await smtpTransport.sendMail({
                        from: 'genesys-monitoring@lge.com',
                        to: 'isaac.goncalves1@lgcns.com; isaac.correia.2406@gmail.com; isaac.goncalves@lgepartner.com',
                        subject: '[Problema] Mudança de estado Genesys Edge',
                        text: 'teste de email',
                        html: `<p style='margin-right:0cm;margin-left:0cm;font-size:15px;font-family:"Calibri",sans-serif;margin:0cm;margin-bottom:.0001pt;'>O Status do Servidor Edge: <strong><span style='font-family:"Calibri",sans-serif;'>${edge_name}&nbsp;</span></strong></p>
                        <p style='margin-right:0cm;margin-left:0cm;font-size:15px;font-family:"Calibri",sans-serif;margin:0cm;margin-bottom:.0001pt;'><strong><span style="font-size:15px;">&nbsp;</span></strong></p>
                        <p style='margin-right:0cm;margin-left:0cm;font-size:15px;font-family:"Calibri",sans-serif;margin:0cm;margin-bottom:.0001pt;'>Edge ID: ${edge_id}</p>
                        <p style='margin-right:0cm;margin-left:0cm;font-size:15px;font-family:"Calibri",sans-serif;margin:0cm;margin-bottom:.0001pt;'><strong><span style="font-size:15px;">&nbsp;</span></strong></p>
                        <p style='margin-right:0cm;margin-left:0cm;font-size:15px;font-family:"Calibri",sans-serif;margin:0cm;margin-bottom:.0001pt;'>Foi alterado de: <strong><span style='font-family:"Calibri",sans-serif;'>${edge_state}</span></strong></p>
                        <p style='margin-right:0cm;margin-left:0cm;font-size:15px;font-family:"Calibri",sans-serif;margin:0cm;margin-bottom:.0001pt;'><strong><span style="font-size:15px;">&nbsp;</span></strong></p>
                        <p style='margin-right:0cm;margin-left:0cm;font-size:15px;font-family:"Calibri",sans-serif;margin:0cm;margin-bottom:.0001pt;'>Para: <strong><span style='font-family:"Calibri",sans-serif;'>${edge_actual}</span></strong></p>
                        <p style='margin-right:0cm;margin-left:0cm;font-size:15px;font-family:"Calibri",sans-serif;margin:0cm;margin-bottom:.0001pt;'><strong><span style="font-size:15px;">&nbsp;</span></strong></p>
                        <p style='margin-right:0cm;margin-left:0cm;font-size:15px;font-family:"Calibri",sans-serif;margin:0cm;margin-bottom:.0001pt;'>Altera&ccedil;&atilde;o detectada &agrave;s: <strong>${edge_date}</strong></p><strong>
                        <img src="data:image/png;base64,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"></p>
                        <p><br></p>`
                    })
                }
                state = {
                    JsonEdge: jsonResponse,
                    isLoaded: true,
                    items: jsonResponse.entities,
                    Edge0PreviousStatuscode: jsonResponse.entities[0].statusCode,
                    Edge1PreviousStatuscode: jsonResponse.entities[1].statusCode,
                    Edge2PreviousStatuscode: jsonResponse.entities[2].statusCode
                }
            })
            .catch(e => console.error(e));
    }
    const getTrunks = (body) => {
        fetch(`https://api.${environment}/api/v2/telephony/providers/edges/trunks/metrics?trunkIds=4f6fddb1-cf7e-4319-a506-da68d3f0d470%2Ceaefb7ac-794a-4396-9351-1fdf60a6c178%2C5baae059-b903-42ac-9d7a-e61b869513ff`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${body.token_type} ${body.access_token}`
            }
        }).then(res => {
            return res.json();
        })
            .then(jsonResponse => {
                console.log('Trunk -----------------------------')
                console.log('New.Val: ' + jsonResponse[0].calls.inboundCallCount)
                console.log('New.Val: ' + jsonResponse[1].calls.inboundCallCount)
                console.log('New.Val: ' + jsonResponse[2].calls.inboundCallCount)
                console.log('Trunk -----------------------------')
                console.log('Prev.Val: ' + state2.Trunk0InboundCalls)
                console.log('Prev.Val: ' + state2.Trunk1InboundCalls)
                console.log('Prev.Val: ' + state2.Trunk2InboundCalls)
                console.log('Time Data: ' + state2.TimeData)
                console.log("Reported = " + issueReported)
                // //  Parte compara se houve mudança de estado e chama função email -------------------------------------------------------------------------
                if (hours >= 8 && hours < 20 && day >= 1 && day <= 6) {
                    console.log('hoje é dia de semana')
                    if (jsonResponse[0].calls.inboundCallCount <= 2 &&
                        jsonResponse[1].calls.inboundCallCount <= 2 &&
                        jsonResponse[2].calls.inboundCallCount <= 2 &&
                        issueReported == false) {
                        sendEmailIssue(
                            jsonResponse[0].calls.inboundCallCount,
                            jsonResponse[1].calls.inboundCallCount,
                            jsonResponse[2].calls.inboundCallCount,
                            dateTime
                        )
                        issueReported = true
                        console.log('==================================')
                        console.log('Problema detectado no numero de ligaçôes!')
                        console.log('==================================')
                    }
                    else
                        if (jsonResponse[0].calls.inboundCallCount > 2 &&
                            jsonResponse[1].calls.inboundCallCount > 2 &&
                            jsonResponse[2].calls.inboundCallCount > 2 &&
                            issueReported == true) {
                            sendEmailReSolved(
                                jsonResponse[0].calls.inboundCallCount,
                                jsonResponse[1].calls.inboundCallCount,
                                jsonResponse[2].calls.inboundCallCount,
                                dateTime
                            )
                            issueReported = false;
                            console.log('==================================')
                            console.log('Problema no numero de ligaçôes Foi Resolvido!')
                            console.log('==================================')
                        }
                        else
                            if (jsonResponse[0].calls.inboundCallCount <= 2 &&
                                jsonResponse[1].calls.inboundCallCount <= 2 &&
                                jsonResponse[2].calls.inboundCallCount <= 2 &&
                                issueReported == true) {
                                console.log('==================================')
                                console.log('Problema detectado no numero de ligaçôes e e-mail enviado!')
                                console.log('==================================')
                            }
                            else
                                if (jsonResponse[0].calls.inboundCallCount > 2 &&
                                    jsonResponse[1].calls.inboundCallCount > 2 &&
                                    jsonResponse[2].calls.inboundCallCount > 2 &&
                                    issueReported == false) {
                                    console.log('==================================')
                                    console.log('Nenhum problema no numero de ligaçôes')
                                    console.log('==================================')
                                }
                } else {
                    console.log('==================================')
                    console.log("Hoje é fim de semana ou está fora de horário")
                    console.log('==================================')

                }
                state2 = {
                    JsonTrunks: jsonResponse,
                    Trunk0InboundCalls: [...state2.Trunk0InboundCalls, jsonResponse[0].calls.inboundCallCount].slice(Math.max([...state2.Trunk0InboundCalls, jsonResponse[0].calls.inboundCallCount].length - 20, 0)),
                    Trunk1InboundCalls: [...state2.Trunk1InboundCalls, jsonResponse[1].calls.inboundCallCount].slice(Math.max([...state2.Trunk1InboundCalls, jsonResponse[1].calls.inboundCallCount].length - 20, 0)),
                    Trunk2InboundCalls: [...state2.Trunk2InboundCalls, jsonResponse[2].calls.inboundCallCount].slice(Math.max([...state2.Trunk2InboundCalls, jsonResponse[2].calls.inboundCallCount].length - 20, 0)),
                    TimeData: [...state2.TimeData, time].slice(Math.max([...state2.TimeData, time].length - 20, 0))
                }
                // //  Parte compara se houve mudança de estado e chama função email -------------------------------------------------------------------------
                async function sendEmailIssue(
                    trunk0_calls,
                    trunk1_calls,
                    trunk2_calls,
                    date
                ) {
                    console.log('Email Enviado!')
                    const smtpTransport = nodemailer.createTransport({
                        host: '156.147.1.150',
                        port: 25,
                        auth: {
                            user: '',
                            pass: ''
                        }
                    })
                    await smtpTransport.sendMail({
                        from: 'genesys-monitoring@lge.com',
                        to: 'isaac.goncalves1@lgcns.com;',
                        subject: '[Problema] Baixo volume de ligações em horário de trabalho',
                        text: 'teste de email',
                        html: `<p style='margin-right:0cm;margin-left:0cm;font-size:15px;font-family:"Calibri",sans-serif;margin:0cm;margin-bottom:.0001pt;'><span style="font-size:15px;">Foi detectado <strong><span style='font-family:"Calibri",sans-serif;font-weight:normal;'>um volume baixo de ligações no Trunk durante o hor&aacute;rio de trabalho (de segunda a sexta das 08am as 8pm).</span></strong></span></p>
                        <p style='margin-right:0cm;margin-left:0cm;font-size:15px;font-family:"Calibri",sans-serif;margin:0cm;margin-bottom:.0001pt;'><span style="font-size:15px;">Trunk id: <strong>4f6fddb1-cf7e-4319-a506-da68d3f0d470</strong></span></p>
                        <p style='margin-right:0cm;margin-left:0cm;font-size:15px;font-family:"Calibri",sans-serif;margin:0cm;margin-bottom:.0001pt;'><span style="font-size:15px;">Numero de liga&ccedil;oes: <strong>${trunk0_calls}</strong></span></p>
                        <p style='margin-right:0cm;margin-left:0cm;font-size:15px;font-family:"Calibri",sans-serif;margin:0cm;margin-bottom:.0001pt;'><strong><span style="font-size:15px;">&nbsp;</span></strong></p>
                        <p style='margin-right:0cm;margin-left:0cm;font-size:15px;font-family:"Calibri",sans-serif;margin:0cm;margin-bottom:.0001pt;'><span style="font-size:15px;">Trunk id: <strong>2Ceaefb7ac-794a-4396-9351-1fdf60a6c178</strong></span></p>
                        <p style='margin-right:0cm;margin-left:0cm;font-size:15px;font-family:"Calibri",sans-serif;margin:0cm;margin-bottom:.0001pt;'><span style="font-size:15px;">Numero de liga&ccedil;oes: <strong>${trunk1_calls}</strong></span></p>
                        <p style='margin-right:0cm;margin-left:0cm;font-size:15px;font-family:"Calibri",sans-serif;margin:0cm;margin-bottom:.0001pt;'><strong><span style="font-size:15px;">&nbsp;</span></strong></p>
                        <p style='margin-right:0cm;margin-left:0cm;font-size:15px;font-family:"Calibri",sans-serif;margin:0cm;margin-bottom:.0001pt;'><span style="font-size:15px;">Trunk id: <strong>2C5baae059-b903-42ac-9d7a-e61b869513ff</strong></span></p>
                        <p style='margin-right:0cm;margin-left:0cm;font-size:15px;font-family:"Calibri",sans-serif;margin:0cm;margin-bottom:.0001pt;'><span style="font-size:15px;">Numero de liga&ccedil;oes: <strong>${trunk2_calls}</strong></span></p>
                        <p style='margin-right:0cm;margin-left:0cm;font-size:15px;font-family:"Calibri",sans-serif;margin:0cm;margin-bottom:.0001pt;'><span style="font-size:15px;">&nbsp;</span></p>
                        <p style='margin-right:0cm;margin-left:0cm;font-size:15px;font-family:"Calibri",sans-serif;margin:0cm;margin-bottom:.0001pt;'><span style="font-size:15px;">Detectado &agrave;s: <strong><span style='font-family:"Calibri",sans-serif;'>${date}</span></strong></span></p>
                        <p><img src="data:image/png;base64,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"></p>
                        <p><br></p>`
                    })
                }
                async function sendEmailReSolved(
                    trunk0_calls,
                    trunk1_calls,
                    trunk2_calls,
                    date
                ) {
                    console.log('Email Enviado!')
                    const smtpTransport = nodemailer.createTransport({
                        host: '156.147.1.150',
                        port: 25,
                        auth: {
                            user: '',
                            pass: ''
                        }
                    })
                    await smtpTransport.sendMail({
                        from: 'genesys-monitoring@lge.com',
                        to: 'isaac.goncalves1@lgcns.com;',
                        subject: '[Problema] Resolvido baixo volume de ligações em horário de trabalho',
                        text: 'teste de email',
                        html: `<p style='margin-right:0cm;margin-left:0cm;font-size:15px;font-family:"Calibri",sans-serif;margin:0cm;margin-bottom:.0001pt;'><span style="font-size:15px;">Foi resolvido o problema <strong><span style='font-family:"Calibri",sans-serif;font-weight:normal;'>com o numero de ligações no trunk durante o hor&aacute;rio de trabalho (de segunda a sexta das 08am as 8pm).</span></strong></span></p>
                        <p style='margin-right:0cm;margin-left:0cm;font-size:15px;font-family:"Calibri",sans-serif;margin:0cm;margin-bottom:.0001pt;'><span style="font-size:15px;">Trunk id: <strong>4f6fddb1-cf7e-4319-a506-da68d3f0d470</strong></span></p>
                        <p style='margin-right:0cm;margin-left:0cm;font-size:15px;font-family:"Calibri",sans-serif;margin:0cm;margin-bottom:.0001pt;'><span style="font-size:15px;">Numero de liga&ccedil;oes: <strong>${trunk0_calls}</strong></span></p>
                        <p style='margin-right:0cm;margin-left:0cm;font-size:15px;font-family:"Calibri",sans-serif;margin:0cm;margin-bottom:.0001pt;'><strong><span style="font-size:15px;">&nbsp;</span></strong></p>
                        <p style='margin-right:0cm;margin-left:0cm;font-size:15px;font-family:"Calibri",sans-serif;margin:0cm;margin-bottom:.0001pt;'><span style="font-size:15px;">Trunk id: <strong>2Ceaefb7ac-794a-4396-9351-1fdf60a6c178</strong></span></p>
                        <p style='margin-right:0cm;margin-left:0cm;font-size:15px;font-family:"Calibri",sans-serif;margin:0cm;margin-bottom:.0001pt;'><span style="font-size:15px;">Numero de liga&ccedil;oes: <strong>${trunk1_calls}</strong></span></p>
                        <p style='margin-right:0cm;margin-left:0cm;font-size:15px;font-family:"Calibri",sans-serif;margin:0cm;margin-bottom:.0001pt;'><strong><span style="font-size:15px;">&nbsp;</span></strong></p>
                        <p style='margin-right:0cm;margin-left:0cm;font-size:15px;font-family:"Calibri",sans-serif;margin:0cm;margin-bottom:.0001pt;'><span style="font-size:15px;">Trunk id: <strong>2C5baae059-b903-42ac-9d7a-e61b869513ff</strong></span></p>
                        <p style='margin-right:0cm;margin-left:0cm;font-size:15px;font-family:"Calibri",sans-serif;margin:0cm;margin-bottom:.0001pt;'><span style="font-size:15px;">Numero de liga&ccedil;oes: <strong>${trunk2_calls}</strong></span></p>
                        <p style='margin-right:0cm;margin-left:0cm;font-size:15px;font-family:"Calibri",sans-serif;margin:0cm;margin-bottom:.0001pt;'><span style="font-size:15px;">&nbsp;</span></p>
                        <p style='margin-right:0cm;margin-left:0cm;font-size:15px;font-family:"Calibri",sans-serif;margin:0cm;margin-bottom:.0001pt;'><span style="font-size:15px;">Detectado &agrave;s: <strong><span style='font-family:"Calibri",sans-serif;'>${date}</span></strong></span></p>
                        <p><img src="data:image/png;base64,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"></p>
                        <p><br></p>`
                    })
                }
            })
            .catch(e => console.error(e));
    }
    setTimeout(callApi, 15000)
}

callApi()