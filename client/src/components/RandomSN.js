import React, { Component } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import { color } from 'd3';
import M from 'materialize-css/dist/js/materialize.min.js';
import Graph from '../Graph';

class RandomSN extends Component {
    constructor(props) {
        super(props);
        this.state = {
            randomProfilesAndConnections: {},
            margin: {
                top: 20,
                bottom: 50,
                right: 30,
                left: 50
            },
            width: 800, // before --> 960
            height: 700,
            graphAppended: false,
            profilePicsDisplayed: true,
            profileNamesDisplayed: false,
            oneNodeDblClicked: false,
            nodes: [],
            links: [],
            graphInAdjList: new Map(),
            selectedProfileA: 0,
            selectedProfileB: 0
            // id: root
        };
        this.displayProfileNames = this.displayProfileNames.bind(this);
        this.displayProfilePics = this.displayProfilePics.bind(this);
        this.handleProfileAChange = this.handleProfileAChange.bind(this);
        this.handleProfileBChange = this.handleProfileBChange.bind(this);
    }
    componentDidMount() {
        this.setState({
            width: 800 - this.state.margin.left - this.state.margin.right, // before --> 960 -
            height: 700 - this.state.margin.top - this.state.margin.bottom,
        });
        M.AutoInit();   // Initializing the select box with empty options
    }

