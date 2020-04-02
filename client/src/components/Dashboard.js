import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Dashboard extends Component {
    renderDashboard() {
        switch (this.props.auth) {
            case null:
                return ;
            case false:
                return (
                    <h4>Hi, please sign in to see your dashboard.</h4>
                );
            default:
                return (
                    <h4>Hi, {this.props.auth.displayName}</h4>
                );
        }
    }

    render() {
        return  (
            <div className="container white-text">
                {this.renderDashboard()}
            </div>
        )
    }
}

// function mapStateToProps(state) {
//     return { auth: state.auth };
// }

function mapStateToProps({ auth }) {
    return { auth };
}

export default connect(mapStateToProps)(Dashboard);