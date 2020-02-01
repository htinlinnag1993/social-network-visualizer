import React, { Component } from 'react';
import * as d3 from 'd3';

class SocialNetworkGraph extends Component {

    componentDidMount() {
        this.drawChart();
    }

    drawChart() {
        const data = [12, 5, 6, 6, 9, 10];
        const svg = d3.select("body")
                        .style("background-color", "black")
                        .append("svg")
                        .attr("width", 700)
                        .attr("height", 500)
                        .style("margin-left", 100);
        svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", (d, i) => i* 70)
            .attr("y", (d, i) => 500 - 10 * d)
            .attr("width", 65)
            .attr("height", (d, i) => d * 10)
            .attr("fill", "steelblue")
            .on("mouseenter", function(d,i){
                d3.select(this).attr("fill", "midnightblue");
            })
            .on("mouseleave", function(d,i){
                d3.select(this).attr("fill", "steelblue");
            });
        svg.selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .text((d) => d)
            .attr("x", (d, i) => i * 70)
            .attr("y", (d, i) => 500 - (10 * d) - 3)
            .attr("fill", "white");
    }

    render() {
        return <div id={'#' + this.props.id}></div>
    }
}

export default SocialNetworkGraph;