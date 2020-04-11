import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class MyProfile extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return  (
            <div className="container white-text">
                <p>My Profile</p>
            </div>
        );
    }
}

// function mapStateToProps(state) {
//     return { auth: state.auth };
// }

function mapStateToProps({ auth }) {
    return { auth };
}

export default connect(mapStateToProps)(MyProfile);