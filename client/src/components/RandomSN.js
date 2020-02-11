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
            height: 800, // before --> 700
            nodes: [],
            links: [],
            graphAppended: false,
            profilePicsDisplayed: true,
            profileNamesDisplayed: false,
            // oneNodeDblClicked: false,
            graphInAdjList: new Map(),
            selectedProfileA: 0,
            selectedProfileB: 0,
            aNodeClicked: false,
            overlaySideMenuShowed: true,
            shorestPathBtwnAnB: []
            // id: root
        };
        this.displayProfileNames = this.displayProfileNames.bind(this);
        this.displayProfilePics = this.displayProfilePics.bind(this);
        this.handleProfileAChange = this.handleProfileAChange.bind(this);
        this.handleProfileBChange = this.handleProfileBChange.bind(this);

        /** variables for d3 visualization */
        var c10, tooltip, svgElement, mainG, force, 
            link, spLink, node, spCircle, profileName, circle, 
            profileImage, profileNames;
        var linkedByIndex;
        var graph;
        var profileSearchBars, profileSearchBarA, profileSearchBarB;
        var nameToId;
    }
    componentDidMount() {
        this.setState({
            width: 800 - this.state.margin.left - this.state.margin.right, // before --> 960 -
            height: 800 - this.state.margin.top - this.state.margin.bottom, // before --> 700
        });
        M.AutoInit();   // Initializing the select box with empty options
        this.profileSearchBars = document.querySelectorAll('.autocomplete');
        M.Autocomplete.init(this.profileSearchBars, );
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
        // that.c10 = d3.scaleOrdinal(d3.schemeCategory10);
        // that.c10 = d3.scaleOrdinal(d3.schemeCategory10).domain(d3.range(0, 9));
        // for (var i = 0; i < 100; i++) console.log(i + " ---> " + that.c10(i));
        // console.log(0 + " ---> " + that.c10(0));
        // console.log(1 + " ---> " + that.c10(1));
        // console.log(2 + " ---> " + that.c10(2));
        // console.log(3 + " ---> " + that.c10(3));
        // that.c10 = d3.scaleLinear(d3.schemeCategory10);
        that.c10 = d3.scaleLinear().domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
                        .range(["white", "grey", "black", "steelblue", "teal", "green", "yellow", "orange", "red", "purple"]);
        
        // Tooltip to display profile info on the side
        that.tooltip = d3.select("#tooltip-container")
            .append("div")
            .attr("id", "tooltip")
            .style("opacity", .8)
            .style("max-width", "300px")
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
        that.tooltip.html("Click or hover on the profile you are interested in.");
        // Create an SVG element and append it to the DOM
        that.svgElement = d3.select("#svg-container")
                            .append("svg")
                            .attr("viewBox", `0 0 800 800`) // before --> 960 and 700
                            // .attr("width", 960)
                            // .attr("height", 700)
                            .attr("id", "rsnGraph")
                            .style("background-color", "black")
                            // .call(d3.zoom().on("zoom", function () {
                            //     that.svgElement.attr("transform", d3.event.transform)
                            //  }));
        // Create an g element and append it to the SVG element
        that.mainG = that.svgElement.append("g")
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
        that.force = d3.forceSimulation(nodes)
                        .force("link",d3.forceLink(links).distance(200))
                        // .force("collide",d3.forceCollide( function(d){return d.r + 8 }).iterations(16) )
                        .force("collide",d3.forceCollide().radius(function(d) {return d.influence * 10;}))
                        // .iterations()).on("tick", ticked)
                        .force("charge", d3.forceManyBody())
                        .force("center", d3.forceCenter( 800/2 - 50, 800/2 )) // before --> 960 and 700
                        .force("y", d3.forceY(this.state.height / 2).strength(0.05))
                        .force("x", d3.forceX(this.state.width / 2).strength(0.05));
        //Add links to SVG
        that.link = that.mainG.selectAll(".link")
                        .data(links)
                        .enter()
                        .append("line");
        that.link.attr("class", "link")
            .attr("id", (d) => {
                return d.source + "-" + d.target; 
            })
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
        that.node = that.mainG.selectAll(".node")
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
                            // .on('mouseover.tooltip', function(d) {
                            .on('click.tooltip', function(d) {
                                that.tooltip.transition()
                                    .duration(300)
                                    .style("opacity", .8);
                                that.tooltip.html("Name : "         + d.name +
                                            "<p/>Date of Birth : "  + d.dob +
                                            "<p/>Email : <br/>&nbsp;&nbsp;"         + d.email +
                                            "<p/>Phone : "          + d.phone +
                                            "<p/>Address : <br/>&nbsp;&nbsp;"       + d.streetAddress + ", <br/>&nbsp;&nbsp;" 
                                                + d.city + ", " + d.zipCode + ", <br/>&nbsp;&nbsp;" + d.country +
                                            "<p/>Home IP : <br/>&nbsp;&nbsp;"       + d.homeIP +
                                            "<p/>Job Title : <br/>&nbsp;&nbsp;"     + d.jobTitle +
                                            "<p/>Company : <br/>&nbsp;&nbsp;"       + d.company)
                                    // .style("left", (d3.event.pageX) + "px")
                                    // .style("top", (d3.event.pageY + 10) + "px")
                                    // // .style("position", "absolute")
                                    // // .style("background-color", "white")
                                    // .style("max-width", "300px")
                                    .style("width", "auto")
                                    .style("height", "auto");
                                    // .style("text-align", "left")
                                    // .style("word-wrap", "break-word")
                                    // .style("padding", "5px")
                                    // .style("border-style", "solid")
                                    // .style("border-radius", "4px")
                                    // .style("border-width", "1px")
                                    // .style("box-shadow", "3px 3px 10px teal")
                                    // .style("pointer-events", "none");
                            })
                            // .on('mouseover.fade', that.fade(0))
                            .on('click.fade', that.fade(0))
                            // .on("mouseout.tooltip", function() {
                            .on("dblclick.tooltip", function() {
                                that.tooltip.transition()
                                    .duration(100)
                                    .style("opacity", .8);
                                that.tooltip.html("Click or hover on the profile you are interested in.");
                            })
                            // .on('mouseout.fade', that.fade(1))
                            .on('dblclick.fade', that.fade(1))
                            // .on("mousemove", function() {
                            //     that.tooltip.style("left", (d3.event.pageX) + "px")
                            //       .style("top", (d3.event.pageY + 10) + "px");
                            // })
        // Add a label to each node
        that.profileName = that.node.append("text")
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
        that.circle = that.node.append("circle")
                        .attr("class", "profileCircles")
                        .attr("r", function(d){ return d.influence/2 > 7 ? d.influence/2 : 7; })
                        .attr("fill", function(d){ return that.c10(d.zone - 2); });
        // Add a profile pic to each node
        that.profileImage = that.node.append("image")
                            .attr("xlink:href",  function(d) { return d.avatar;})
                            .attr("class", "profilePics")
                            .attr("x", function(d) { return -20;})
                            .attr("y", function(d) { return -20;})
                            .attr("height", 40)
                            .attr("width", 40)
                            .style("opacity", this.state.profilePicsDisplayed ? 1 : 0);
        //This function will be executed for every tick of force layout 
        that.force.on("tick", function(){
            //Set X and Y of node
            that.node.attr("r", function(d){ return d.influence; })
                .attr("cx", function(d){ return d.x; })
                .attr("cy", function(d){ return d.y; });
                //Set X, Y of link
                that.link.attr("x1", function(d){ return d.source.x; })
                    .attr("y1", function(d){ return d.source.y; })
                    .attr("x2", function(d){ return d.target.x; })
                    .attr("y2", function(d){ return d.target.y; });
                //Shift node a little
                that.node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
        });
        function dragstarted(d) {
            if (!d3.event.active) that.force.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }
        function dragended(d) {
            if (!d3.event.active) that.force.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        } 


        that.linkedByIndex = {};
        links.forEach(d => {
            that.linkedByIndex[`${d.source.index},${d.target.index}`] = 1;
        });

        d3.select("#svg-container").attr("align","center");

        this.setState({
            graphAppended: true
        });

        // For populating data for autocomplete search bar
        that.profileSearchBarA = document.querySelector("#autocomplete-input-profile-a");
        that.profileSearchBarB = document.querySelector("#autocomplete-input-profile-b");
        var nodesDataObject = {};
        that.nameToId = {};
        this.state.nodes.forEach(function(element) {
            nodesDataObject[element.name] = element.avatar;
            that.nameToId[element.name] = element.id;
        });
        // M.AutoInit();
        M.Autocomplete.init(this.profileSearchBarA, {
            data: nodesDataObject,
            limit: 'infinit',
            minLength: 1,
            onAutocomplete: function(val) {
                that.handleProfileAChange(val);
            }
        });
        M.Autocomplete.init(this.profileSearchBarB, {
            data: nodesDataObject,
            limit: 'infinit',
            minLength: 1,
            onAutocomplete: function(val) {
                that.handleProfileBChange(val);
            }
        });
    }

    isConnected = (a, b) => {
        var that = this;
        return that.linkedByIndex[`${a.index},${b.index}`] || that.linkedByIndex[`${b.index},${a.index}`] || a.index === b.index;
    }
    fade = (opacity) => {
        return d => {
            var that = this;
            that.node.style('stroke-opacity', function (o) {
                const thisOpacity = that.isConnected(d, o) ? 1 : opacity;
                this.setAttribute('fill-opacity', thisOpacity);
                return thisOpacity;
            });
            that.circle.style("fill", function(o) {
                    const thisFillColor = (o === d) ? 1 : opacity;
                    return (thisFillColor === 1) ? that.c10(d.zone - 2) : that.c10(d.zone + 2);
                })
                .attr("r", function(o) {
                    const thisOpacity = (o === d) ? 1 : opacity;
                    return (thisOpacity === 1) ? 
                                (d.influence/2 > 7 ? d.influence/2 : 7) :
                                (d.influence/2 > 5 ? d.influence/2 : 5);
                });
            that.link.style('stroke-opacity', o => (o.source === d || o.target === d ? 1 : opacity))
                .style('stroke', function (o) {
                    const thisOpacity = that.isConnected(d, o) ? 1 : opacity;
                    const thisStrokeColor = (thisOpacity === 1) ? color("#6B6B6B") : color("#FFFFFF");

                    // this.setAttribute('stroke', thisStrokeColor);
                    return thisStrokeColor;
            });
            that.profileImage.style('opacity', function (o) {
                    var thisOpacity = that.isConnected(d, o) ? 1 : opacity;
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

            that.profileName.style('opacity', function (o) {
                    var thisOpacity = that.isConnected(d, o) ? 1 : opacity;

                    if (that.state.profileNamesDisplayed && thisOpacity === 1) thisOpacity = 1;
                    else thisOpacity = 0;
                    return thisOpacity;
                })
                .attr("y", -25);
        };
    }
    // handleMouseOver = (d3ProfileNode) => {
    //     var that = this;    // To solve the scope problem between React and D3
    //     if (!that.state.oneNodeDblClicked) {
    //         d3.selectAll(".profileCircles")
    //             .style("opacity", 0.6);
    //         d3.select(d3ProfileNode)
    //             .select(".profileCircles")
    //             .attr("r", function(d){ return d.influence/2 > 10 ? d.influence/2 : 10; })
    //             .style("opacity", 1);
    //         // If profilePicsDisplayed is turned on
    //         if (that.state.profilePicsDisplayed) {
    //             d3.selectAll(".profilePics")
    //                 .style("opacity", 0.6);
    //             d3.select(d3ProfileNode)
    //                 .select(".profilePics")
    //                 .attr("x", function(d) { return -20;})
    //                 .attr("y", function(d) { return -20;})
    //                 .attr("height", 40)
    //                 .attr("width", 40)
    //                 .style("opacity", 1);
    //         }
    //         d3.select(d3ProfileNode)
    //             .select(".profileNames")
    //             .attr("dx", 23)
    //             .attr("dy", "0.40em")
    //             .style("opacity", 1);
    //     }
    // }
    // handleMouseOut = (d3ProfileNode) => {
    //     var that = this;    // To solve the scope problem between React and D3
    //     if (!that.state.oneNodeDblClicked) {
    //         d3.selectAll(".profileCircles")
    //             .attr("r", function(d){ return d.influence/2 > 7 ? d.influence/2 : 7; })
    //             .style("opacity", 1);
    //         // If profilePicsDisplayed is turned on
    //         if (that.state.profilePicsDisplayed) {
    //             d3.selectAll(".profilePics")
    //             .attr("x", function(d) { return -15;})
    //             .attr("y", function(d) { return -15;})
    //             .attr("height", 30)
    //             .attr("width", 30)
    //             .style("opacity", 1);
    //         }
    //         // If profileNamesDisplayed is not turned on
    //         if (!that.state.profileNamesDisplayed) { 
    //             d3.select(d3ProfileNode)
    //                 .select(".profileNames")
    //                 .attr("dx", 17)
    //                 .attr("dy", "0.35em")
    //                 .style("opacity", 0)
    //         }
    //     }
    // }
    // handleDoubleClick = (d3ProfileNode) => {
    //     var that = this;
    //     if (that.state.oneNodeDblClicked) {
    //         that.setState({
    //             oneNodeDblClicked: false
    //         });
    //         /** Edit the circles */
    //         // Show all circles
    //         d3.selectAll(".profileCircles")
    //             .attr("r", function(d){ return d.influence/2 > 7 ? d.influence/2 : 7; })
    //             .style("opacity", 1);

    //         /** Edit the profile pics */
    //         // If profilePicsDisplayed is turned on
    //         if (that.state.profilePicsDisplayed) {
    //             d3.selectAll(".profilePics")
    //             .attr("x", function(d) { return -15;})
    //             .attr("y", function(d) { return -15;})
    //             .attr("height", 30)
    //             .attr("width", 30)
    //             .style("opacity", 1);
    //         }

    //         /** Edit the profile names */
    //         // If profileNamesDisplayed is not turned on
    //         if (!that.state.profileNamesDisplayed) { 
    //             d3.selectAll(".profileNames")
    //                 .attr("dx", 17)
    //                 .attr("dy", "0.35em")
    //                 .style("opacity", 0)
    //         } else {
    //             d3.selectAll(".profileNames")
    //                 .attr("dx", 17)
    //                 .attr("dy", "0.35em")
    //                 .style("opacity", 1);
    //         }
    //     } else {
    //         that.setState({
    //             oneNodeDblClicked: true
    //         });
    //         /** Edit the circles */
    //         // Fade all circles
    //         d3.selectAll(".profileCircles")
    //             .style("opacity", 0.2);
    //         // Highlight the double-clicked circle
    //         d3.select(d3ProfileNode)
    //             .select(".profileCircles")
    //             .attr("r", function(d){ return d.influence/2 > 12 ? d.influence/2 : 12; })
    //             .style("opacity", 1);

    //         /** Edit the profile pics */
    //         // If profilePicsDisplayed is turned on
    //         if (that.state.profilePicsDisplayed) {
    //             d3.selectAll(".profilePics")
    //                 .style("opacity", 0.2);
    //             d3.select(d3ProfileNode)
    //                 .select(".profilePics")
    //                 .attr("x", function(d) { return -30;})
    //                 .attr("y", function(d) { return -30;})
    //                 .attr("height", 60)
    //                 .attr("width", 60)
    //                 .style("opacity", 1);
    //         }

    //         /** Edit the profile names */
    //         // If profileNamesDisplayed is not turned on
    //         if (!that.state.profileNamesDisplayed) {
    //             d3.select(d3ProfileNode)
    //                 .select(".profileNames")
    //                 .attr("dx", 17)
    //                 .attr("dy", "0.35em")
    //                 .style("opacity", 0)
    //         }
    //         d3.select(d3ProfileNode)
    //             .select(".profileNames")
    //             .attr("dx", 30)
    //             .attr("dy", "0.45em")
    //             .style("opacity", 1);

    //         var dblClickedV = d3ProfileNode.id;
    //         var currentVAdjList = this.state.graphInAdjList[dblClickedV];

    //         console.log(dblClickedV);
    //         console.log(currentVAdjList);

    //         d3.selectAll(".links")
    //                 .style("opacity", 0.1);
            
    //         /** */
    //         for (var v of currentVAdjList) {
    //             var currentNode = d3.select("[id='"+ v + "']");

    //             /** Edit the profile circle */
    //             currentNode.select(".profileCircles")
    //                 .attr("r", function(d){ return d.influence/2 > 10 ? d.influence/2 : 10; })
    //                 .style("opacity", 1);

    //             /** Edit the profile pic */
    //             currentNode.select(".profilePics")
    //                 .attr("x", function(d) { return -20;})
    //                 .attr("y", function(d) { return -20;})
    //                 .attr("height", 40)
    //                 .attr("width", 40)
    //                 .style("opacity", 1);
                
    //             /** Edit the profile name */
    //             currentNode.select(".profileNames")
    //                 .attr("dx", 23)
    //                 .attr("dy", "0.40em")
    //                 .style("opacity", 1);

    //             /** Edit the related links */
        
    //         }
    //     } 
    // }

    showGraph = async () => {
        // Get and set the external random data from api for the social network
        const res = await axios.get('/api/generate/random-profiles-and-connections');
        this.setState({ randomProfilesAndConnections: res.data });
        // Extract data from dataset & set the states
        var nodes = this.state.randomProfilesAndConnections.nodes,
            links = this.state.randomProfilesAndConnections.links,
            graphInAdjList = this.state.randomProfilesAndConnections.graphInAdjList;
        this.setState({
            nodes: nodes,
            links: links,
            graphInAdjList: graphInAdjList
        });
        // Draw the graph
        this.drawGraph(nodes, links);
        console.log(nodes);
        console.log(links);
        console.log(graphInAdjList);
        
        var tempGraph = new Graph(nodes.length, graphInAdjList);
        console.log(tempGraph.AdjList);
        tempGraph.setAdjustListMap(graphInAdjList);
        console.log(tempGraph.dist);
        console.log(tempGraph.printShortestDistance(101, 150, 101));
        console.log(tempGraph);

        this.graph = tempGraph;
        console.log(this.graph.printShortestDistance(101, 150, 101));
    }
    displayProfilePics = e => {
        var that = this;    // To solve the scope problem between React and D3
        this.setState({
            profilePicsDisplayed: e.target.checked
        });
        if (this.state.graphAppended) that.profileImage.style("opacity", this.state.profilePicsDisplayed ? 0 : 1);

    }
    displayProfileNames = e => {
        var that = this;    // To solve the scope problem between React and D3
        this.setState({
            profileNamesDisplayed: e.target.checked
        });
        if (this.state.graphAppended) that.profileName.style("opacity", this.state.profileNamesDisplayed ? 0 : 1);
    }
    resetProfileNamesPicsSetting = () => {
        var that = this;    // To solve the scope problem between React and D3
        this.setState({
            profileNamesDisplayed: false,
            profilePicsDisplayed: true
        });
        if (this.state.graphAppended) {
            that.profileName.style("opacity", 0);
            that.profileImage.style("opacity", 1);
        }
    }


    handleProfileAChange = val => {
        console.log(val);
        console.log(this.nameToId[val]);
        this.setState({
            selectedProfileA: Number(this.nameToId[val])
        });

        // var that = this;

        // var profileA = d3.select("[id='" + e.target.value + "']");
        // console.log(profileA);
    }
    handleProfileBChange = val => {
        console.log(val);
        console.log(this.nameToId[val]);
        this.setState({
            selectedProfileB: Number(this.nameToId[val])
        });

        // var that = this;

        // var profileB = d3.select("[id='" + e.target.value + "']");
        // console.log(profileB);
    }
    findSPFromAtoB = e => {
        var that =  this;
        var srcId = this.state.selectedProfileA,
            destId = this.state.selectedProfileB;
        var obj = this.graph.printShortestDistance(srcId, destId, 101);
        var arr = obj.shortestPath;
        var temp = [],
            tempReverseEdges = [];
        if (arr.length > 2) {
            for (var i = 0; i < arr.length-1; i++)
                temp.push(arr[i] + '-' + arr[i+1]);
            for (var i = arr.length-1; i > 0; i--) 
                tempReverseEdges.push(arr[i] + '-' + arr[i-1]);
        } else {
            temp.push(arr[0]+ '-' + arr[1]);
            tempReverseEdges.push(arr[1] + '-' + arr[0]);
        }
        console.log(temp);
        console.log(tempReverseEdges);

        if (that.spCircle) that.spCircle.remove();
        that.spCircle = that.node.append("circle")
                            .filter(function(d) { return arr.includes(d.id); })
                            .attr("class", "spCircles")
                            .attr("r", function(d){ return d.influence/2 > 25 ? d.influence/2 : 25; })
                            .attr("stroke", function(d){ return that.c10(4); })
                            .attr("fill", "none")
                            .style("stroke-width", 5);

        that.node.style('stroke-opacity', (d) => {
                const thisOpacity = arr.includes(d.id) ? 1 : 0;
                return thisOpacity;
            })
            .style('fill-opacity', (d) => {
                const thisOpacity = arr.includes(d.id) ? 1 : 0;
                return thisOpacity;
            });
        that.circle.style("fill", (d) => {
                const thisFillColor = arr.includes(d.id) ? 1 : 0;
                return (thisFillColor === 1) ? that.c10(d.zone - 2) : that.c10(d.zone + 2);
            })
            .attr("r", (d) => {
                const thisOpacity = arr.includes(d.id) ? 1 : 0;
                return (thisOpacity === 1) ? 
                            (d.influence/2 > 7 ? d.influence/2 : 7) :
                            (d.influence/2 > 5 ? d.influence/2 : 6);
            }); 

        // that.link.style('opacity', (d) => temp.includes(d.connectionId) ? 1: 0)
        //         .style('stroke', (d) =>  temp.includes(d.connectionId) ? color("#FF1500") : color("#FFFFFF"));
        that.link.style('opacity', (d) => {
                if(temp.includes(d.connectionId) || tempReverseEdges.includes(d.connectionId)) {
                    console.log(d.connectionId + " is drawn");
                    return 1;
                } else {
                    return 0;
                }
            })
            .style('stroke', (d) =>  {
                if(temp.includes(d.connectionId) || tempReverseEdges.includes(d.connectionId)) {
                    console.log(d.connectionId + " is drawn");
                    return color("#FF1500");
                } else {
                    return color("#FFFFFF");
                }
            });
        

        that.profileImage.style('opacity', (d) => {
                var thisOpacity = arr.includes(d.id) ? 1 : 0;
                if (that.state.profilePicsDisplayed && thisOpacity === 1) thisOpacity = 1;
                else thisOpacity = 0;
                return thisOpacity;
            })
            .attr('x', (d) => {
                var thisOpacity = arr.includes(d.id) ? 1 : 0;
                if (that.state.profilePicsDisplayed && thisOpacity === 1) thisOpacity = 1;
                else thisOpacity = 0;
                return (thisOpacity === 1) ? -20 : -15;
            })
            .attr('y', (d) => {
                var thisOpacity = arr.includes(d.id) ? 1 : 0;
                if (that.state.profilePicsDisplayed && thisOpacity === 1) thisOpacity = 1;
                else thisOpacity = 0;
                return (thisOpacity === 1) ? -20 : -15;
            })
            .attr('height', (d) => {
                var thisOpacity = arr.includes(d.id) ? 1 : 0;
                if (that.state.profilePicsDisplayed && thisOpacity === 1) thisOpacity = 1;
                else thisOpacity = 0;
                return (thisOpacity === 1) ? 40 : 30;
            })
            .attr('width', (d) => {
                var thisOpacity = arr.includes(d.id) ? 1 : 0;
                if (that.state.profilePicsDisplayed && thisOpacity === 1) thisOpacity = 1;
                else thisOpacity = 0;
                return (thisOpacity === 1) ? 40 : 30;
            });

        that.profileName.style('opacity', (d) => {
                var thisOpacity = arr.includes(d.id) ? 1 : 0;

                if (that.state.profileNamesDisplayed && thisOpacity === 1) thisOpacity = 1;
                else thisOpacity = 0;
                return thisOpacity;
            })
            .attr("y", -25);
    }
    resetFromAtoB = e => {
        
        document.getElementById("autocomplete-input-profile-a").value = "";
        document.getElementById("autocomplete-input-profile-b").value = "";
        console.log(document.getElementById("autocomplete-input-profile-a").value);
        console.log(document.getElementById("autocomplete-input-profile-b").value);

        // this.setState({
        //     selectedProfileA: 0,
        //     selectedProfileB: 0
        // });

        // e.value = e.defaultValue;

        // console.log(this.state.selectedProfileA);
        // console.log(this.state.selectedProfileB);
    }

    render() {
        return (
            <div>
                <div className="divider"></div>
                <aside>
                    <div>
                        <ul id="slide-out" className="sidenav black" style={{top: '68px', height: '90%'}}>
                            <div className="container">
                                <li>
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
                                </li>
                                <li>
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
                                </li>
                                <li>
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
                                                        <button className="waves-effect waves-light teal darken-2 btn" type="reset"
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
                                                        <button className="waves-effect waves-light teal darken-2 btn" type="reset"
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
                                                    <button onClick={this.findSPFromAtoB}
                                                            className="waves-effect waves-light teal darken-2 btn left"
                                                            id="findsp_fromAtoB">
                                                        Find
                                                    </button>
                                                </div>
                                                <div className="col s7 m7 l6">
                                                    <button onClick={this.resetFromAtoB}
                                                            className="waves-effect waves-light teal darken-2 btn left"
                                                            id="reset_fromAtoB_setting">
                                                        Reset
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </div>
                        </ul>
                        <div className="section">
                                <div style={{display: 'inline-flex', verticalAlign: 'middle', alignContent: 'center'}}>
                                    <a href="#" data-target="slide-out" className="sidenav-trigger">
                                        <i className="material-icons small teal-text">menu</i>
                                    </a>
                                    &nbsp;
                                    <span> &#8592; Start Here</span>
                                </div>
                        </div>
                    </div>
                </aside>
                <div className="row">
                    <div className="col s12 m12 l12">
                        {/* <div className="divider"></div> */}
                        {/* <div className="section"> */}
                            <div className="row">
                                <div className="black col s12 m7 l8" id="svg-container" align="center"></div>
                                <div className="black col s12 m5 l4" align="center">
                                    <span>About this profile</span>
                                    <div id="tooltip-container">
                                    </div>
                                </div>
                                    {/* <div id={'#' + this.props.id}></div> */}
                            </div>
                        {/* </div> */}
                    </div>
                </div>
            </div>
        );
    }
}

export default RandomSN;