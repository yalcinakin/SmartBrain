import React, { Component } from 'react';
import './App.css';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import Signin from './components/Signin/Signin.js';
import Register from './components/Register/Register.js';



const particlesOptions = {
	particles: {
    number: {
      value: 150,
      density: {
        enable: true,
        value_area: 800
      }
    }
	}
}

const initialState = {
  input: '',
  imageURL: '',
  boxes: [],
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor(){
    super();

    this.state= initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }});
  }

  calculateBoundingBox = (data) => {
		const image = document.getElementById('input-image');
    const width = Number(image.width);
    const height = Number(image.height);

    const faceData = data.outputs[0].data.regions.map( row => {
			const faceBox = row.region_info.bounding_box;

			return {
	      topRow: faceBox.top_row * height,
	      rightCol: width - (faceBox.right_col * width),
	      bottomRow: height - (faceBox.bottom_row * height),
	      leftCol: faceBox.left_col * width
	    }
		});
		return faceData;
  }

  displayFaceBox = (boxes) => {
    // console.log(box);
    this.setState({boxes: boxes});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onPictureSubmit = () => {
    this.setState({imageURL: this.state.input});
    fetch('http://localhost:3001/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(response => response.json())
    .then(response => {
      if(response) {  // .outputs[0].data.regions  ----> if there is an image with a face
        fetch('http://localhost:3001/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
          .catch(console.log)
          // this.displayFaceBox(this.calculateBoundingBox(response))
      }
      // else {
      //   this.setState({imageURL: ''});
      //   this.setState({box: {}});
      //   alert("Broken link or no face image");
      // }
      this.displayFaceBox(this.calculateBoundingBox(response))
    })
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'home'){
      this.setState({isSignedIn: true});
    }
    else if (route === 'signout') {
      this.setState(initialState);
    }
    this.setState({route: route});
  }

  render() {
    const {isSignedIn, boxes, imageURL, route, user } = this.state;
    return (
      <div className="App">
        <Particles className='particles' params={particlesOptions} />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
        { route === 'home'
          ? <div>
              <Logo />
              <Rank name={user.name} entries={user.entries}/>
              <ImageLinkForm onInputChange={this.onInputChange} onPictureSubmit={this.onPictureSubmit} />
              <FaceRecognition boxes={boxes} imageURL={imageURL}/>
            </div>
          : (route === 'signin'
            ? <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
          : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>)
        }
      </div>
    );
  }
}

export default App;

// componentDidMount() {
//   fetch('http://localhost:3001')
//     .then(response => response.json())
//     .then(console.log);
// }
