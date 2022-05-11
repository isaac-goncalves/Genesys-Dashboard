import React from 'react'
import PropTypes from 'prop-types'
import './StatusBox.css'
import { Box, CardContent, Typography, Card } from '@mui/material';


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function StatusBox(props) {
    var active
    function checkActive() {

        if (props.statusCode == 'ACTIVE') {
            active = true
        }
        else active = false;
    }
    checkActive()

    return (

        <Card sx={{ maxWidth: 220, minWidth: 220, color:'Secondary' }}  className='status-box'>
            <CardContent>
            <Typography sx={{ fontSize: 30 }}className='status-name'> {props.name} </Typography>
            <Typography sx={{  fontSize: 35, fontWeight: 600 }} className={'status-state ' + (active ? 'status-active' : 'status-failure')}> {capitalizeFirstLetter(props.statusCode)}</Typography>
            </CardContent>
        </Card>
        
    )
}

StatusBox.propTypes = {}

export default StatusBox
