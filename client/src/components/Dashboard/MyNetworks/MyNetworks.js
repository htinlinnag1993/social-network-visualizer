import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import M from 'materialize-css/dist/js/materialize.min.js';
// import { withRouter, Redirect } from 'react-router-dom';
// import { bindActionCreators } from 'redux';
import { fetchGeneralNetworks, deleteGeneralNetwork } from '../../../actions';

class MyNetworks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        };
        var helpGuides;
        // console.log(this.props.generalNetworks);
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        this.fetchNetworks();
        // Initialize Tooltip for help guide of the app
        this.helpGuides = document.querySelectorAll('#date-time-format-help-guide-1, #date-time-format-help-guide-2');
        M.Tooltip.init(this.helpGuides, );
    }

    addHelpGuideData = () => {
        var string =    "<p>MM-DD-YYYY, HH:MM:SS</p>";
        return string;
    }

    fetchNetworks = () => {
        // var url = '/api/my-general-networks';
        // const res = await axios.get(url);
        // console.log(res.data);
        this.props.fetchGeneralNetworks();
        this.setState({
            isLoading: false
        });
    }

    formatDateNTime = (dateNTime) => {
        dateNTime = new Date(dateNTime); 
        let formattedDateNTime = (dateNTime.getMonth() + 1) + "-" + dateNTime.getDate() + "-" + dateNTime.getFullYear() 
                                    + ", " 
                                    + dateNTime.getHours() + ":" + dateNTime.getMinutes() + ":" + dateNTime.getSeconds();
        return formattedDateNTime;                          
    }
    onNetworkNameClick = (id, name) => {
        if (this.props.auth) {
            const newName = name.replace(/\s/g, '');
            this.props.history.push(`/mynetworks/${newName}`);
            console.log(id);
            console.log(newName);
        } else alert('Log in to access.');
        
    }

    onDeleteNetwork = (id) => {
        try {
            this.props.deleteGeneralNetwork(id, this.props.generalNetworks);
            // this.props.fetchGeneralNetworks();
        } catch (error) {
            if (error.response) {
                /*
                 * The request was made and the server responded with a
                 * status code that falls out of the range of 2xx
                 */
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                /*
                 * The request was made but no response was received, `error.request`
                 * is an instance of XMLHttpRequest in the browser and an instance
                 * of http.ClientRequest in Node.js
                 */
                console.log(error.request);
            } else {
                // Something happened in setting up the request and triggered an Error
                console.log('Error', error.message);
            }
            console.log(error);
        }
    
    }

    render() {
        const { isLoading } = this.state;
        return  (
            <div className="white-text">
                <br/>
                <div>
                    <Link to="/network/new" className="btn waves-effect waves-light teal darken-2 white-text">
                        <i className="material-icons right">add</i>
                        New
                    </Link>
                </div>
                <table className="highlight responsive-table">
                    <thead>
                    <tr className="teal-text">
                        <th>Name</th>
                        <th>Description</th>
                        <th>Nodes</th>
                        <th>Links</th>
                        <th>
                            Last Updated
                            <a id="date-time-format-help-guide-1" className="black teal-text tooltipped"
                                data-html="true" 
                                data-position="top" 
                                data-tooltip={this.addHelpGuideData()}
                                style={{ margin: '5px' }}
                            >
                                <i className="material-icons tiny">help</i>
                            </a>
                        </th>
                        <th>
                            Created On
                            <a id="date-time-format-help-guide-2" className="black teal-text tooltipped"
                                data-html="true" 
                                data-position="top" 
                                data-tooltip={this.addHelpGuideData()}
                                style={{ margin: '5px' }}
                            >
                                <i className="material-icons tiny">help</i>
                            </a>    
                        </th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                        {this.props.auth && this.props.generalNetworks.length > 0 && this.props.generalNetworks.map((element, i) => (
                            <tr key={i}>
                                {/* className="hoverable" onClick={() => this.onNetworkNameClick(element._id, element.name)} */}
                                <td>
                                    {/* <a href="#" className="hoverable white-text"
                                        onClick={() => this.onNetworkNameClick(element._id)}> */}
                                    <Link to={() => {
                                                const newName = element.name.replace(/\s/g, '-');
                                                return `/mynetworks/${newName}`;
                                            }}
                                        className="white-text">
                                            {element.name}
                                    </Link>
                                    {/* </a> */}
                                </td>
                                <td>{element.description}</td>
                                <td>{element.numOfNodes}</td>
                                <td>{element.numOfLinks}</td>
                                <td>{this.formatDateNTime(element.lastUpdated.toString())}</td>
                                <td>{this.formatDateNTime(element.createdOn.toString())}</td>
                                <td className="center black"><button className="btn black teal-text center" onClick={() => this.onDeleteNetwork(element._id) }><i className="material-icons">delete_forever</i></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {isLoading && this.props.auth &&
                    <div className="center">
                        <p>Loading ...</p>
                    </div>
                }
                {!this.props.auth && 
                    <div className="center">
                        <p>Log in to access</p>
                    </div>
                }
            </div>
        );
    }
}

// function mapStateToProps(state) {
//     return { auth: state.auth };
// }

function mapStateToProps({ auth, generalNetworks }) {
    return { auth, generalNetworks };
}


// export default connect(mapStateToProps)(withRouter(MyNetworks));
export default connect(
    mapStateToProps, 
    { fetchGeneralNetworks, deleteGeneralNetwork }
)(MyNetworks);