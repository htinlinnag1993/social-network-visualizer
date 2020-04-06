import React, { Component, useCallback } from 'react';
import M from 'materialize-css/dist/js/materialize.min.js';

class DemoHelpGuide extends Component {
    constructor(props) {
        super(props);
        var helpGuide;
    }
    componentDidMount() {
        // Initialize Tooltip for help guide of the app
        this.helpGuide = document.querySelector('#help-guide');
        M.Tooltip.init();
    }
    addHelpGuideData = () => {
        var string =    "<p>This web app is a demo version of our SNV app." + "<br/>" +
                        "How to use it & Steps:</p>" + "<br/>" +
                        "1. Click on the menu toggler next to 'Start Here'." + "<br/>" +
                        "2. Choose the number of profiles to visualize & click on 'Generate'." + "<br/>" +
                        "3. Click & drag around on anyone in the network to highlight him/her & his/her friends." + "<br/>" +
                        "4. Click on 'Unselect' to stop highlighting." + "<br/>" +
                        "5. You can toggle on/off profile pics & names or reset it back to default." + "<br/>" +
                        "6. Search for profile A & B to find the shortest path between them." + "<br/>" +
                        "7. If there is a path between A & B, the path will be presented at the top of the graph.";
        return string;
    }
    render() {
        return (
            <a id="help-guide" className="black teal-text tooltipped"
                data-html="true" 
                data-position="bottom" 
                data-tooltip={this.addHelpGuideData()}>
                    <i className="material-icons small">help</i>
            </a>
        );
    }
}

export default DemoHelpGuide;