import React from 'react';
import './ProfileIcon.css';

class ProfileIcon extends React.Component{
  constructor(props){
    super(props)

    this.state = {
      dropdownOpen: false
    }
  }

  toggle = () => {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  render(){

    return(
      <div className="pa2 tc">
        <div className="dropdown nav-element">
          <img
            src="http://tachyons.io/img/logo.jpg"
            className="br-100 h3 w3 dib" alt="avatar" />
          <div className="dropdown-content">
            <p onClick ={ this.props.toggleModal }>View Profile</p>
            <p onClick = { () => this.props.onRouteChange('signout')} >Sign Out</p>
          </div>
       </div>

      </div>
    );
  }

}

export default ProfileIcon;
