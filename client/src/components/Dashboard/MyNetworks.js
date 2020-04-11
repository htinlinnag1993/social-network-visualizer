import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class MyNetworks extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return  (
            <div className="white-text">
                <br/>
                <div>
                    <Link to="/new/network" className="btn waves-effect waves-light teal darken-2 white-text">
                        <i class="material-icons right">add</i>
                        New
                    </Link>
                </div>
                <table className="highlight responsive-table">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Nodes</th>
                        <th>Links</th>
                        <th>Last Updated</th>
                        <th>Created On</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>GOT</td>
                        <td>Game of Thrones</td>
                        <td>50</td>
                        <td>250</td>
                        <td>04/08/2020</td>
                        <td>04/08/2020</td>
                    </tr>
                    <tr>
                        <td>GOT</td>
                        <td>Game of Thrones</td>
                        <td>50</td>
                        <td>250</td>
                        <td>04/08/2020</td>
                        <td>04/08/2020</td>
                    </tr>
                    <tr>
                        <td>GOT</td>
                        <td>Game of Thrones</td>
                        <td>50</td>
                        <td>250</td>
                        <td>04/08/2020</td>
                        <td>04/08/2020</td>
                    </tr>
                    </tbody>
                </table>
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

export default connect(mapStateToProps)(MyNetworks);