    drawGraph = (nodes, links) => {
        // To prevent appending more than one graph
        if (this.state.graphAppended) {
            d3.select("#rsnGraph").remove();
            d3.select('#tooltip').remove();
            this.setState({
                graphAppended: false
            });
        }

        // To solve scope issues between React and D3
        var that = this;
        // Color Scale
        var c10 = d3.scaleOrdinal(d3.schemeCategory10);
        // Tooltip to display profile info on the side
        var tooltip = d3.select("#tooltip-container")
            .append("div")
            .attr("id", "tooltip")
            .style("opacity", 0);
        // Create an SVG element and append it to the DOM
        var svgElement = d3.select("#svg-container")
                            .append("svg")
                            .attr("viewBox", `0 0 800 700`) // before --> 960
                            // .attr("width", 960)
                            // .attr("height", 700)
                            .attr("id", "rsnGraph")
                            .style("background-color", "black");
        // Create an g element and append it to the SVG element
        var mainG = svgElement.append("g")
                            .attr("transform","translate(" + this.state.margin.left + "," + this.state.margin.top + ")");	
        // Create Force Simulation Layout
        // Used in previous version (V3) as follow:
        // var force = d3.layout.force()
        //                 .size([width, height])
        //                 .nodes(nodes)
        //                 .links(links)
        //                 .gravity(0.05)
        //                 .charge(-200)
        //                 .linkDistance(200);
        var force = d3.forceSimulation(nodes)
                        .force("link",d3.forceLink(links).distance(200))
                        // .force("collide",d3.forceCollide( function(d){return d.r + 8 }).iterations(16) )
                        .force("collide",d3.forceCollide().radius(function(d) {return d.influence * 10;}))
                        // .iterations()).on("tick", ticked)
                        .force("charge", d3.forceManyBody())
                        .force("center", d3.forceCenter( 800/2 - 50, 700/2 )) // before --> 960
                        .force("y", d3.forceY(this.state.height / 2).strength(0.05))
                        .force("x", d3.forceX(this.state.width / 2).strength(0.05));
        //Add links to SVG
        var link = mainG.selectAll(".link")
                        .data(links)
                        .enter()
                        .append("line");
        link.attr("class", "link")
            // .attr("stroke-width", "2px")
            .attr("stroke-width",function(d){ return d.weight/10; })
            .style("stroke", function(d){return color("#6B6B6B")});
            // .on('mouseover.tooltip', function(d) {
            //     tooltip.transition()
            //         .duration(300)
            //         .style("opacity", .8);
            //     tooltip.html("Source:"+ d.source.id + 
            //                 "<p/>Target:" + d.target.id +
            //                 "<p/>Strength:"  + d.weight)
            //         .style("left", (d3.event.pageX) + "px")
            //         .style("top", (d3.event.pageY + 10) + "px");
            // })
            // .on("mouseout.tooltip", function() {
            // tooltip.transition()
            //     .duration(100)
            //     .style("opacity", 0);
            // })
            // .on('mouseout.fade', fade(1))
            // .on("mousemove", function() {
            // tooltip.style("left", (d3.event.pageX) + "px")
            //     .style("top", (d3.event.pageY + 10) + "px");
            // });
        //Add nodes to SVG
        var node = mainG.selectAll(".node")
                        .select(".g")
                        .data(nodes)
                        .enter()
                        .append("g")
                        .attr("class", "node")
                        .attr("id", function(d) {
                            return d.id;
                        })
                        .call(d3.drag()
                            .on("start", dragstarted)
                            .on("drag", dragged)
                            .on("end", dragended))
                            // .on("mouseover", function() {
                            //     that.handleMouseOver(this);
                            // })
                            // .on("mouseout", function() {
                            //     that.handleMouseOut(this);
                            // })
                            // .on("dblclick", function() {
                            //     that.handleDoubleClick(this);
                            // });
                            .on('mouseover.tooltip', function(d) {
                                tooltip.transition()
                                    .duration(300)
                                    .style("opacity", .8);
                                tooltip.html("Name : " + d.name +
                                            "<p/>Date of Birth : "   + d.dob +
                                            "<p/>Email : <br/>&nbsp;&nbsp;"           + d.email +
                                            "<p/>Phone : "           + d.phone +
                                            "<p/>Address : <br/>&nbsp;&nbsp;"         + d.streetAddress + ", <br/>&nbsp;&nbsp;" 
                                                + d.city + ", " + d.zipCode + ", <br/>&nbsp;&nbsp;" + d.country +
                                            "<p/>Home IP : <br/>&nbsp;&nbsp;"         + d.homeIP +
                                            "<p/>Job Title : <br/>&nbsp;&nbsp;"       + d.jobTitle +
                                            "<p/>Company : <br/>&nbsp;&nbsp;"         + d.company)
                                    .style("left", (d3.event.pageX) + "px")
                                    .style("top", (d3.event.pageY + 10) + "px")
                                    // .style("position", "absolute")
                                    // .style("background-color", "white")
                                    // .style("max-width", "200px")
                                    .style("width", "auto")
                                    .style("height", "auto")
                                    .style("text-align", "left")
                                    .style("word-wrap", "break-word")
                                    .style("padding", "5px")
                                    .style("border-style", "solid")
                                    .style("border-radius", "4px")
                                    .style("border-width", "1px")
                                    .style("box-shadow", "3px 3px 10px teal")
                                    .style("pointer-events", "none");
                            })
                            .on('mouseover.fade', fade(0))
                            .on("mouseout.tooltip", function() {
                                tooltip.transition()
                                    .duration(100)
                                    .style("opacity", 0);
                            })
                            .on('mouseout.fade', fade(1))
                            .on("mousemove", function() {
                                tooltip.style("left", (d3.event.pageX) + "px")
                                  .style("top", (d3.event.pageY + 10) + "px");
                            })
                            // .on('dblclick',releasenode);
        // Add a label to each node
        var label = node.append("text")
                        // .attr("dx", 17)
                        // .attr("dy", "0.35em")
                        .attr("x", function(d) { return -(((d.name.length-3)/2) * 6); })
                        .attr("y", -20)
                        .attr("font-size", function(d) { return d.influence*1.5 > 10 ? d.influence*1.5 : 10; })
                        .attr("fill", "white")
                        .attr("class", "profileNames")
                        .text(function(d){ return d.name; })
                        .style("opacity", this.state.profileNamesDisplayed ? 1 : 0)
        // Add a circle to each node
        var circle = node.append("circle")
                        .attr("class", "profileCircles")
                        .attr("r", function(d){ return d.influence/2 > 7 ? d.influence/2 : 7; })
                        .attr("fill", function(d){ return c10(d.zone*10); });
        // Add a profile pic to each node
        var profileImage = node.append("image")
                            .attr("xlink:href",  function(d) { return d.avatar;})
                            .attr("class", "profilePics")
                            .attr("x", function(d) { return -15;})
                            .attr("y", function(d) { return -15;})
                            .attr("height", 30)
                            .attr("width", 30)
                            // .style("opacity", this.state.profilePicsDisplayed ? 1 : 0);
        //This function will be executed for every tick of force layout 
        force.on("tick", function(){
            //Set X and Y of node
            node.attr("r", function(d){ return d.influence; })
                .attr("cx", function(d){ return d.x; })
                .attr("cy", function(d){ return d.y; });
                //Set X, Y of link
                link.attr("x1", function(d){ return d.source.x; })
                link.attr("y1", function(d){ return d.source.y; })
                link.attr("x2", function(d){ return d.target.x; })
                link.attr("y2", function(d){ return d.target.y; });
                //Shift node a little
                node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
        });
        function dragstarted(d) {
            if (!d3.event.active) force.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }
        function dragended(d) {
            if (!d3.event.active) force.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        } 


        const linkedByIndex = {};
        links.forEach(d => {
            linkedByIndex[`${d.source.index},${d.target.index}`] = 1;
        });

        function isConnected(a, b) {
            return linkedByIndex[`${a.index},${b.index}`] || linkedByIndex[`${b.index},${a.index}`] || a.index === b.index;
        }
        function fade(opacity) {
            return d => {
                node.style('stroke-opacity', function (o) {
                    const thisOpacity = isConnected(d, o) ? 1 : opacity;
                    this.setAttribute('fill-opacity', thisOpacity);
                    return thisOpacity;
                });
                link.style('stroke-opacity', o => (o.source === d || o.target === d ? 1 : opacity))
                    .style('stroke', function (o) {
                        const thisOpacity = isConnected(d, o) ? 1 : opacity;
                        const thisStrokeColor = (thisOpacity === 1) ? color("#6B6B6B") : color("#FFFFFF");

                        // this.setAttribute('stroke', thisStrokeColor);
                        return thisStrokeColor;
                });
                profileImage.style('opacity', function (o) {
                        var thisOpacity = isConnected(d, o) ? 1 : opacity;
                        if (that.state.profilePicsDisplayed && thisOpacity === 1) thisOpacity = 1;
                        else thisOpacity = 0;
                        return thisOpacity;
                    })
                    .attr('x', function(o) {
                        var thisOpacity = (o === d) ? 1 : opacity;
                        if (that.state.profilePicsDisplayed && thisOpacity === 1) thisOpacity = 1;
                        else thisOpacity = 0;
                        return (thisOpacity === 1) ? -20 : -15;
                    })
                    .attr('y', function(o) {
                        var thisOpacity = (o === d) ? 1 : opacity;
                        if (that.state.profilePicsDisplayed && thisOpacity === 1) thisOpacity = 1;
                        else thisOpacity = 0;
                        return (thisOpacity === 1) ? -20 : -15;
                    })
                    .attr('height', function(o) {
                        var thisOpacity = (o === d) ? 1 : opacity;
                        if (that.state.profilePicsDisplayed && thisOpacity === 1) thisOpacity = 1;
                        else thisOpacity = 0;
                        return (thisOpacity === 1) ? 40 : 30;
                    })
                    .attr('width', function(o) {
                        var thisOpacity = (o === d) ? 1 : opacity;
                        if (that.state.profilePicsDisplayed && thisOpacity === 1) thisOpacity = 1;
                        else thisOpacity = 0;
                        return (thisOpacity === 1) ? 40 : 30;
                    });

                label.style('opacity', function (o) {
                    var thisOpacity = isConnected(d, o) ? 1 : opacity;

                    if (that.state.profileNamesDisplayed && thisOpacity === 1) thisOpacity = 1;
                    else thisOpacity = 0;

                    this.setAttribute('opacity', thisOpacity);
                    return thisOpacity;
                });
            };
        }

        d3.select("#svg-container").attr("align","center");

        this.setState({
            graphAppended: true
        });

        M.AutoInit();
    }

