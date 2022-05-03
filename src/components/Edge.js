import React, { Component } from 'react'
import StatusBox from './StatusBox';
import { Buffer } from 'buffer';
import emailjs from 'emailjs-com';





export default class Edge extends Component {

    constructor(props) {
        super(props)
        this.state = {
            items: [],
            isLoaded: true,
            Edge0PreviousStatuscode: 'TEST',
            Edge1PreviousStatuscode: 'ACTIVE',
            Edge2PreviousStatuscode: 'TEST'
        };
        //NSEI me falaram pra colocar um bind com a função que vai usar o this
    }
    sendEmail(
        edge_name,
        edge_id,
        edge_state,
        edge_actual,
        edge_date,
    ) {
        const YOUR_SERVICE_ID = process.env.REACT_APP_YOUR_PUBLIC_KEY;
        const YOUR_TEMPLATE_ID = process.env.REACT_APP_YOUR_TEMPLATE_ID;
        const YOUR_PUBLIC_KEY = process.env.REACT_APP_YOUR_SERVICE_ID;

        const edgeParams = {
            edge_name: edge_name,
            edge_id: edge_id,
            edge_state: edge_state,
            edge_actual: edge_actual,
            edge_date: edge_date
        };

        emailjs.sendForm(YOUR_SERVICE_ID, YOUR_TEMPLATE_ID, edgeParams, YOUR_PUBLIC_KEY)
            .then((result) => {
                console.log(result.text);
            }, (error) => {
                console.log(error.text);
            });
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
                handleTokenCallback(jsonResponse);

            })
            .catch(e => console.error(e));

        //  parte que faz o GET na API -------------------------------------------------------------------------

        const handleTokenCallback = (body) => {
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
                        fetch("http://localhost:4000/send_mail", {

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

    }
    // -------------------------------------------------------------------------
    render() {

        var { isLoaded, items } = this.state;


        console.log('-----------------------')
        console.log(typeof (items))
        console.log(items)
        console.log('-----------------------')

        if (!isLoaded) {
            return <div>Loadinggg...</div>
        }
        else {
            return (
                <div className='App'>
                    <h1 className='Header'>Monitoramento Genesys</h1>
                    <ul>
                        {this.state.items.map(items => (
                            <li key={items.id}>
                                <StatusBox name={items.name} id={items.id} statusCode={items.statusCode} />
                            </li>
                        ))}
                    </ul>
                </div>
            )
        }
    }
}
