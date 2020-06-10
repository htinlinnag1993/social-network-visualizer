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
import Footer from './Footer';
import CreateNetwork from './CreateNetwork/CreateNetwork';
import CreateNetworkFileUpload from './CreateNetwork/CreateNetworkFileUpload';
import ShowNetwork from './ShowNetwork/ShowNetwork';
import EditNetwork from './EditNetwork/EditNetwork';

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
                <Route exact path="/network/new" component={CreateNetwork} />
                <Route exact path="/network/new/fileupload" component={CreateNetworkFileUpload} />
                <Route exact path="/network/show/:id" component={ShowNetwork} />
                <Route exact path="/network/edit/:id" component={EditNetwork} />
              </main>
              <Footer />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default connect(null, actions)(App);
