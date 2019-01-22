import React, { Component } from 'react';
import './App.css';
import Clarifai from 'clarifai';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import Signin from './components/Signin/Signin.js';
import Register from './components/Register/Register.js';

const app = new Clarifai.App({
 apiKey: '52d96b6836c44670ba38dcae84bdfd87'
});

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

class App extends Component {
  constructor(){
    super();

    this.state= {
      input: '',
      imageURL: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

  calculateBoundingBox = (data) => {
    const faceData = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('input-image');
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(faceData);
    return {
      topRow: faceData.top_row * height,
      rightCol: width - (faceData.right_col * width),
      bottomRow: height - (faceData.bottom_row * height),
      leftCol: faceData.left_col * width
    }
  }

  displayFaceBox = (box) => {
    // console.log(box);
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageURL: this.state.input});
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then( response => this.displayFaceBox(this.calculateBoundingBox(response)))
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'home'){
      this.setState({isSignedIn: true});
    }
    else if (route === 'signout') {
      this.setState({isSignedIn: false});
    }
    this.setState({route: route});
  }

  render() {
    const {isSignedIn, box, imageURL, route } = this.state;
    return (
      <div className="App">
        <Particles className='particles' params={particlesOptions} />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
        { route === 'home'
          ? <div>
              <Logo />
              <Rank />
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
              <FaceRecognition box={box} imageURL={imageURL}/>
            </div>
          : (route === 'signin'
            ? <Signin onRouteChange={this.onRouteChange}/>
            : <Register onRouteChange={this.onRouteChange}/>)
        }
      </div>
    );
  }
}

export default App;
