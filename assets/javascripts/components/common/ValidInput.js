import React from 'react';
import classNames from 'classnames';

export default ({ class_names, errors, children }) => {
  let classes = classNames( class_names, { errors });
  return (
    <div className={ classes }>
      { children }
      { errors ? <span className="error-message">{ errors.join(', ') }</span> : null }
    </div>
  );
};