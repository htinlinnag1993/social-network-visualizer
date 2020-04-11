import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faCheckSquare, faCoffee } from '@fortawesome/free-solid-svg-icons';

import Header from './Header';
import Landing from './Landing';
import Dashboard from './Dashboard/Dashboard';
import RandomSN from './RandomSN';
import SocialNetworkGraph from './SocialNetworkGraph';
import Footer from './Footer';
import CreateNewNetwork from './CreateNewNetwork/CreateNewNetwork';
import FileUploadNewNetwork from './CreateNewNetwork/FileUploadNewNetwork';

library.add(fab, faGithub, faCheckSquare, faCoffee);

// const Dashboard = () => <h3>Dashboard</h3>

class App extends Component {
  componentDidMount() {
    this.props.fetchUser();
    // this.props.fetchRandomSN();
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
                <Route exact path="/demo" component={RandomSN} />
                <Route exact path="/new/network" component={CreateNewNetwork} />
                <Route exact path="/new/network/fileupload" component={FileUploadNewNetwork} />
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