    handleMouseOver = (d3ProfileNode) => {
        var that = this;    // To solve the scope problem between React and D3
        if (!that.state.oneNodeDblClicked) {
            d3.selectAll(".profileCircles")
                .style("opacity", 0.6);
            d3.select(d3ProfileNode)
                .select(".profileCircles")
                .attr("r", function(d){ return d.influence/2 > 10 ? d.influence/2 : 10; })
                .style("opacity", 1);
            // If profilePicsDisplayed is turned on
            if (that.state.profilePicsDisplayed) {
                d3.selectAll(".profilePics")
                    .style("opacity", 0.6);
                d3.select(d3ProfileNode)
                    .select(".profilePics")
                    .attr("x", function(d) { return -20;})
                    .attr("y", function(d) { return -20;})
                    .attr("height", 40)
                    .attr("width", 40)
                    .style("opacity", 1);
            }
            d3.select(d3ProfileNode)
                .select(".profileNames")
                .attr("dx", 23)
                .attr("dy", "0.40em")
                .style("opacity", 1);
        }
    }

    handleMouseOut = (d3ProfileNode) => {
        var that = this;    // To solve the scope problem between React and D3
        if (!that.state.oneNodeDblClicked) {
            d3.selectAll(".profileCircles")
                .attr("r", function(d){ return d.influence/2 > 7 ? d.influence/2 : 7; })
                .style("opacity", 1);
            // If profilePicsDisplayed is turned on
            if (that.state.profilePicsDisplayed) {
                d3.selectAll(".profilePics")
                .attr("x", function(d) { return -15;})
                .attr("y", function(d) { return -15;})
                .attr("height", 30)
                .attr("width", 30)
                .style("opacity", 1);
            }
            // If profileNamesDisplayed is not turned on
            if (!that.state.profileNamesDisplayed) { 
                d3.select(d3ProfileNode)
                    .select(".profileNames")
                    .attr("dx", 17)
                    .attr("dy", "0.35em")
                    .style("opacity", 0)
            }
        }
    }

