import axios from 'axios' 
axios.defaults.withCredentials = true

export const login = (token) => axios.post('/login_google', {token: token})