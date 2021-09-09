import logo from './logo.svg';
import './App.css';
import { GoogleLogin } from 'react-google-login'
import axios from 'axios'
import { useEffect, useState } from 'react';



function App() {
  const [data, setdata] = useState({})
  const [auth, setauth] = useState(false)
  useEffect(() => {
    axios({
      method: 'post',
      url: '/auth',
      data: {
        token: localStorage.getItem('jwt')
      }
    }).then(res => {
      setdata({name: res.data.name})
      setauth(true)
    })
  }, [])

  const responseGoogle = async (response) => {
    const token = await response.tokenId ;
    axios({
      method: 'post',
      url: '/login_google',
      data: {
        token: token
      }
    }).then(res => {
      setdata({
        name: res.data.name
      })
      localStorage.setItem('jwt', res.data.token)
      setauth(true)
    })
  }

  
  return (
    <>
      {
        auth ? 
          <h1>Hello <span className="name">{data.name}</span> </h1>
          : 
          <GoogleLogin
            clientId="1051253608581-t6spbonqcpcipoceb8tr57g5g4rvdmh0.apps.googleusercontent.com"
            render={renderProps => (
              <div
              onClick={renderProps.onClick} disabled={renderProps.disabled}
              className="button">
                    <i className="fab fa-google icon"></i>
                    <p className="text">Login with google </p>
              </div>
            )}
            buttonText="Login"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={'single_host_origin'}
          />
        
      }
    </>
    
  );
}

export default App;
