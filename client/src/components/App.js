import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faCheckSquare, faCoffee } from '@fortawesome/free-solid-svg-icons';

import Header from './Header';
import Landing from './Landing';
import GenerateRandomSN from './GenerateRandomSN';
import SocialNetworkGraph from './SocialNetworkGraph';
import Footer from './Footer';

library.add(fab, faGithub, faCheckSquare, faCoffee);

const Dashboard = () => <h3>Dashboard</h3>

class App extends Component {
  componentDidMount() {
    this.props.fetchRandomSN();
  }

  render() {
    return (
      <div className="s m l xl">
        <BrowserRouter>
          <div style={{display: "flex", minHeight: "100vh", flexDirection: "column"}}>
              <Header />
              <main style={{flex: "1 0 auto"}}>
                <Route exact path="/" component={Landing} />
                <Route exact path="/dashboard" component={Dashboard} />
                <Route exact path="/demo" component={GenerateRandomSN} />
                {/* <Route exact path="/test" component={SocialNetworkGraph} /> */}
              </main>
              <Footer />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default connect(null, actions)(App);
