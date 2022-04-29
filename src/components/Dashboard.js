import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Buffer } from 'buffer';


function Dashboard(props) {

    const [data, setData] = useState([]);

    useEffect(() => {
        getToken();
    }, []);

    async function getToken() {
        const clientId = '01116766-51c1-46b7-95f1-adff32b85374';
        const clientSecret = 'BJZCipWwlMrvasBSn6e44jPYC0CYC6N76Vcp7f4tO4M';
        const environment = 'mypurecloud.com'

        const res = await fetch(`https://login.mypurecloud.com/oauth/token?grant_type=client_credentials`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${Buffer.from(clientId + ':' + clientSecret).toString('base64')}`
            }
        })
            // 'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization, ININ-Client-Path',
            // 'Access-Control-Allow-Origin': 'https://api.mypurecloud.com',
            // 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH'

            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw Error(res.statusText);
                }
            })
            .then(jsonResponse => {
                console.log(jsonResponse);
                handleTokenCallback(jsonResponse)

            })

    }
    async function handleTokenCallback(body){
       const res = await fetch(`https://api.mypurecloud.com/api/v2/telephony/providers/edges?pageNumber=1`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${body.token_type} ${body.access_token}`
            }
        }).then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw Error(res.statusText);
            }
        })
            .then(jsonResponse => {
                console.log(jsonResponse)
                funcaosetdata(jsonResponse)
            })
            .catch(e => console.error(e));
    }
   const funcaosetdata = (json) => {
        setData(json)
        console.log(data.entities)
    }
    console.log(data.entities)


    return (

        <div>
           
        </div>
    
        )
}

Dashboard.propTypes = {}

export default Dashboard
