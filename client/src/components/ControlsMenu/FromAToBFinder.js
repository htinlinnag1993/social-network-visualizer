import React, { Component } from 'react';
import M from 'materialize-css/dist/js/materialize.min.js';

class FromAToBFinder extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        // Initialize the profile search bars with autocomplete feature but with empty data
        this.profileSearchBars = document.querySelectorAll('.autocomplete');
        M.Autocomplete.init(this.profileSearchBars, );
    }

    render() {
        return (
            <div className="card black">
                <div className="card-title">
                    From A to B
                </div>
                <div className="card-action">
                    <div className="row" style={{marginBottom: "0px"}}>
                        <form>
                            <div className="input-field col s10 m10 l10 white">
                                <input type="text" id="autocomplete-input-profile-a" className="autocomplete" />
                                <label htmlFor="autocomplete-input-profile-a">Search for A</label>
                            </div>
                            <div className="col s2 m2 l2">
                                <button className="waves-effect waves-light teal darken-2 btn" onClick={this.props.resetProfileSearch} type="reset"
                                    style={{
                                        width: "20px",
                                        height: "53px",
                                        marginTop: "1rem",
                                        marginBottom: "1rem",
                                        textAlign: "center",
                                        padding: "2px"
                                    }}>x</button>
                            </div>
                        </form>
                    </div>
                    <div className="row" style={{marginBottom: "0px"}}>
                        <form>
                            <div className="input-field col s10 m10 l10 white">
                                <input type="text" id="autocomplete-input-profile-b" className="autocomplete" />
                                <label htmlFor="autocomplete-input-profile-b">Search for B</label>
                            </div>
                            <div className="col s2 m2 l2">
                                <button className="waves-effect waves-light teal darken-2 btn" onClick={this.props.resetProfileSearch} type="reset"
                                    style={{
                                        width: "20px",
                                        height: "53px",
                                        marginTop: "1rem",
                                        marginBottom: "1rem",
                                        textAlign: "center",
                                        padding: "2px"
                                    }}>x</button>
                            </div>
                        </form>
                    </div>
                    <div className="row">
                        <div className="col s5 m5 l6" style={{padding: "0 0"}}>
                            <button onClick={this.props.findSPFromAtoB}
                                    className="waves-effect waves-light teal darken-2 btn left"
                                    id="findsp_fromAtoB">
                                Find
                            </button>
                        </div>
                        <div className="col s7 m7 l6">
                            <button onClick={this.props.resetFromAtoB}
                                    className="waves-effect waves-light teal darken-2 btn left"
                                    id="reset_fromAtoB_setting">
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default FromAToBFinder;
