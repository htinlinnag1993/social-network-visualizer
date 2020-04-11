import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import M from 'materialize-css/dist/js/materialize.min.js';
import MyNetworks from './MyNetworks';
import MyNodes from './MyNodes';
import MyLinks from './MyLinks';

class Dashboard extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        var el = document.querySelector('.tabs');
        var instance = M.Tabs.init(el, {});
    }

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
                    <div>
                        {/* <h4>{this.props.auth.displayName}</h4> */}
                        <div>
                            
                        </div>
                    </div>
                );
        }
    }

    render() {
        return  (
            <div className="container white-text">
                {this.renderDashboard()}
                <div style={{ paddingTop: "5px"}}>
                    <div>
                        <ul className="tabs black">
                            <li id="tab-1" className="tab">
                                <a href="#my-networks" className="black white-text">
                                    Networks
                                </a>
                            </li>
                            <li id="tab-2" className="tab">
                                <a href="#my-nodes" className="black white-text">
                                    Nodes
                                </a>
                            </li>
                            <li id="tab-3" className="tab">
                                <a href="#my-links" className="black white-text">
                                    Links
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div id="my-networks" class="col s12">
                        {/* <h4>Networks</h4> */}
                        <MyNetworks />
                    </div>
                    <div id="my-nodes" class="col s12">
                        {/* <h4>Profile</h4> */}
                        <MyNodes />
                    </div>
                    <div id="my-links" class="col s12">
                        {/* <h4>Profile</h4> */}
                        <MyLinks />
                    </div>
                </div>
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