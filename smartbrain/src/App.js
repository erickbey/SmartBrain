import './App.css';
import React, {  useState } from 'react';
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm';
import Logo from './components/logo/Logo';
import Navigation from './components/navigation/Navigation';
import Rank from './components/rank/Rank';
import FaceRecognition from './components/faceRecognition/FaceRecognition';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import SignIn from './components/signIn/SignIn';
import Register from './components/register/Register';



function App() {
  const [input, setInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [boxCoordinates, setBoxCoordinates] = useState({});
  const [route, setRoute] = useState('signin');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userProfile, setUserProfile] = useState({
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  })

  const initialState = () => {
    setInput('');
    setImageUrl('');
    setBoxCoordinates({});
    setRoute('signin');
    setIsSignedIn(false);
    setUserProfile({
      id: '',
      name: '',
      email: '',
      entries: 0,
      joined: ''
    })
  }

  const loadUser = (userData) => {
    setUserProfile({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      entries: userData.entries,
      joined: userData.joined
    })
  }
  
  
   const particlesOptions = {
    fpsLimit: 120,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "repulse",
        },
        resize: true,
      },
      modes: {
        push: {
          quantity: 4,
        },
        repulse: {
          distance: 100,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: "#ffffff",
      },
      links: {
        color: "#ffffff",
        distance: 150,
        enable: true,
        opacity: 0.5,
        width: 1,
      },
      collisions: {
        enable: true,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: false,
        speed: 2,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 900,
        },
        value: 80,
      },
      opacity: {
        value: 0.5,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 5 },
      },
    },
    detectRetina: true,
  }

  const calculateBoxCoordinates = (data) => {
    const faceCoordinates = JSON.parse(data, null, 2).outputs[0].data.regions[0].region_info.bounding_box;
    console.log(faceCoordinates)
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftColumn: faceCoordinates.left_col * width,
      topRow: faceCoordinates.top_row * height,
      rightColumn: width - (faceCoordinates.right_col * width),
      bottomRow: height - (faceCoordinates.bottom_row * height)
    }
  }

  const displayFaceBox = (boxCoordinates) => {
    console.log(boxCoordinates)
    setBoxCoordinates(boxCoordinates);
  }

  const onInputChange = (e) => {
    console.log(input)
    setInput(e.target.value)
  }

  const onSubmit = () => {
    setImageUrl(input);
    fetch('http://localhost:3000/imageUrl', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input
        })
      })
      .then(response => response.text())
      .then(result => {
        if(result) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: userProfile.id
            })
          })
          .then(response => response.json())
          .then(count => {
            setUserProfile({...userProfile, entries: count})
          })
        }
        displayFaceBox(calculateBoxCoordinates(result))
      })
      .catch(error => console.log('error', error));
  }

  const onRouteChange = (route) => {
    if (route === 'signout') {
      initialState();
    } else if (route === 'home') {
      setIsSignedIn(true)
    }
    setRoute(route);
  }

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <div className="App">
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />
      { route === 'home' 
        ? <div>
            <Logo />
            <Rank name={userProfile.name} entries={userProfile.entries} />
            <ImageLinkForm 
              onInputChange={onInputChange} 
              onSubmit={onSubmit}/>
            <FaceRecognition boxCoordinates={boxCoordinates} imageUrl={imageUrl} />
            </div>
        : ( route === 'signin'
        ? <SignIn onRouteChange={onRouteChange} loadUser={loadUser} />
        : <Register onRouteChange={onRouteChange} loadUser={loadUser} />
        )
      }
          
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
    />
    </div>
  );
}

export default App;
