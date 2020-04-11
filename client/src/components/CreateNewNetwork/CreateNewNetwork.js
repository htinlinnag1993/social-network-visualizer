import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class CreateNewNetwork extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return  (
            <div className="container center white-text">
                <div style={{ marginTop: '100px', marginBottom: '50px' }}>
                    <h4>How would you like to create the new network?</h4>
                </div>
                <div className="container">
                    <div style={{ 
                        marginTop: '25px', marginBottom: '35px', 
                        marginLeft: '2px', marginRight: '2px',
                        borderBottomStyle: 'solid', borderBottomColor: 'grey' 
                    }}>
                        <div style={{ marginBottom: '25px' }}>
                            <Link to="/new/network/fileupload" className="btn-large center teal darken-2 white-text">
                                <div>
                                    <span>JSON File Upload</span>
                                    <i className="material-icons right">file_upload</i>
                                </div>
                            </Link>
                        </div>
                        <div style={{ marginTop: '25px', marginBottom: '35px' }}>
                            <p>Upload a JSON file containing all nodes & links data.</p>
                        </div>
                    </div>
                    <div style={{ 
                        marginTop: '35px', marginBottom: '100px', 
                        marginLeft: '2px', marginRight: '2px'
                    }}>
                        <div style={{ marginBottom: '25px' }}>
                            <Link to="/new/network" className="btn-large center teal darken-2 white-text">
                                <span>Node by Node</span>
                                <i className="material-icons right">create</i>
                            </Link>
                        </div>
                        <div style={{ marginTop: '25px', marginBottom: '25px' }}>
                            <p>Manually create every node & link.</p>
                        </div>
                    </div>
                </div>
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

export default connect(mapStateToProps)(CreateNewNetwork);