import React, { Component } from 'react';

class Header extends Component {
    render() {
        return (
            <header>
                <nav>
                    <div className="nav-wrapper teal teal darken-2">
                        <div className="row">
                            <div className="col s3">
                                <a href="/" className="left brand-logo">
                                    SNV
                                </a>
                            </div>
                            <div className="col s9">
                                <ul className="right">
                                    <li>
                                        <a href="/demo">Try It</a>
                                    </li>
                                    <li>
                                        <a href="/">Sign in with Google</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>    
                </nav>
            </header>
        );
    }
}

export default Header;