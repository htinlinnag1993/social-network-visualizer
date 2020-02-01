import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';

import Header from './Header';
import GenerateRandomSN from './GenerateRandomSN';
import SocialNetworkGraph from './SocialNetworkGraph';

const Dashboard = () => <h3>Dashboard</h3>
const Landing = () => <h3>Landing</h3>

class App extends Component {
  componentDidMount() {
    this.props.fetchRandomSN();
  }

  render() {
    return (
      <div className="s m l xl">
        <BrowserRouter>
          <div>
            <div>
              <Header />
              <div className="container black white-text text-white">
                <Route exact path="/" component={Landing} />
                <Route exact path="/dashboard" component={Dashboard} />
                <Route exact path="/demo" component={GenerateRandomSN} />
                <Route exact path="/test" component={SocialNetworkGraph} />
              </div>
            </div>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default connect(null, actions)(App);
