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
            <div className="container black white-text text-white">
                <div>
                    <RandomSN />
                </div>
            </div>
        );
    }
}

export default GenerateRandomSN;