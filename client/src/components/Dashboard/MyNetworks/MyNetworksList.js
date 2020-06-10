import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';

class MyNetworks extends Component {
    constructor(props) {
    }

    render() {
        return  (
            <div></div>
        );
    }
}

function mapStateToProps({ auth }) {
    return { auth };
}

export default connect(mapStateToProps)(MyNetworksList);