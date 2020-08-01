import axios from 'axios'

const instance = axios.create({
  // baseURL: 'https://vue-axios-5ffdc.firebaseio.com'
  // https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]
  baseURL: 'https://identitytoolkit.googleapis.com/v1'
})

// instance.defaults.headers.common['SOMETHING'] = 'something'

export default instance