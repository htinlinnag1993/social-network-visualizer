import React, { Component, useCallback } from 'react';
import M from 'materialize-css/dist/js/materialize.min.js';

class DateNTimeFormatHelpGuide extends Component {
    constructor(props) {
        super(props);
        var helpGuide;
    }
    componentDidMount() {
        // Initialize Tooltip for help guide of the app
        this.helpGuide = document.querySelector('#date-time-format-help-guide');
        M.Tooltip.init(this.helpGuide,);
    }
    addHelpGuideData = () => {
        var string =    "<p>MM-DD-YYYY, HH:MM:SS</p>";
        return string;
    }
    render() {
        return (
            <a id="date-time-format-help-guide" className="black teal-text tooltipped"
                data-html="true" 
                data-position="bottom" 
                data-tooltip={this.addHelpGuideData()}>
                {this.props.columnName}
            </a>
        );
    }
}

export default DateNTimeFormatHelpGuide;