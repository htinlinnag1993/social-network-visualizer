import React, { Component, useCallback } from 'react';
import M from 'materialize-css/dist/js/materialize.min.js';
import RandomDataGenerator from './RandomDataGenerator';
import ProfileNamesAndPicsToggler from './ProfileNamesNPicsToggler';
import FromAToBFinder from './FromAToBFinder';

class ControlsMenu extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { numberOfProfiles, setNumOfProfilesNShowGraph } = this.props;
        const { profilePicsDisplayed, displayProfilePics } = this.props;
        const { profileNamesDisplayed, displayProfileNames } = this.props;
        const { resetProfileNamesPicsSetting } = this.props;
        const { resetProfileSearch, findSPFromAtoB, resetFromAtoB } = this.props;
        return (
            <aside>
                <div>
                    <ul id="slide-out" className="sidenav black" style={{top: '68px', height: '90%'}}>
                        <div className="container">
                            <li>
                                <RandomDataGenerator 
                                    numberOfProfiles={numberOfProfiles} 
                                    setNumOfProfilesNShowGraph={setNumOfProfilesNShowGraph} />
                            </li>
                            <li>
                                <ProfileNamesAndPicsToggler 
                                    profilePicsDisplayed={profilePicsDisplayed} displayProfilePics={displayProfilePics}
                                    profileNamesDisplayed={profileNamesDisplayed} displayProfileNames={displayProfileNames}
                                    resetProfileNamesPicsSetting={resetProfileNamesPicsSetting} />
                            </li>
                            <li>
                                <FromAToBFinder 
                                    resetProfileSearch={resetProfileSearch} 
                                    findSPFromAtoB={findSPFromAtoB} 
                                    resetFromAtoB={resetFromAtoB} />
                                
                            </li>
                        </div>
                    </ul>
                    
                </div>
            </aside>
        );
    }
}

export default ControlsMenu;