    handleDoubleClick = (d3ProfileNode) => {
        var that = this;
        if (that.state.oneNodeDblClicked) {
            that.setState({
                oneNodeDblClicked: false
            });
            /** Edit the circles */
            // Show all circles
            d3.selectAll(".profileCircles")
                .attr("r", function(d){ return d.influence/2 > 7 ? d.influence/2 : 7; })
                .style("opacity", 1);

            /** Edit the profile pics */
            // If profilePicsDisplayed is turned on
            if (that.state.profilePicsDisplayed) {
                d3.selectAll(".profilePics")
                .attr("x", function(d) { return -15;})
                .attr("y", function(d) { return -15;})
                .attr("height", 30)
                .attr("width", 30)
                .style("opacity", 1);
            }

            /** Edit the profile names */
            // If profileNamesDisplayed is not turned on
            if (!that.state.profileNamesDisplayed) { 
                d3.selectAll(".profileNames")
                    .attr("dx", 17)
                    .attr("dy", "0.35em")
                    .style("opacity", 0)
            } else {
                d3.selectAll(".profileNames")
                    .attr("dx", 17)
                    .attr("dy", "0.35em")
                    .style("opacity", 1);
            }
        } else {
            that.setState({
                oneNodeDblClicked: true
            });
            /** Edit the circles */
            // Fade all circles
            d3.selectAll(".profileCircles")
                .style("opacity", 0.2);
            // Highlight the double-clicked circle
            d3.select(d3ProfileNode)
                .select(".profileCircles")
                .attr("r", function(d){ return d.influence/2 > 12 ? d.influence/2 : 12; })
                .style("opacity", 1);

            /** Edit the profile pics */
            // If profilePicsDisplayed is turned on
            if (that.state.profilePicsDisplayed) {
                d3.selectAll(".profilePics")
                    .style("opacity", 0.2);
                d3.select(d3ProfileNode)
                    .select(".profilePics")
                    .attr("x", function(d) { return -30;})
                    .attr("y", function(d) { return -30;})
                    .attr("height", 60)
                    .attr("width", 60)
                    .style("opacity", 1);
            }

            /** Edit the profile names */
            // If profileNamesDisplayed is not turned on
            if (!that.state.profileNamesDisplayed) {
                d3.select(d3ProfileNode)
                    .select(".profileNames")
                    .attr("dx", 17)
                    .attr("dy", "0.35em")
                    .style("opacity", 0)
            }
            d3.select(d3ProfileNode)
                .select(".profileNames")
                .attr("dx", 30)
                .attr("dy", "0.45em")
                .style("opacity", 1);

            var dblClickedV = d3ProfileNode.id;
            var currentVAdjList = this.state.graphInAdjList[dblClickedV];

            console.log(dblClickedV);
            console.log(currentVAdjList);

            d3.selectAll(".links")
                    .style("opacity", 0.1);
            
            /** */
            for (var v of currentVAdjList) {
                var currentNode = d3.select("[id='"+ v + "']");

                /** Edit the profile circle */
                currentNode.select(".profileCircles")
                    .attr("r", function(d){ return d.influence/2 > 10 ? d.influence/2 : 10; })
                    .style("opacity", 1);

                /** Edit the profile pic */
                currentNode.select(".profilePics")
                    .attr("x", function(d) { return -20;})
                    .attr("y", function(d) { return -20;})
                    .attr("height", 40)
                    .attr("width", 40)
                    .style("opacity", 1);
                
                /** Edit the profile name */
                currentNode.select(".profileNames")
                    .attr("dx", 23)
                    .attr("dy", "0.40em")
                    .style("opacity", 1);

                /** Edit the related links */
                
            }

        }

        
        
    }

