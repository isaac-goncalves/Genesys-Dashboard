import React, { Component } from 'react'
import StatusBox from './StatusBox'
import Chart from './Chart';
import './Dashboard.css'
import { Box, Card, CardContent } from '@mui/material'



export default class Dashboard extends Component {

    constructor(props) {
        super(props)
        this.state = {
            items: [],
            isLoaded: true,
            Edge0PreviousStatuscode: 'ACTIVE',
            Edge1PreviousStatuscode: 'ACTIVE',
            Edge2PreviousStatuscode: 'ACTIVE',
            Trunk0InboundCalls: [0, 0, 0, 0, 0],
            Trunk1InboundCalls: [0, 0, 0, 0, 0],
            Trunk2InboundCalls: [0, 0, 0, 0, 0],
            TimeData: [0, 0, 0, 0, 0]
        };
    }

    componentDidMount() {
        this.loadData()
        setInterval(this.loadData, 5000);
    }

    loadData = () => {

        // fetch(`http://localhost:4000/get_edge_status`, {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         // 'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization, ININ-Client-Path',
        //         // 'Access-Control-Allow-Origin': 'https://api.mypurecloud.com',
        //         // 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH'
        //     }
        // })
        //     .then(res => {
        //         if (res.ok) {
        //             return res.json();
        //         } else {
        //             throw Error(res.statusText);
        //         }
        //     })
        //     .then(jsonResponse => {
        //         console.log("-*-----------------------")
        //         console.log(jsonResponse);
        //         this.setState({
        //             isLoaded: true,
        //             items: jsonResponse.json.items.entities,
        //             Trunk0InboundCalls: jsonResponse.json.Trunk0InboundCalls,
        //             Trunk1InboundCalls: jsonResponse.json.Trunk1InboundCalls,
        //             Trunk2InboundCalls: jsonResponse.json.Trunk2InboundCalls,
        //             TimeData: jsonResponse.json.TimeData
        //         })
        //     })
    }


    render() {

        var { isLoaded, items, Trunk0InboundCalls, Trunk1InboundCalls, Trunk2InboundCalls, TimeData } = this.state;
        console.log("-------------------------")
        console.log(items)
        console.log(Trunk0InboundCalls)
        console.log(Trunk1InboundCalls)
        console.log(Trunk2InboundCalls)
        if (!isLoaded) {
            return <div>Loadinggg...</div>
        }
        else {
            return (
                <div className='App'>
                    <div className='grid-container'>
                        <Box sx={{width: 1}} className='grid-item StatusBox'>
                            <ul>
                                {this.state.items.map(items => (
                                    <li key={items.id}>
                                        <StatusBox name={items.name} statusCode={items.statusCode} />
                                    </li>
                                ))}
                            </ul>
                        </Box>
                        <Box className='grid-item Chart' >
                            <Card sx={{ maxWidth: 878 }}>
                                <CardContent>
                                    <Chart
                                        trunk0data={Trunk0InboundCalls}
                                        trunk1data={Trunk1InboundCalls}
                                        trunk2data={Trunk2InboundCalls}
                                        TimeData={TimeData}
                                    />
                                </CardContent>
                            </Card>
                        </Box>
                    </div>
                </div>
            )
        }
    }
}
