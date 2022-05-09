import React, { Component } from 'react'
import StatusBox from './StatusBox';
import { Buffer } from 'buffer';
import Chart from './Chart';
import './Edge.css'



export default class Edge extends Component {

    constructor(props) {
        super(props)
        this.state = {
            items: [],
            isLoaded: true,
            Edge0PreviousStatuscode: 'ACTIVE',
            Edge1PreviousStatuscode: 'ACTIVE',
            Edge2PreviousStatuscode: 'ACTIVE',
            Trunk0InboundCalls: [0,0,0,0,0],
            Trunk1InboundCalls: [0,0,0,0,0],
            Trunk2InboundCalls: [0,0,0,0,0],
            TimeData: [0,0,0,0,0]
        };
    }

    componentDidMount() {
        this.loadData()
        setInterval(this.loadData, 10000);
    }


    loadData = () => {
        // const clientId = process.env.REACT_APP_GENESYS_CLOUD_CLIENT_ID;
        // const clientSecret = process.env.REACT_APP_GENESYS_CLOUD_CLIENT_SECRET;
        // const environment = process.env.REACT_APP_GENESYS_CLOUD_ENVIRONMENT;

        const clientId = '01116766-51c1-46b7-95f1-adff32b85374';
        const clientSecret = 'BJZCipWwlMrvasBSn6e44jPYC0CYC6N76Vcp7f4tO4M';
        const environment = 'mypurecloud.com'

        var today = new Date();
        var date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var hours = today.getHours();
        var day = today.getDay();
        console.log('hora ' + hours + ' dia ' + day)
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
                console.log(jsonResponse);
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
                    console.log(jsonResponse)
                    console.log('New.Val: ' + jsonResponse.entities[0].statusCode)
                    console.log('New.Val: ' + jsonResponse.entities[1].statusCode)
                    console.log('New.Val: ' + jsonResponse.entities[2].statusCode)
                    console.log('Prev.Val: ' + this.state.Edge0PreviousStatuscode)
                    console.log('Prev.Val: ' + this.state.Edge1PreviousStatuscode)
                    console.log('Prev.Val: ' + this.state.Edge2PreviousStatuscode)
                    //  Parte compara se houve mudança de estado e chama função email -------------------------------------------------------------------------
                    if (jsonResponse.entities[0].statusCode !== this.state.Edge0PreviousStatuscode) {
                        sendEmail(
                            jsonResponse.entities[0].name,
                            jsonResponse.entities[0].id,
                            this.state.Edge0PreviousStatuscode,
                            jsonResponse.entities[0].statusCode,
                            dateTime
                        )
                        console.log('Problem detected on ' + jsonResponse.entities[0].name)
                    }
                    if (jsonResponse.entities[1].statusCode !== this.state.Edge1PreviousStatuscode) {
                        sendEmail(
                            jsonResponse.entities[1].name,
                            jsonResponse.entities[1].id,
                            this.state.Edge1PreviousStatuscode,
                            jsonResponse.entities[1].statusCode,
                            dateTime
                        )
                        console.log('Problem detected on ' + jsonResponse.entities[1].name)
                    }
                    if (jsonResponse.entities[2].statusCode !== this.state.Edge2PreviousStatuscode) {
                        sendEmail(
                            jsonResponse.entities[2].name,
                            jsonResponse.entities[2].id,
                            this.state.Edge2PreviousStatuscode,
                            jsonResponse.entities[2].statusCode,
                            dateTime
                        )
                        console.log('Problem detected on ' + jsonResponse.entities[2].name)
                    }

                    else {
                        console.log('No Failure detected')
                    }

                    //  Parte compara se houve mudança de estado e chama função email -------------------------------------------------------------------------
                    function sendEmail(
                        edge_name,
                        edge_id,
                        edge_state,
                        edge_actual,
                        edge_date) {


                        const edgeParams = {
                            edge_name: edge_name,
                            edge_id: edge_id,
                            edge_state: edge_state,
                            edge_actual: edge_actual,
                            edge_date: edge_date
                        }
                        console.log('Email Enviado')
                        console.log(edgeParams)
                        fetch("http://localhost:4000/send_mail_edges", {

                            // Adding method type
                            method: "POST",

                            // Adding body or contents to sen
                            // Adding headers to the request
                            headers: {
                                "Content-type": "application/json; charset=UTF-8"
                            }, body: JSON.stringify(edgeParams)
                        })
                        //   axios.post("http://localhost:4000/send_mail"), {edge_name}
                    }
                    this.setState({
                        isLoaded: true,
                        items: jsonResponse.entities,
                        Edge0PreviousStatuscode: jsonResponse.entities[0].statusCode,
                        Edge1PreviousStatuscode: jsonResponse.entities[1].statusCode,
                        Edge2PreviousStatuscode: jsonResponse.entities[2].statusCode
                    })
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
                    console.log('Trunk New.Val: ' + jsonResponse[0].calls.inboundCallCount)
                    console.log('Trunk New.Val: ' + jsonResponse[1].calls.inboundCallCount)
                    console.log('Trunk New.Val: ' + jsonResponse[2].calls.inboundCallCount)
                    console.log('Trunk -----------------------------')
                    console.log('Trunk Prev.Val: ' + this.state.Trunk0InboundCalls)
                    console.log('Trunk Prev.Val: ' + this.state.Trunk1InboundCalls)
                    console.log('Trunk Prev.Val: ' + this.state.Trunk2InboundCalls)
                    console.log('Time Data: ' + this.state.TimeData)
                    console.log('Trunk -----------------------------')
                    // //  Parte compara se houve mudança de estado e chama função email -------------------------------------------------------------------------
                    if (hours >= 8 && hours < 20 && day >= 1 && day <= 6) {
                        console.log('hoje é dia de semana')
                        if (jsonResponse[0].calls.inboundCallCount < 2 && jsonResponse[1].calls.inboundCallCount < 2 && jsonResponse[2].calls.inboundCallCount < 2) {
                            sendEmail(
                                jsonResponse[0].calls.inboundCallCount,
                                jsonResponse[1].calls.inboundCallCount,
                                jsonResponse[2].calls.inboundCallCount,
                                dateTime
                            )
                            console.log('Problema detectado no numero de ligaçoes')
                        }
                        else {
                            console.log('Nenhum problema no numero de ligaçoes')
                        }
                    } else {
                        console.log("Hoje é fim de semana ou esta fora de horário")
                    }
                    // //  Parte compara se houve mudança de estado e chama função email -------------------------------------------------------------------------
                    function sendEmail(
                        trunk0_calls,
                        trunk1_calls,
                        trunk2_calls,
                        date
                    ) {


                        const trunkParams = {
                            trunk0_calls: trunk0_calls,
                            trunk1_calls: trunk1_calls,
                            trunk2_calls: trunk2_calls,
                            date: date
                        }
                        console.log('Email Enviado')
                        console.log(trunkParams)
                        fetch("http://localhost:4000/send_mail_trunks", {
                            method: "POST",
                            headers: {
                                "Content-type": "application/json; charset=UTF-8"
                            }, body: JSON.stringify(trunkParams)
                        })
                    }


                    this.setState({
                        isLoaded: true,
                        Trunk0InboundCalls: [...this.state.Trunk0InboundCalls, jsonResponse[0].calls.inboundCallCount],
                        Trunk1InboundCalls: [...this.state.Trunk1InboundCalls, jsonResponse[1].calls.inboundCallCount],
                        Trunk2InboundCalls: [...this.state.Trunk2InboundCalls, jsonResponse[2].calls.inboundCallCount],
                        TimeData: [...this.state.TimeData, time]
                    })
                })
                .catch(e => console.error(e));
        }
    }
    // -------------------------------------------------------------------------
    render() {


        var { isLoaded, items, Trunk0InboundCalls, Trunk1InboundCalls, Trunk2InboundCalls, TimeData } = this.state;
        console.log(Trunk0InboundCalls)
        console.log(Trunk1InboundCalls)
        console.log(Trunk2InboundCalls)
        if (!isLoaded) {
            return <div>Loadinggg...</div>
        }
        else {
            return (
                <div className='App'>
                    <h1 className='Header'>Monitoramento Genesys</h1>
                    <div className='grid-container'>
                        <div className='grid-item StatusBox'>
                            <ul>
                                {this.state.items.map(items => (
                                    <li key={items.id}>
                                        <StatusBox name={items.name} statusCode={items.statusCode} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className='grid-item'>
                            <Chart 
                            trunk0data={Trunk0InboundCalls} 
                            trunk1data={Trunk1InboundCalls} 
                            trunk2data={Trunk2InboundCalls}
                            TimeData={TimeData}
                             />
                        </div>
                    </div>
                </div>
            )
        }
    }
}
