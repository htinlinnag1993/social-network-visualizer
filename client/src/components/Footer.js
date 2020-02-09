import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Footer extends Component {
    render() {
        return (
            <footer className="page-footer teal teal darken-2">
                <div className="row">
                    <div className="col s12 m4 l9">
                        © 2020 Copyright SNV
                    </div>
                    <div className="col s12 m8 l3">
                        <a className="grey-text text-lighten-4 right" href="#!">
                            <FontAwesomeIcon icon={['fab', 'github']} size="lg" />
                            &nbsp; htinlinnag1993@gmail.com
                        </a>
                    </div>
                </div>
            </footer>
        );
    }
}

export default Footer;





