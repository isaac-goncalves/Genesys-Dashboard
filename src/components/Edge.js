import React, { Component } from 'react'
import StatusBox from './StatusBox';
import { Buffer } from 'buffer';

export default class Edge extends Component {

    constructor(props) {
        super(props)
        this.state = {
            items: [], //Eu quero colocar o Objeto do Json Aqui
            isLoaded: true,
        };
        this.componentDidMount.bind(this); //NSEI me falaram pra colocar um bind com a função que vai usar o this
    }

    componentDidMount() {

        const clientId = '01116766-51c1-46b7-95f1-adff32b85374';
        const clientSecret = 'BJZCipWwlMrvasBSn6e44jPYC0CYC6N76Vcp7f4tO4M';
        const environment = 'mypurecloud.com'


        console.log(clientId, clientSecret, environment);
        console.log(`Basic ${Buffer.from(clientId + ':' + clientSecret).toString('base64')}`);
        console.log(`Basic ${Buffer.from(clientId + ':' + clientSecret).toString('base64')}`);
        console.log(`https://login.${environment}/oauth/token`);

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
                    this.setState({ // essa parte aqui esse setState nao Vai nao sei como bota ele no contexto do state la de cima ta ligado
                        isLoaded: true,
                        items: jsonResponse.entities
                    })
                    console.log(this.state.items.entities)
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
