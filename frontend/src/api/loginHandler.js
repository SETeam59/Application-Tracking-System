import fetch from './handler'

export const getToken = (params) => {
  let res =  fetch({
    method: 'POST',
    url: '/users/login',
    body: params
  })
  return res
}

export const signUp = (params) => {
  return fetch({
    method: 'POST',
    url: '/users/signup',
    body: params
  })
}

export const storeToken = (obj) => {
  localStorage.setItem('token', obj.token)
  localStorage.setItem('expiry', obj.expiry)
}
