import React from 'react';
import Tilt from 'react-tilt';
import './Logo.css';
import brain from './brain.png';

const Logo = () => {
  return (
    <div>
      <Tilt className="Tilt br2 shadow-2" options={{ max : 55 }} style={{ height: 150, width: 150 }} >
        <div className="Tilt-inner" style={{paddingTop: '10px'}} >
          <img src={brain} alt="brain" />
        </div>
      </Tilt>
    </div>
  );
}

export default Logo;
