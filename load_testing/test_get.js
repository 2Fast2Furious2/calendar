import http from "k6/http";

export let options = {
  vus: 15,
  duration: '60s'
};

export default function() {
    let room = Math.floor(Math.random() * 10000000);
    let address = `http://localhost:3002/rooms/${room}/reservation`;
    let response = http.get(address);
};