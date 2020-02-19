import React, { Component } from 'react';
// import SocialNetworkGraph from './SocialNetworkGraph';
import RandomSN from './RandomSN';

class GenerateRandomSN extends Component {

    generateSN() {
        // href="/api/generate/random-profiles"
        console.log("button is clicked!");
        
    }

    render() {
        return (
            <div>
                <RandomSN />
            </div>
        );
    }
}

export default GenerateRandomSN;