    showGraph = async () => {
        // Get and set the external random data from api for the social network
        const res = await axios.get('/api/generate/random-profiles-and-connections');
        this.setState({ randomProfilesAndConnections: res.data });
        // Extract data from dataset
        var nodes = this.state.randomProfilesAndConnections.nodes,
            links = this.state.randomProfilesAndConnections.links,
            graphInAdjList = this.state.randomProfilesAndConnections.graphInAdjList;
        this.setState({
            nodes: nodes,
            links: links,
            graphInAdjList: graphInAdjList
        });

        console.log(nodes);
        console.log(links);
        console.log(graphInAdjList);
        this.drawGraph(nodes, links);
    }
    displayProfilePics = e => {
        console.log(this.state.profilePicsDisplayed);
        this.setState({
            profilePicsDisplayed: e.target.checked
        });
        // this.setState({
        //     profilePicsDisplayed: !this.state.profilePicsDisplayed
        // });
        console.log(this.state.profilePicsDisplayed);

        var newOpacity = this.state.profilePicsDisplayed ? 0 : 1;
        d3.selectAll(".profilePics").style("opacity", newOpacity);
    }
    displayProfileNames = e => {
        console.log(this.state.profileNamesDisplayed);
        this.setState({
            profileNamesDisplayed: e.target.checked
        });
        // this.setState({
        //     profileNamesDisplayed: !this.state.profileNamesDisplayed
        // });
        console.log(this.state.profileNamesDisplayed);
        
        var newOpacity = this.state.profileNamesDisplayed ? 0 : 1;
        d3.selectAll(".profileNames").style("opacity", newOpacity);
    }
    resetProfileNamesPicsSetting = () => {
        this.setState({
            profileNamesDisplayed: false,
            profilePicsDisplayed: true
        });
        d3.selectAll(".profileNames").style("opacity", 0);
        d3.selectAll(".profilePics").style("opacity", 1);
    }

