import React from 'react';


const Card = ({ width, height, padding, children }) => {
  return (
    <div className="card" style={{ width: width || '100%', height: height || '100%', padding: padding || '35px' }}>
      <div className="card-content">
        {children}
      </div>

    </div>
  );
};

export default Card;
