import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Header extends Component {
    renderLoginStatus() {
        switch (this.props.auth) {
            case null:
                return ;
            case false:
                return (
                    <li key="2">
                        <a href="/auth/google">Sign in with Google</a>
                    </li>
                );
            default:
                return [
                    <li key="2">
                        <a href="/dashboard"><i className="small material-icons prefix left" style={{margin: 0}}>account_circle</i></a>
                    </li>,
                    <li key="3">
                        <a href="/api/logout">Logout</a>
                    </li>
                ];
        }
    }

    render() {
        console.log(this.props);
        return (
            <header>
                <nav>
                    <div className="nav-wrapper teal teal darken-2">
                        <div className="row">
                            <div className="col s3">
                                {/* <Link 
                                    to={this.props.auth ? '/dashboard' : '/'}
                                    className="left brand-logo"
                                >
                                        SNV
                                </Link> */}
                                <Link 
                                    to={'/'}
                                    className="left brand-logo"
                                >
                                        SNV
                                </Link>
                            </div>
                            <div className="col s9">
                                <ul className="right">
                                    <li key="1">
                                        <a href="/demo">Try It</a>
                                    </li>
                                    {this.renderLoginStatus()}
                                </ul>
                            </div>
                        </div>
                    </div>    
                </nav>
            </header>
        );
    }
}

// function mapStateToProps(state) {
//     return { auth: state.auth };
// }

function mapStateToProps({ auth }) {
    return { auth };
}

export default connect(mapStateToProps)(Header);