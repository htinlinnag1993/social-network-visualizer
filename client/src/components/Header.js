import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import M from 'materialize-css/dist/js/materialize.min.js';

class Header extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        // M.AutoInit();
        var elems = document.querySelectorAll('.dropdown-trigger');
        var instances = M.Dropdown.init(elems, {
                            closeOnClick: true,
                            constrainWidth: false,
                            coverTrigger: false,
                            belowOrigin: true,
                            alignment: 'left',
                            inDuration: 300, 
                            outDuration: 225
                        });
    }
    renderLoginStatus() {
        switch (this.props.auth) {
            case null:
                return ;
            case false:
                return (
                    <li key="2">
                        <a href="/auth/google" style={{ paddingLeft: '2px' }}>
                            <div class="center-align">
                                <img width="45px" style={{ marginTop: '-11px', marginRight: '12px'}} alt="Google sign-in"  src="/resources/images/Google_Official_Button.png" className="left" />
                                Sign in with Google
                            </div>
                        </a>
                    </li>
                );
            default:
                return [
                    <li key="2" className="hoverable">
                        <a href="/profile" style={{ padding: 0 }}>
                            <div style={{
                                margin: 0,
                                boxShadow: 'none',
                                padding: '24px'
                            }}>
                                <div className="card-content">
                                    <div className="card-title">
                                        <i className="material-icons center" style={{ fontSize: '30px' }}>account_circle</i>
                                        <div className="center" style={{ wordWrap: 'break-word' }}>{this.props.auth.displayName}</div>
                                    </div>
                                    <div className="divider" style={{ marginTop: '5px', marginBottom: '5px' }}></div>
                                    <div className="card-action">
                                        <div className="center" style={{ wordWrap: 'break-word' }}>Credits: {this.props.auth.credits}</div>
                                        <div className="center" style={{ wordWrap: 'break-word' }}>{this.props.auth.email}</div>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </li>,
                    <li key="3" className="divider"></li>,
                    <li key="4" className="hoverable">
                        <a href="/dashboard"><i className="material-icons left" style={{ marginRight: '45px' }}>dashboard</i>Dashboard</a>
                    </li>,
                    <li key="5" className="divider"></li>,
                    <li key="6" className="hoverable">
                        <a href="/api/logout"><i className="material-icons left" style={{ marginRight: '60px' }}>lock</i>Logout</a>
                    </li>,
                ];
        }
    }
 
    render() {
        console.log(this.props);
        return (
            <header>
                <ul id="dropdown1" className="dropdown-content">
                    {this.renderLoginStatus()}       
                </ul>
                <nav>
                    <div className="nav-wrapper teal darken-2">
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
                                    <li key="1" className="hoverable">
                                        <a href="/demo">Try It</a>
                                    </li>
                                    <li key="2" className="hoverable">
                                        <a className="dropdown-trigger" id="nav-dropdown-trigger" href="#" data-target="dropdown1">
                                            <i className="small material-icons left" style={{margin: 0}}>account_circle</i>
                                        </a>
                                    </li>
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