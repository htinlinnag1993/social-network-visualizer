import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Dropzone from 'react-dropzone';

const dropZoneStyle = {
    // flex: 1,
    // display: 'flex',
    // flexDirection: 'column',
    width: '100%',
    height: '200px',
    alignItems: 'center',
    // textAlign: 'center',
    padding: '20px',
    borderWidth: 5,
    borderRadius: 10,
    borderColor: 'teal',
    borderStyle: 'dashed',
    backgroundColor: 'black',
    // color: 'white',
    // outline: 'none',
    transition: 'border .24s ease-in-out'
};

// const rejectStyle = {
//     // flex: 1,
//     // display: 'flex',
//     // flexDirection: 'column',
//     width: '100%',
//     height: '300px',
//     // alignItems: 'center',
//     // textAlign: 'center',
//     padding: '20px',
//     borderWidth: 5,
//     borderRadius: 10,
//     borderColor: 'red',
//     borderStyle: 'dashed',
//     backgroundColor: 'black',
//     color: 'white',
//     // outline: 'none',
//     transition: 'border .24s ease-in-out'
// };

class FileUploadNewNetwork extends Component {
    constructor(props) {
        super(props);
    }

    onDrop = (acceptedFiles) => {
        alert(acceptedFiles);
        console.log(acceptedFiles);
    }
    render() {

        return  (
            <div className="container center white-text">
                <div>
                    <h4 id="new-network-name">New network</h4>
                </div>
                <div className="container">
                    <form action="#" className="col s12">
                        <div className="row">
                            <div className="input-field col s12">
                                <i className="material-icons prefix">label</i>
                                <input id="network-name" type="text" className="validate white-text" 
                                    onChange={(e) => {
                                        var name = document.getElementById('new-network-name');
                                        if (e.target.value) 
                                            name.innerHTML = "" + e.target.value;
                                        else 
                                            name.innerHTML = "New Network";
                                    }}
                                />
                                <label htmlFor="network-name">Name</label>
                            </div>
                        </div>
                        <div className="row" style={{ marginBottom: '50px' }}>
                            <div className="input-field col s12">
                                <i className="material-icons prefix">description</i>
                                <input id="description" type="text" className="validate white-text" />
                                <label htmlFor="description">Description</label>
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
                                            <input {...getInputProps()} />
                                            { !isDragActive && "Click me or drag a JSON file to upload!" }
                                            { isDragActive && !isDragReject && "Drop it like it's hot!" } 
                                            { isDragReject && "Only .json file type is supported to use to create the network!" }
                                            { isFileTooLarge && (
                                                <div className="white-text">
                                                    File is too large.
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <ul className="teal darken-2 white-text collection" style={{ marginTop: '20px' }}>
                                                {acceptedFiles.length > 0 && acceptedFiles.map(acceptedFile => (
                                                    <li className="teal darken-2 white-text collection-item">
                                                        <div>
                                                            <span style={{ wordWrap: 'break-word' }}>{acceptedFile.name}</span>
                                                            <a href="#!" className="secondary-content waves-effect waves-light white-text right"
                                                                onClick={() => alert('Deleted!')}
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
                        <div className="row" style={{ marginTop: '70px', marginBottom: '50px' }}>
                            <div className="col s12 m6 m6">
                                <a href="#!" className="teal darken-2 white-text btn">
                                    <i className="material-icons left">keyboard_arrow_left</i>
                                    Back
                                </a>
                            </div>
                            <div className="col s12 m6 m6">
                                <a href="#!" className="teal darken-2 white-text btn">
                                    <i className="material-icons right">keyboard_arrow_right</i>
                                    Next
                                </a>
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

export default connect(mapStateToProps)(FileUploadNewNetwork);
















