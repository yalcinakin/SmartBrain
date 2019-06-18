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
import Modal from './components/Modal/Modal.js';
import Profile from './components/Profile/Profile.js';


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
	isProfileOpen: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: '',
		age: 0,
		pet: ''
  }
}

class App extends Component {
  constructor(){
    super();

    this.state= initialState;
  }

	componentDidMount() {
		const token = window.localStorage.getItem('token');

		if(token){
			fetch('http://localhost:3001/signin', {
				method: 'post',
				headers:
				{
					'Content-Type': 'application/json',
					'Authorization': token
				}
			})
			.then(response => response.json())
			.then( data => {
				if(data && data.id){
          fetch(`http://localhost:3001/profile/${data.id}`, {
						method: 'get',
						headers:
						{
							'Content-Type': 'application/json',
							'Authorization': token
						}
					})
						.then(resp => resp.json())
						.then(user => {
							if(user && user.email){
								this.loadUser(user);
								this.onRouteChange('home');
							}
						})
						.catch(console.log)
        }
			})
			.catch(console.log)
		}
	}

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
			age: data.age,
			pet: data.pet
    }});
  }

  calculateBoundingBox = (data) => {
		if(data && data.outputs){
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
		return;
  }

  displayFaceBox = (boxes) => {
    if(boxes){
			this.setState({boxes: boxes});
		}
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onPictureSubmit = () => {
    this.setState({imageURL: this.state.input});
    fetch('http://localhost:3001/imageurl', {
      method: 'post',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': window.localStorage.getItem('token')
			},
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(response => response.json())
    .then(response => {
      if(response.outputs) {  // if there is an image with a face
        fetch('http://localhost:3001/image', {
          method: 'put',
          headers: {
						'Content-Type': 'application/json',
						'Authorization': window.localStorage.getItem('token')
					},
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
			window.localStorage.removeItem('token');
      this.setState(initialState);
    }
    this.setState({route: route});
  }

	toggleModal = () => {
		this.setState(prevState => ({
			isProfileOpen: !prevState.isProfileOpen
		}))
	}

  render() {
    const {isSignedIn, boxes, imageURL, route, user, isProfileOpen } = this.state;
    return (
      <div className="App">
        <Particles className='particles' params={particlesOptions} />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn} toggleModal={this.toggleModal} />
				{	isProfileOpen &&
					 <Modal>
						<Profile user={this.state.user} toggleModal={this.toggleModal} loadUser={this.loadUser} />
					</Modal>
				}
				{ route === 'home'
          ? <div>
              <Logo />
              <Rank name={user.name} entries={user.entries}/>
              <ImageLinkForm onInputChange={this.onInputChange} onPictureSubmit={this.onPictureSubmit} />
              <FaceRecognition boxes={boxes} imageURL={imageURL}/>
            </div>
          : (route === 'register'
            ? <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
						: <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser}/> )
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
