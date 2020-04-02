import React, { Component } from 'react';

class ProfileNamesNPicsToggler extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div className="card black">
                <div className="card-title">
                    Names & Pics
                </div>
                <div className="card-action">
                    <div className="row">
                        <div className="col s12 m12 l12 center">
                            <div className="row">
                                <div className="col s12 m12 l12">
                                    <div className="switch">
                                        <label htmlFor="profile_pics_toggle">
                                            <div className="valign-wrapper" style={{margin:10}}>
                                                <i className="small material-icons prefix left">account_box</i>
                                                <input id="profile_pics_toggle" type="checkbox" 
                                                    onChange={this.props.displayProfilePics}
                                                    checked={this.props.profilePicsDisplayed} />
                                                <span className="lever right"></span>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                                <div className="col s12 m12 l12">
                                    <div className="switch">
                                        <label htmlFor="profile_names_toggle">
                                            <div className="valign-wrapper" style={{margin:10}}>
                                                <i className="small material-icons prefix left">font_download</i>
                                                <input id="profile_names_toggle" type="checkbox" 
                                                    onChange={this.props.displayProfileNames}
                                                    checked={this.props.profileNamesDisplayed} />
                                                <span className="lever right"></span>
                                            </div>
                                        </label> 
                                    </div>
                                </div>
                                <br/>
                                <div className="col s12 m12 l12" style={{marginTop: 5}}>
                                    <button onClick={this.props.resetProfileNamesPicsSetting}
                                            className="waves-effect waves-light teal darken-2 btn"
                                            id="reset_profile_names_pics_setting">
                                        Reset
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProfileNamesNPicsToggler;