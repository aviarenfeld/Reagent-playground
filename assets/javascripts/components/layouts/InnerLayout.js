/*
  Interna Application Layout
  This essentially encapuslates anything that requires
  login/authorization to render.
*/

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import Session from '../session/Session';

function InnerLayout ({ children }) {
  return (
    <div className='inner-layout'>
      <Session />
      <h4>Inner Application Layout</h4>
      <div className="nav-container">
        <h5>Private Navigation</h5>

        <nav id="public-navigation">
          <Link to="baz" activeClassName="active">Baz</Link>
          <Link to="biz" activeClassName="active">Biz</Link>
        </nav>
      </div>

      <div className='view-container'>
        <h5>Private Application Content</h5>
        {children}
      </div>
    </div>
  )
}

InnerLayout.propTypes = {
  children: PropTypes.element
}

export default InnerLayout;