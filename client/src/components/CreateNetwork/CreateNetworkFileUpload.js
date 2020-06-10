import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Dropzone from 'react-dropzone';
import M from 'materialize-css/dist/js/materialize.min.js';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
// import * as actions from '../../actions';
import { submitNewNetwork } from '../../actions';

const dropZoneStyle = {
    width: '100%',
    height: '200px',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 5,
    borderRadius: 10,
    borderColor: 'teal',
    borderStyle: 'dashed',
    backgroundColor: 'black',
    transition: 'border .24s ease-in-out'
    // flex: 1,
    // display: 'flex',
    // flexDirection: 'column',
    // color: 'white',
    // outline: 'none',
    // textAlign: 'center',
};

class CreateNetworkFileUpload extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedJSONFiles: [],
            newNetworkName: '',
            newNetworkDescription: '',
            newNodes: [],
            newLinks: [],
            newGraphInAdjList: {},
            newStartingNodeID: null,
            isJSONFileValidNNotEmpty: false
        }

        /** NO need to do the following because I am already using arrow functions to solve the problem */
        // this.onNetworkNameChange = this.onNetworkNameChange.bind(this);
        // this.onNetworkDescriptionChange = this.onNetworkDescriptionChange.bind(this);
        // this.handleFileSelect = this.handleFileSelect.bind(this);
        // this.onDrop = this.onDrop.bind(this);
        // this.remove = this.remove.bind(this);
        // this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        document.getElementById('dropzone-input').addEventListener('change', this.handleFileSelect, false);
        const itemsForCharacterCount = document.querySelectorAll('#network-name-input, #network-description-input');
        M.CharacterCounter.init(itemsForCharacterCount);
    }

    onNetworkNameChange = e => {
        var nameInput = document.getElementById('new-network-name'),
            name = e.target.value;
        if (name)     nameInput.innerHTML = "" + name;
        else          nameInput.innerHTML = "New Network";
        this.setState({ newNetworkName: name });
    }
    onNetworkDescriptionChange = e => {
        var description = e.target.value;
        this.setState({ newNetworkDescription: description });
    }
    onDrop = acceptedFiles => {
        this.setState({
            selectedJSONFiles: acceptedFiles
        });
    }
    onSubmit = (e) => {
        e.preventDefault();
        const newGeneralNetworkObject = {
            name: this.state.newNetworkName,
            description: this.state.newNetworkDescription,
            startingNodeID: this.state.newStartingNodeID,
            // graphInAdjList: this.state.newGraphInAdjList,
            nodes: this.state.newNodes,
            links: this.state.newLinks
        };

        try{
            // axios.post('/api/new-network', newGeneralNetworkObject)
            //     .then(res => {
            //         console.log(res.data)
            //     }).catch(error => {
            //         console.log(error)
            //     });
            // actions.submitNewNetwork(newGeneralNetworkObject, this.props.history);
            this.props.submitNewNetwork(newGeneralNetworkObject, this.props.history);
            const newFiles = this.state.selectedJSONFiles;
            newFiles.splice(newFiles[0], 1);
            this.setState({
                selectedJSONFiles: newFiles,
                newNetworkName: '',
                newNetworkDescription: '',
                newNodes: [],
                newLinks: [],
                newGraphInAdjList: {},
                newStartingNodeID: null,
                isJSONFileValidNNotEmpty: false
            });
            
        } catch (error) {
            console.log(error);
        }
        // this.props.history.push('/dashboard');
    }

    remove = file => {
        const newFiles = this.state.selectedJSONFiles;
        newFiles.splice(file, 1);
        this.setState({
            selectedJSONFiles: newFiles,
            newNodes: [],
            newLinks: [],
            newStartingNodeID: null,
            newGraphInAdjList: {},
            isJSONFileValidNNotEmpty: false
        })
        console.log(this.state);
        console.log(this.state.newGraphInAdjList);
    }
    handleFileSelect = (e) => {
        var files = e.target.files;
        var firstFile = files[0];
        var reader = new FileReader();

        // Closure to capture the file info
        reader.onload = ((theFile) => {
            return (e) => {
                const newNetworkData = JSON.parse(e.target.result);
                this.setState({
                    newNodes: newNetworkData.nodes,
                    newLinks: newNetworkData.links,
                    newStartingNodeID: newNetworkData.startingNodeID,
                    newGraphInAdjList: newNetworkData.graphInAdjList,
                    isJSONFileValidNNotEmpty: true
                });
                console.log(this.state);
                console.log(this.state.newGraphInAdjList);
            }
        })(firstFile);

        reader.readAsText(firstFile);
    }





    
    


    render() {
        return  (
            <div className="container center white-text">
                <div className="container">
                    <h5 id="new-network-name" style={{ marginTop: '50px' }}>New Network</h5>
                    <form onSubmit={this.onSubmit} id="new-network-form" className="col s12">
                        <div className="row">
                            <div className="input-field col s12">
                                <i className="material-icons prefix">label</i>
                                <input  id="network-name-input" 
                                        className="white-text"
                                        type="text"
                                        value={this.state.newNetworkName}
                                        required
                                        data-length="30"
                                        onChange={this.onNetworkNameChange}
                                />
                                <label htmlFor="network-name-input" datae-error="Please enter">Name</label>
                            </div>
                        </div>
                        <div className="row" style={{ marginBottom: '35px' }}>
                            <div className="input-field col s12">
                                <i className="material-icons prefix">description</i>
                                <textarea   id="network-description-input" 
                                            className="white-text materialize-textarea"    
                                            type="text" 
                                            value={this.state.newNetworkDescription}
                                            required  
                                            data-length="200" 
                                            onChange={this.onNetworkDescriptionChange}
                                />
                                <label htmlFor="network-description-input">Description</label>
                            </div>
                        </div>
                        <Dropzone
                            onDrop={this.onDrop}
                            multiple={false}
                            accept='application/json'
                            minSize={0}
                            maxSize={1048576} // 1MB
                        >
                            {({ getRootProps, getInputProps, isDragActive, isDragReject, acceptedFiles, rejectedFiles }) => {
                                    const isFileTooLarge = rejectedFiles.length > 0 && rejectedFiles[0].size > 1048576;
                                    return (
                                    <div className="center">
                                        <div {...getRootProps()} style={dropZoneStyle} className="container"> 
                                            <input {...getInputProps()} id="dropzone-input"/>
                                            { !isDragActive && "Click me or drag a JSON file to upload!" }
                                            { isDragActive && !isDragReject && "Drop it like it's hot!" } 
                                            { isDragReject && "Only .json file type is supported to use to create the network!" }
                                            { isFileTooLarge && (
                                                <div className="white-text">
                                                    File is too large & only ".json" file type is supported.
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <ul className="teal darken-2 collection" style={{ marginTop: '20px' }}>
                                                {acceptedFiles.length === 0 && <li><div><span><p>No file has been selected yet.</p></span></div></li>}
                                                {acceptedFiles.length > 0 && acceptedFiles.map((acceptedFile, i) => (
                                                    <li className="teal darken-2 white-text collection-item" key={i} id="selected-file">
                                                        <div>
                                                            <span style={{ wordWrap: 'break-word' }}>{acceptedFile.name}</span>
                                                            <a href="#!" className="secondary-content waves-effect waves-light white-text right"
                                                                onClick={() => this.remove(i) }
                                                            >
                                                                <i className="material-icons">delete_forever</i>
                                                            </a>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            }
                        </Dropzone>
                        <div style={{ marginTop: '50px' }}>
                            <p>Your uploaded JSON file of the new network contains:</p>
                            <div className="row">
                                <div className="col s12 m6 l6" style={{ marginTop: '20px', marginBottom: '20px' }}>
                                    <div className="center">
                                        <span><i className="material-icons">adjust</i></span>
                                        <h5 id="number-of-nodes" style={{ marginTop: '10px', marginBottom: '10px' }}>
                                            {this.state.newNodes.length}
                                        </h5>
                                        <span>Nodes</span>
                                    </div>
                                </div>
                                <div className="col s12 m6 l6" style={{ marginTop: '20px', marginBottom: '20px' }}>
                                    <div className="center">
                                        <span><i className="material-icons">linear_scale</i></span>
                                        <h5 id="number-of-links" style={{ marginTop: '10px', marginBottom: '10px' }}>
                                            {this.state.newLinks.length}
                                        </h5>
                                        <span>Links</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row" style={{ marginTop: '50px', marginBottom: '70px' }}>
                            <div className="col s6 m6 m6">
                                <Link to="/network/new" className="teal darken-2 white-text btn left" style={{ paddingLeft: '5px' }}>
                                    <i className="material-icons left" style={{ marginRight: '5px' }}>keyboard_arrow_left</i>
                                    Back
                                </Link>
                            </div>
                            <div className="col s6 m6 m6">
                                <button type="submit" form="new-network-form" value="Next" 
                                    className="teal darken-2 white-text btn right" style={{ paddingRight: '5px' }} 
                                    disabled={!this.state.isJSONFileValidNNotEmpty}
                                >
                                    <i className="material-icons right" style={{ marginLeft: '5px' }}>check</i>
                                    Create
                                </button>
                            </div>
                        </div>
                    </form>
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

// export default connect(mapStateToProps, actions)(withRouter(FileUploadNewNetwork));
export default connect(
    mapStateToProps,
    { submitNewNetwork }     
)(withRouter(CreateNetworkFileUpload));
















