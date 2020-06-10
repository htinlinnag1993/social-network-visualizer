import React, { Component } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import { color, svg } from 'd3';
import M from 'materialize-css/dist/js/materialize.min.js';
import Graph from '../Graph';
import ControlsMenu from './ControlsMenu/ControlsMenu';
import DemoHelpGuide from './DemoHelpGuide';

class RandomSN extends Component {
    constructor(props) {
        super(props);
        this.state = {
            margin: {
                top: 20,
                bottom: 50,
                right: 30,
                left: 50
            },
            width: 800, // before --> 960
            height: 700, // before --> 700
            numberOfProfiles: 50,
            nodes: [],
            links: [],
            graphAppended: false,
            spDirGraphAppended: false,
            profilePicsDisplayed: true,
            profileNamesDisplayed: true,
            graphInAdjList: new Map(),
            selectedProfileA: 0,
            selectedProfileB: 0,
            aNodeClicked: false
            // id: root
        };
        this.displayProfileNames = this.displayProfileNames.bind(this);
        this.displayProfilePics = this.displayProfilePics.bind(this);
        this.handleProfileAChange = this.handleProfileAChange.bind(this);
        this.handleProfileBChange = this.handleProfileBChange.bind(this);




        /** variables for d3 visualization */
        var c10, tooltip, borderPath, 
            svgContainer, svgElement, 
            mainG, force, 
            link, spLink, node, spCircle, 
            // arrowHeads, edgepaths,
            profileName, circle, profileImage, profileNames, highlightedNodes = [],
            spDirectionSVG, spDirectionRects, spDirectionLinks, spDirectionArrowHeads;
        var linkedByIndex;
        var graph;
        var profileSearchBars, profileSearchBarA, profileSearchBarB;
        var nameToId;
        var spDirSVGContainer, spDirSVGElement,
            spDirMainG, spDirforce, 
            spDirLinks, spDirNodes,
            spDirProfileNames, spDirProfileImages;
    
    
    
    
    }
    componentDidMount() {
        this.setState({
            width: 800 - this.state.margin.left - this.state.margin.right,
            height: 700 - this.state.margin.top - this.state.margin.bottom,
        });
        M.AutoInit();   // Initialize with empty options
        // Draw the svg image with its border
        this.drawSVG();
        // Draw the place holder for SP Direction Map
        this.drawPlaceHolderSPDir();
    }
    drawSVG = () => {
        this.svgContainer = d3.select("#svg-container");
        // Create an SVG element and append it to the DOM
        this.svgElement = this.svgContainer.append("svg")
                            .attr("viewBox", `0 0 800 700`) // before --> 960 and 700
                            // .attr("width", 960)
                            // .attr("height", 700)
                            .attr("id", "rsnGraph")
                            .attr("border", 1)
                            .style("background-color", "black")
                            // .call(d3.zoom().on("zoom", function () {
                            //     that.svgElement.attr("transform", d3.event.transform)
                            //  }));
        // Creat a border around svgElement
        this.borderPath = this.svgElement.append("rect")
                                .attr("x", 0)
                                .attr("y", 0)
                                .attr("width", 800)
                                .attr("height", 700)
                                .style("stroke", "white")
                                .style("fill", "none")
                                .style("stroke-width", 1);
    }
    drawPlaceHolderSPDir = () => {
        var that = this;
        // Select the spDirSVGContainer
        this.spDirSVGContainer = d3.select("#sp-dir-svg-container");
        //
        that.spDirSVGElement = that.spDirSVGContainer.append("svg")
                                .attr("viewBox", `0 0 400 100`)
                                .attr("id", "sp-dir-placeholder")
                                .attr("border", 1)
                                .style("border-left", "solid white 1px")
                                .style("background-color", "black");
        //
        var svgWidth = 400 - 20 - 20,
            svgHeight = 100 - 10 - 10,
            numNodes = 2,
            xCoorIncrement = svgWidth/numNodes,
            xStartingCoor = 20 + (xCoorIncrement/2),
            yCoor = (svgHeight/3) * 2;
        //
        let nodes = [];
        let nodeNames = ["Profile A", "Profile B"];
        nodes.push([Number(xStartingCoor), Number(yCoor)]);
        nodes.push([Number(xStartingCoor + xCoorIncrement), Number(yCoor)]);
        //
        that.spDirLinks = d3.linkHorizontal()({
                                source: nodes[0],
                                target: nodes[1]
                            });
        //
        that.spDirSVGElement.append('path')
            .attr('d', that.spDirLinks)
            .attr('class', 'sp-dir-link')
            .attr('stroke', 'teal')
            .attr('fill', 'none')
            .style("stroke-dasharray", ("3, 3"));
        // Add a circle to each node
        for (let i=0; i<nodes.length; i++) {
            that.spDirSVGElement.append('circle')
                .attr('class', 'sp-dir-node')
                .attr('cx', nodes[i][0])
                .attr('cy', nodes[i][1])
                .attr('r', 10)
                .style('fill', 'teal');
            // Add a name label to each node
            that.spDirSVGElement.append("text")
                .attr("class", "sp-dir-profile-name")
                .attr("x", nodes[i][0] - (((nodeNames[i].length-3)/2) * 6))
                .attr("y", nodes[i][1] - 20)
                .attr("font-size", 10)
                .attr("fill", "white")
                .text(nodeNames[i])
                .style("opacity", 1);
        }
        d3.select("#sp-dir-svg-container").attr("align","center");
    }