    handleProfileAChange = e => {
        this.setState({
            selectedProfileA: e.target.value
        });
        console.log(e.target.value);
        console.log(this.state.selectedProfileA);
    }
    handleProfileBChange = e => {
        this.setState({
            selectedProfileB: e.target.value
        });
        console.log(this.state.selectedProfileB);
    }

    render() {
        return (
            <div>
                <div className="divider"></div>
                <div className="section">
                    <div className="row">
                        <div className="col s12 m4 l3 valign-wrapper">
                            <div className="card black">
                                <div className="card-title">
                                    Data
                                </div>
                                <div className="card-action">
                                    <button onClick={this.showGraph}
                                            className="waves-effect waves-light teal darken-2 btn"
                                            id="random-sn-generator">
                                        Random
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col s12 m4 l3 valign-wrapper">
                            <div className="card black">
                                <div className="card-title">
                                    Names & Pics
                                </div>
                                <div className="card-action">
                                    <div className="switch">
                                        <label htmlFor="profile_pics_toggle">
                                            <div className="valign-wrapper">
                                                <i className="small material-icons prefix">account_box</i>
                                                <input id="profile_pics_toggle" type="checkbox" 
                                                    onChange={this.displayProfilePics}
                                                    checked={this.state.profilePicsDisplayed} />
                                                <span className="lever"></span>
                                            </div>
                                        </label>
                                    </div>
                                    <div className="switch">
                                        <label htmlFor="profile_names_toggle">
                                            <div className="valign-wrapper">
                                                <i className="small material-icons prefix">font_download</i>
                                                <input id="profile_names_toggle" type="checkbox" 
                                                    onChange={this.displayProfileNames}
                                                    checked={this.state.profileNamesDisplayed} />
                                                <span className="lever"></span>
                                            </div>
                                        </label> 
                                    </div>
                                    <br />
                                    <div className="row">
                                        <div className="col s12">
                                            <button onClick={this.resetProfileNamesPicsSetting}
                                                    className="waves-effect waves-light teal darken-2 btn"
                                                    id="reset_profile_names_pics_setting">
                                                Reset
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col s12 m4 l6 valign-wrapper">
                            <div className="card black">
                                <div className="card-title">
                                    From A to B
                                </div>
                                <div className="card-action">
                                    <div className="input-field col s12 m12 white">
                                        {/* <span><label><h6>A:</h6></label></span> */}
                                        <select defaultValue={this.state.selectedProfileA} className="icons" id="profile-a"
                                            onChange={this.handleProfileAChange}>
                                                <option value="0">Choose Profile A</option>
                                                {this.state.nodes.map((element, key) => {
                                                    return (
                                                        <option value={element.id} key={key}
                                                            data-icon={element.avatar} className="left circle">
                                                            {element.name}
                                                        </option>
                                                    )})
                                                }
                                        </select>
                                        {/* <span><label><h6>B:</h6></label></span> */}
                                        <select defaultValue={this.state.selectedProfileB} className="icons" id="profile-b"
                                            onChange={this.handleProfileBChange}>
                                                <option value="0">Choose Profile B</option>
                                                {this.state.nodes.map((element, key) => {
                                                    return (
                                                        <option value={element.id} key={key}
                                                            data-icon={element.avatar} className="left circle">
                                                            {element.name}
                                                        </option>
                                                    )})
                                                }
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="divider"></div> */}
                {/* <div className="section"> */}
                    <div className="row">
                            <div className="black col s12 m7 l8" id="svg-container" align="center"></div>
                            <div className="black col s12 m5 l4" id="tooltip-container" align="center"></div>
                            {/* <div id={'#' + this.props.id}></div> */}
                    </div>
                {/* </div> */}
            </div>
        );
    }
}

export default RandomSN;