  import React, { Component } from 'react';
  import Navigation from './component/navigation/Navigation.js';
  import Logo from './component/logo/Logo.js';
  import Clarifai from 'clarifai';
  import ImageLinkForm from './component/ImageLinkForm/ImageLinkForm.js';
  import SignIn from './component/SignIn/SignIn.js';
  import Register from './component/Register/Register.js';
  import Facerecognition from './component/Facerecognition/Facerecognition.js';
  import Rank from './component/Rank/Rank.js';
  import './App.css';
  import Particles from 'react-particles-js';

  const app = new Clarifai.App({
   apiKey: 'ef4b92b47b164d29bc5adc12fc195dfa'
  });


  const particlesOptions={
                  particles: {
                    number: {
                      value: 100,
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
      this.state={
        input:'',
        imageUrl:'',
        box: {},
        route: 'signin',
        isSignedIn: false
      }
    }

    calculateFaceLocation=(data)=>{
      const clarifaiFace= data.outputs[0].data.regions[0].region_info.bounding_box;
      const image=document.getElementById('inputImage');
      const width= Number(image.width);
      const height= Number(image.height);
      return{
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height),
      }
    }
    displayFaceBox= (box)=> {
      console.log(box);
      this.setState({box: box})
    }

    onInputChange=(event)=>{
      this.setState({input: event.target.value});
    }
    onButtonSubmit=()=>{
      this.setState({imageUrl: this.state.input})
      app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response=> this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err=>console.log(err));
    
    }
    onRouteChange=(route)=>{
      if(route ==='signout'){
        this.setState({isSignedIn: false})
      }else if(route==='home'){
        this.setState({isSignedIn: true})
      }
      this.setState({route: route});
       }

    render() {
      const {isSignedIn,imageUrl,route,box } = this.state;
      return (
        <div className="App">
        <Particles className='particles'
                params={particlesOptions}
              />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        {
            route ==='home'
          ?<div>
            <Logo/>
            <Rank/>
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
            <Facerecognition box={box} imageUrl={imageUrl}/>
          </div>

          :(route === 'signin'
            ?<SignIn onRouteChange={this.onRouteChange}/>
            : <Register onRouteChange={this.onRouteChange}/>
            )
        }
        </div>
      );
    }
  }

  export default App;
