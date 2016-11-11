import React from 'react'
import { Link } from 'react-router'

export class NotFound extends React.Component {
  render () {
    return (
      <div className='container text-center'>
        <h2>You lost?</h2>
        <Link to='/'>Go home...</Link>
      </div>
    )
  }
}

export default NotFound