    // Set the number of random profiles using the number from the range slider & show graph accordingly
    setNumOfProfilesNShowGraph = async (num) => {
        this.setState({
            numberOfProfiles: num
        });
        // Get and set the external random data from api for the social network
        var url = '/api/random/generate/random-profiles-and-connections' + '?numofprofiles=' + num;
        const res = await axios.get(url);
        // Extract data from dataset & set the states
        var nodes = res.data.nodes,
            links = res.data.links,
            graphInAdjList = res.data.graphInAdjList;
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
        // console.log(tempGraph.AdjList);
        tempGraph.setAdjustListMap(graphInAdjList);
        // console.log(tempGraph.dist);
        // console.log(tempGraph.printShortestDistance(101, 150, 101));
        // console.log(tempGraph);

        this.graph = tempGraph;
        // console.log(this.graph.printShortestDistance(101, 150, 101));
    }

    // Need to clean up the code in the following 3 methods(drawGraph, isConnected, fade) later
    drawGraph = (nodes, links) => {
        // To prevent appending more than one graph
        if (this.state.graphAppended) {
            this.svgElement.remove();
            d3.select('#tooltip').remove();
            this.drawSVG();
            this.setState({
                graphAppended: false
            });
        }
        // To solve scope issues between React and D3
        var that = this;
        // Color Scale
        // that.c10 = d3.scaleOrdinal(d3.schemeCategory10);
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
        that.tooltip.html("Click on the profile you want to view." +
                            "<p/> Click on 'Unselect' to clear selection.");
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
                        .force("center", d3.forceCenter( 800/2 - 50, 700/2 )) // before --> 960 and 700
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
                            // .on('mouseover.tooltip', function(d) {
                            // .on("mouseover", function(d) {
                            //     that.tooltipAboveGraph.transition()		
                            //         .duration(200)		
                            //         .style("opacity", .9);		
                            //     that.tooltipAboveGraph.html(d.name)	
                            //         // .style("left", (d3.event.pageX) + "px")		
                            //         // .style("top", (d3.event.pageY - 28) + "px");
                            //     })					
                            // .on("mouseout", function(d) {		
                            //     that.tooltipAboveGraph.transition()		
                            //         .duration(500)		
                            //         .style("opacity", 0);	
                            // })
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
                            // .on("mouseout.tooltip", function() {
                            // .on('mouseout.fade', that.fade(1))
                            // .on("mousemove", function() {
                            //     that.tooltip.style("left", (d3.event.pageX) + "px")
                            //       .style("top", (d3.event.pageY + 10) + "px");
                            // })
                            // .on('click.fade', that.fade(0))
                            .on('click', that.fade(0))
                            // .on("dblclick.tooltip", function() {
                            //     that.tooltip.transition()
                            //         .duration(100)
                            //         .style("opacity", .8);
                            //     that.tooltip.html("Click on the profile you want to view." +
                            //                         "<p/> Double-click to unselect.");
                            // })
        // Add a label to each node
        that.profileName = that.node.append("text")
                            // .attr("dx", 17)
                            // .attr("dy", "0.35em")
                            .attr("x", function(d) { return -(((d.name.length-3)/2) * 6); })
                            .attr("y", -25)
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
                            .attr("id", (d) => d.id + "ProfilePic")
                            .attr("x", function(d) { return -15;})
                            .attr("y", function(d) { return -15;})
                            .attr("height", 30)
                            .attr("width", 30)
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
        // Does not mutate/update the state. Only iterating it to get data from
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
            console.log(this.state.aNodeClicked);
            if (opacity === 0) {
                this.setState({
                    aNodeClicked: true
                });
            }
            console.log(this.state.aNodeClicked);
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
                .attr("y", function (o) {
                    var thisOpacity = (o === d) ? 1 : opacity;
                    if (that.state.profileNamesDisplayed && thisOpacity === 1) thisOpacity = 1;
                    else thisOpacity = 0;
                    return (thisOpacity === 1) ? -30 : -25;
                });
            if (that.spCircle) {
                that.spCircle.attr("r", function(o) {
                    const thisOpacity = (o === d) ? 1 : opacity;
                    return (thisOpacity === 1) ? 
                                (d.influence/2 > 25 ? d.influence/2 : 25) :
                                (d.influence/2 > 20 ? d.influence/2 : 20);
                });
            }
        };
    }


    // 3 methods for Profile Pics & Names Toggler
    displayProfilePics = e => {
        var that = this;    // To solve the scope problem between React and D3
        this.setState({
            profilePicsDisplayed: e.target.checked
        });
        if (this.state.graphAppended) {
            if (this.state.aNodeClicked)
                this.clearSelection();
            that.profileImage.style("opacity", this.state.profilePicsDisplayed ? 0 : 1);
        }
    }
    displayProfileNames = e => {
        var that = this;    // To solve the scope problem between React and D3
        this.setState({
            profileNamesDisplayed: e.target.checked
        });
        if (this.state.graphAppended) {
            if (this.state.aNodeClicked)
                this.clearSelection();
            that.profileName.style("opacity", this.state.profileNamesDisplayed ? 0 : 1);
        }
    }
    resetProfileNamesPicsSetting = () => {
        var that = this;    // To solve the scope problem between React and D3
        this.setState({
            profileNamesDisplayed: true,
            profilePicsDisplayed: true
        });
        if (this.state.graphAppended) {
            if (this.state.aNodeClicked)
                this.clearSelection();
            that.profileName.style("opacity", 1);
            that.profileImage.style("opacity", 1);
        }
    }

    // 5 methods for From A to B finder
    handleProfileAChange = val => {
        console.log(val);
        console.log(this.nameToId[val]);
        this.setState({
            selectedProfileA: Number(this.nameToId[val])
        });
    }
    handleProfileBChange = val => {
        console.log(val);
        console.log(this.nameToId[val]);
        this.setState({
            selectedProfileB: Number(this.nameToId[val])
        });
    }
    resetProfileSearch = () => {
        if (this.spCircle) this.spCircle.remove();
        // To prevent appending more than one graph & one tooltip
        if (this.state.spDirGraphAppended) {
            this.spDirSVGElement.remove();
            this.setState({
                spDirGraphAppended: false
            });
            this.drawPlaceHolderSPDir();
        }
    }
    resetFromAtoB = e => {
        document.getElementById("autocomplete-input-profile-a").value = "";
        document.getElementById("autocomplete-input-profile-b").value = "";
        console.log(document.getElementById("autocomplete-input-profile-a").value);
        console.log(document.getElementById("autocomplete-input-profile-b").value);

        if (this.spCircle) this.spCircle.remove();
        // To prevent appending more than one graph & one tooltip
        if (this.state.spDirGraphAppended) {
            this.spDirSVGElement.remove();
            this.setState({
                spDirGraphAppended: false
            });
            this.drawPlaceHolderSPDir();
        }
    }
    findSPFromAtoB = e => {
        if (this.state.graphAppended && this.state.selectedProfileA && this.state.selectedProfileB) {
            if (this.state.selectedProfileA === this.state.selectedProfileB) {
                alert("Profile A and Profile B cannot be the same profile " + 
                "as we are trying to find the shortest path between them.");
            } else {
                var that =  this;
                var srcId = this.state.selectedProfileA,
                    destId = this.state.selectedProfileB;
                var obj = this.graph.printShortestDistance(srcId, destId, 101);
                console.log("SP obj: " + obj.shortestPath);
                if (obj === 0) {
                    alert("There is no path between Profile A and Profile B at all.");
                } else {
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
                    console.log(arr);
                    console.log(temp);
                    console.log(tempReverseEdges);

                    if (that.spCircle) that.spCircle.remove();
                    that.spCircle = that.node.append("circle")
                                        .filter(function(d) { return arr.includes(d.id); })
                                        .attr("class", "spCircles")
                                        .attr("r", function(d){ return d.influence/2 > 20 ? d.influence/2 : 20; })
                                        .attr("stroke", function(d){ return that.c10(4); })
                                        .attr("fill", "none")
                                        .style("stroke-width", 7);

                    var nodes4SPDirection = [];
                    var links4SPDirection = [];
                    var svgWidth = 400 - 20 - 20,
                        svgHeight = 100 - 10 - 10,
                        numNodes = arr.length,
                        xCoorIncrement = svgWidth/numNodes,
                        xStartingCoor = 20 + (xCoorIncrement/2),
                        yCoor = (svgHeight/3) * 2,
                        count = 0;

                    arr.forEach((d) => {
                        // Does not mutate the state. Only iterating it to get data from
                        this.state.nodes.forEach((o) => {
                            if (o.id === d) {
                                var tempNode = o;
                                tempNode.xCoorInSPDir = xStartingCoor + (xCoorIncrement * count);
                                count++;
                                tempNode.yCoorInSPDir = yCoor;
                                nodes4SPDirection.push(tempNode);
                            }
                        });
                    })
                    that.state.links.forEach((d) => {
                        if(temp.includes(d.connectionId) || tempReverseEdges.includes(d.connectionId)) {
                            links4SPDirection.push(d);
                        }
                    });

                    this.drawSPDirection(nodes4SPDirection, links4SPDirection);
                }
            }
        } else {
            console.log(this.state.selectedProfileA);
            console.log(this.state.selectedProfileB);
            alert("Please generate the random profiles first, \n and choose profiles for A and B.");
        }
    }

    //
    drawSPDirection = (nodes4SPDirection, links4SPDirection) => {
        console.log(nodes4SPDirection);
        console.log(links4SPDirection);

        // To prevent appending more than one graph & one tooltip
        if (this.state.spDirGraphAppended) {
            this.spDirSVGElement.remove();
            this.setState({
                spDirGraphAppended: false
            });
        }
        //
        d3.select("#sp-dir-placeholder").remove();
        // To solve scope issues between React and D3
        var that = this;
        // Select the spDirSVGContainer
        this.spDirSVGContainer = d3.select("#sp-dir-svg-container");
        // Create an SVG element and append it to the DOM
        this.spDirSVGElement = this.spDirSVGContainer.append("svg")
                                .attr("viewBox", `0 0 400 100`)
                                .attr("id", "sp-dir-graph")
                                .attr("border", 1)
                                .style("border-left", "solid white 1px")
                                .style("background-color", "black")
        //
        that.spDirLinks = [];
        links4SPDirection.forEach((d) => {
            that.spDirLinks.push(
                d3.linkHorizontal()({
                    source: [Number(d.source.xCoorInSPDir), Number(d.source.yCoorInSPDir)],
                    target: [Number(d.target.xCoorInSPDir), Number(d.target.yCoorInSPDir)]
                })
            );
        });
        // Add links between nodes
        that.spDirLinks.forEach((d) => {
            that.spDirSVGElement.append('path')
                .attr('d', d)
                .attr('class', 'sp-dir-link')
                .attr('stroke', 'teal')
                .attr('fill', 'none');
        });
        console.log(nodes4SPDirection);
        //
        nodes4SPDirection.forEach((d, index) => {
            // Add a circle to each node
            that.spDirSVGElement.append('circle')
                .attr('class', 'sp-dir-node')
                .attr('cx', d.xCoorInSPDir)
                .attr('cy', d.yCoorInSPDir)
                .attr('r', 3)
                .style('fill', 'teal');
            // Add a name label to each node
            that.spDirSVGElement.append("text")
                                .attr("class", "sp-dir-profile-name")
                                .attr("x", d.xCoorInSPDir -(((d.name.length-3)/2) * 6))
                                .attr("y", () => {
                                    return (index % 2 !== 0) ? (d.yCoorInSPDir - 20) : (d.yCoorInSPDir + 25);
                                })
                                .attr("font-size", d.influence*1.5 > 10 ? d.influence*1.5 : 10)
                                .attr("fill", "white")
                                .text(d.name)
                                .style("opacity", 1);
            // Add a profile pic to each node
            that.spDirSVGElement.append("image")
                                .attr("xlink:href", d.avatar)
                                .attr("class", "sp-dir-profile-pic")
                                .attr("x", d.xCoorInSPDir - 10)
                                .attr("y", d.yCoorInSPDir - 10)
                                .attr("height", 20)
                                .attr("width", 20)
                                .style("opacity", 1);
        });

        d3.select("#sp-dir-svg-container").attr("align","center");

        this.setState({
            spDirGraphAppended: true
        });
    }
    
    // Unselect all nodes that are clicked by the user
    clearSelection = e => {
        this.setState({
            aNodeClicked: false
        });
        if (this.state.graphAppended) {
            var that = this;
            that.node.style('stroke-opacity', 1)
                .attr('fill-opacity', 1);
            that.link.style('stroke-opacity', 1)
                .style('stroke', color("#6B6B6B"));
            that.circle.style("fill", (d) => that.c10(d.zone - 2))
                .attr("r", (d) => (d.influence/2 > 7 ? d.influence/2 : 7));
            that.profileImage.style('opacity', () => that.state.profilePicsDisplayed ? 1:0)
                .attr('x', -15)
                .attr('y', -15)
                .attr('height', 30)
                .attr('width', 30);
            that.profileName.attr("y", -25)
                .style('opacity', () => that.state.profileNamesDisplayed ? 1:0);
            if (that.spCircle)
                that.spCircle.attr("r", function(d){ return d.influence/2 > 20 ? d.influence/2 : 20; })
            that.tooltip.html("Click on the profile you want to view." +
                "<p/> Click on 'Unselect' to clear selection.");
            document.getElementById('unselect-button').disabled = true;
        }
    }

    render() {
        const { numberOfProfiles, profilePicsDisplayed, profileNamesDisplayed } = this.state;

        return (
            <div className="container black white-text text-white">
                <div className="row">
                    <div className="col s12 m12 l12">
                        <h4>Social Network Visualizer &nbsp;
                            <DemoHelpGuide />
                        </h4>
                    </div>
                </div>
                <div>
                    <div className="divider"></div>
                    <ControlsMenu 
                        numberOfProfiles={numberOfProfiles} setNumOfProfilesNShowGraph={this.setNumOfProfilesNShowGraph}
                        profilePicsDisplayed={profilePicsDisplayed} displayProfilePics={this.displayProfilePics}
                        profileNamesDisplayed={profileNamesDisplayed} displayProfileNames={this.displayProfileNames}
                        resetProfileNamesPicsSetting={this.resetProfileNamesPicsSetting}
                        resetProfileSearch={this.resetProfileSearch} 
                        findSPFromAtoB={this.findSPFromAtoB} 
                        resetFromAtoB={this.resetFromAtoB}
                    />
                    <div className="section">
                        <div className="row" style={{marginBottom: "0px"}}>
                            <div className="col s12 m3 l3">
                                <div className="row">
                                    <div className="col s9 m10 l9">
                                        <div style={{display: 'inline-flex', verticalAlign: 'middle', alignContent: 'center'}}>
                                            <a href="#" data-target="slide-out" className="sidenav-trigger">
                                                <i className="material-icons small teal-text">menu</i>
                                            </a>
                                            &nbsp;
                                            <span> &#8592; Start Here</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col s9 m10 l8 left">
                                        <div id="clear-selection-btn-container">
                                            <button className="waves-effect waves-light teal darken-2 white-text btn left"
                                                id="unselect-button"
                                                onClick={this.clearSelection}
                                                disabled={!this.state.aNodeClicked}
                                            >
                                                    Unselect
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col s12 m9 l9">
                                <div id="sp-dir-svg-container"></div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col s12 m12 l12">
                            <div className="row">
                                <div className="black col s12 m12 l12" align="center">
                                    <div id="svg-container"></div>
                                </div>
                                {/* <div id={'#' + this.props.id}></div> */}
                            </div>
                            <div>
                                <span>About this profile</span>
                                <div id="tooltip-container" className="">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default RandomSN;