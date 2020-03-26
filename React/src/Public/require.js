import axios from 'axios'
const baseUrl = 'http://14.215.118.142:8084/TestBed/'


function GET(url, params) {
  return axios.get(baseUrl + url, { params })
}

function POST(url, params) {
  return axios.post(baseUrl + url, params)
}

function GetFile(url, params) {
  return axios.get(baseUrl + url, {
    params,
    responseType: 'arraybuffer'
  })
}

export {
  GET, POST, GetFile
}