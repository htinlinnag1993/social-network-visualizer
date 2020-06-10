import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class EditNetwork extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="white-text">
                EditNetwork
            </div>
        );
    }
}

function mapStateToProps({ auth }) {
    return { auth };
}

export default connect(mapStateToProps)(EditNetwork);