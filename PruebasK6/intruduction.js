import http from 'k6/http';

export default function() {
  let url = 'https://httpbin.org/post';
  let response = http.post(url, 'Hello world!');
  console.log(response.json().data);
}