import React from 'react'
import PropTypes from 'prop-types'
import './StatusBox.css'

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
        <div className='status-box'>
            <p className='status-name'> {props.name} </p>
            <p className='status-id'>{props.id}</p>
            <p className={'status-state ' + (active ? 'status-active' : 'status-failure')}> {capitalizeFirstLetter(props.statusCode)}</p>
        </div>
    )
}

StatusBox.propTypes = {}

export default StatusBox
