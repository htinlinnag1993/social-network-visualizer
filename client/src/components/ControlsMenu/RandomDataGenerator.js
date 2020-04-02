import React, { Component } from 'react';
import M from 'materialize-css/dist/js/materialize.min.js';

class ControlsMenu extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        // Initialize the range slider for choosing the number of profiles 
        var array_of_dom_elements = document.querySelectorAll("input[type=range]");
        M.Range.init(array_of_dom_elements);
        // Add display for selected number of profiles using the selected value from range slider
        this.showNumProfiles();
    }

    showNumProfiles = () => {
        var slider = document.getElementById("num-profiles-range-slider");
        var output = document.getElementById("num-profiles");
        var incrementNumProfiles = document.getElementById("increment-num-profiles");
        var decrementNumProfiles = document.getElementById("decrement-num-profiles");
        incrementNumProfiles.onclick = () => {
            slider.value++;
            output.innerHTML = slider.value;
        };
        decrementNumProfiles.onclick = () => {
            slider.value--;
            output.innerHTML = slider.value;
        };
        output.innerHTML = slider.value;
        slider.oninput = () => {
            output.innerHTML = slider.value;
        };
    }
    handleGenerateClick = () => {
        // Get the number of profiles from the range slider and set the state
        var num = Number(document.getElementById("num-profiles-range-slider").value);
        this.props.setNumOfProfilesNShowGraph(num);
    }

    render() {

        return (
            <div className="card black">
                <div className="card-title">
                    Random Data
                </div>
                <div className="card-action">
                    <div className="row">
                        <div className="col s12 m12 l12 center">
                            <div className="row">
                                <div className="col s12 m12 l12">
                                    <p className="center"><span id="num-profiles"></span> Profiles</p>
                                </div>
                                <div className="col s12 m12 l12">
                                    <div className="row">
                                        <div className="col s12 m12 l12">
                                            <span id="decrement-num-profiles" className="waves-effect waves-light teal darken-2 btn left">&#60;</span>
                                            <span id="increment-num-profiles" className="waves-effect waves-light teal darken-2 btn right">&#62;</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col s12 m12 l12">
                                    <p className="slidecontainer" style={{margin: 0}}>
                                        <input type="range" id="num-profiles-range-slider"
                                            min="5" max="50" defaultValue={this.props.numberOfProfiles} />
                                    </p>
                                </div>
                                <div className="col s12 m12 l12">
                                    <button onClick={this.handleGenerateClick}
                                            className="waves-effect waves-light teal darken-2 btn"
                                            id="random-sn-generator">
                                        Generate
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

export default ControlsMenu;

