import http from 'k6/http';

export let options = {
  vus: 10,
  duration: '30s'
};

export default function () {
  let room = Math.floor(Math.random() * 10000000);
  let address = `http://localhost:3002/rooms/${room}/reservation`;
  var payload = JSON.stringify({
    check_in: '2099-02-01',
    check_out: '2099-02-02'
  });

  var params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  http.post(address, payload, params);
}