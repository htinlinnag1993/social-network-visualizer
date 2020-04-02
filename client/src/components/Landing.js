import React, { Component } from 'react';
import M from 'materialize-css/dist/js/materialize.min.js';

class Landing extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        var elems = document.querySelectorAll('.parallax');
        var instances = M.Parallax.init(elems, );
    }
    render() {
        return (
            <div>
                <div className="section black white-text">
                    <div className="row container">
                        <div className="col s12 m12 l12 center">
                            <h2 className="header">Social Network Visualizer</h2>
                            <h5 className="teal-text darken-2">A tool that can help you understand social networks & connections.</h5>
                        </div>
                    </div>
                </div>
                <div className="parallax-container" style={{ height: "200px" }}>
                    <div className="parallax" style={{ position: "static", opacity: "0.5"}}>
                        <img src="/resources/images/depositphotos_71076955-stock-illustration-communication-social-banner-edited.jpg" />
                    </div>
                </div>
                {/* <div>
                    <div style={{
                        width: "100%",
                        background: "linear-gradient(to bottom, rgba(0,0,0,0.6) 100%, rgba(0,0,0,0.6) 100%), url('/resources/images/depositphotos_71076955-stock-illustration-communication-social-banner.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        height: "200px",
                        
                    }}>
                        <div className="container">
                            <div className="row center">
                                <div className="col s12 m12 l12">
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
                <div className="section black white-text">
                    <div className="row container">
                        <div className="col s12 m12 l12 center">
                            <img className="white" src="/resources/images/noun_Idea_2900895_By_Toli_DE.png" style={{ borderRadius: "50%", marginTop: "35px" }} />
                            <h3 className="header">Concept</h3>
                            <p className="teal-text darken-2 flow-text">
                                Social networks are so big & complex that it is very difficult to know who is connected to who. 
                                <br /><br />
                                Whether you are watching a TV series that has tons of characters, drawing a company's internal structure, analyzing users,
                                or fighting crimes, there is no easy-to-use & accessible visualization tool to use for mapping out networks & keeping track of connections. 
                                <br /><br />
                                SNV provides that missing tool.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="parallax-container" style={{ height: "200px" }}>
                    <div className="parallax" style={{ position: "static", opacity: "0.5" }}>
                        <img src="/resources/images/ryoji-iwata-unsplash-edited.jpg"/>
                    </div>
                </div>
                <div className="section black white-text">
                    <div className="row container">
                        <div className="col s12 m12 l12 center">
                            <h3 className="header">Some Ways to Use SNV</h3>
                            <div className="row">
                                <div className="col s12 m4 l4 center">
                                    <img className="white" src="/resources/images/noun_networking_2146368_By_Becris.png" style={{ borderRadius: "50%", marginTop: "35px" }} />
                                    <p className="white-text flow-text">Structure & Users</p>
                                    <p className="teal-text darken-2 flow-text">
                                        Companies can use SNV to design/visualize their organizational structure & their users
                                    </p>
                                </div>
                                <div className="col s12 m4 l4 center">
                                    <img className="white" src="/resources/images/noun_Law Enforcement_1061250_By_Symbolon_IT.png" style={{ borderRadius: "50%", marginTop: "35px" }} />
                                    <p className="white-text flow-text">Criminal Connections</p>
                                    <p className="teal-text darken-2 flow-text">
                                        Law enforcement organizations can use SNV to understand criminal networks
                                    </p>
                                </div>
                                <div className="col s12 m4 l4 center">
                                    <img className="white" src="/resources/images/noun_house targaryen_2548456_By_Luis_Herrera.png" style={{ borderRadius: "50%", marginTop: "35px" }} />
                                    <p className="white-text flow-text">Characters</p>
                                    <p className="teal-text darken-2 flow-text">
                                        Fans can use SNV to keep track of characters & connections between them
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="parallax-container" style={{ height: "200px" }}>
                    <div className="parallax" style={{ position: "static", opacity: "0.5"}}>
                        <img src="/resources/images/alina-grubnyak-unsplash-edited.jpg" />
                    </div>
                </div>
                <div className="section black white-text">
                    <div className="row container">
                        <div className="col s12 m12 l12 center">
                            <h3 className="header">Current Features</h3>
                            <div className="row">
                                <div className="col s12 m4 l4 center">
                                    <img className="white" src="/resources/images/noun_social network_1151373_By_Guilhem_FR.png" style={{ borderRadius: "50%", marginTop: "35px" }} />
                                    <p className="white-text flow-text">Interactive Graph</p>
                                    <p className="teal-text darken-2 flow-text">
                                        Interactive graph with clickable/draggable profiles & links 
                                    </p>
                                </div>
                                <div className="col s12 m4 l4 center">
                                    <img className="white" src="/resources/images/noun_Adjustment Settings_1452071_Berkah Icon_ID.png" style={{ borderRadius: "50%", marginTop: "35px" }} />
                                    <p className="white-text flow-text">Adjustable Display</p>
                                    <p className="teal-text darken-2 flow-text">
                                        Graph with adjustable setting & display to toggle profile pics & names.
                                        Demo version has random data generator
                                    </p>
                                </div>
                                <div className="col s12 m4 l4 center">
                                    <img className="white" src="/resources/images/noun_Location_961270_By_Drishya.png" style={{ borderRadius: "50%", marginTop: "35px" }} />
                                    <p className="white-text flow-text">Connection Finder</p>
                                    <p className="teal-text darken-2 flow-text">
                                        Find a shortest path with connection(s) from profile A to profile B
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="parallax-container" style={{ height: "200px" }}>
                    <div className="parallax" style={{ position: "static", opacity: "0.7"}}>
                        <img src="/resources/images/anastasia-dulgier-unsplash-edited.jpg" />
                    </div>
                </div>
                <div className="section black white-text">
                    <div className="row container">
                        <div className="col s12 m12 l12 center">
                            <h3 className="header">Upcoming Features</h3>
                            <div className="row">
                                <div className="col s12 m4 l4 center">
                                    <img className="white" src="/resources/images/Google.png" style={{ borderRadius: "50%", marginTop: "35px" }} />
                                    <p className="white-text flow-text">Sign in with Google</p>
                                    <p className="teal-text darken-2 flow-text">
                                        Personalized user accounts will be available after registration through "Sign in with Google".
                                    </p>
                                </div>
                                <div className="col s12 m4 l4 center">
                                    <img className="white" src="/resources/images/noun_Network_317687_By_Robin Richards_GB.png" style={{ borderRadius: "50%", marginTop: "35px" }} />
                                    <p className="white-text flow-text">Customizable Graphs</p>
                                    <p className="teal-text darken-2 flow-text">
                                        Registered users will be able to create their own graphs with data & save them 
                                    </p>
                                </div>
                                <div className="col s12 m4 l4 center">
                                    <img className="white" src="/resources/images/noun_Demographic Data_2301706_HAlbertoGongora_CO.png" style={{ borderRadius: "50%", marginTop: "35px" }} />
                                    <p className="white-text flow-text">Demographics</p>
                                    <p className="teal-text darken-2 flow-text">
                                        Visualization of profiles within the graphs for analyzing the demographics.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Landing;