const find = require('local-devices');
const axios = require('axios');
const credentials = 'cm?user=admin&password=acidforce807711!&cmnd=status';
// Find all local network devices.

function findAllDevices() {
  cache = [] = [];
  adapter = [] = [];

  find().then(async (devices) => {
    devices.forEach((element) => {
      cache.push(element.ip);
    });
    cache.forEach((element) => {
      axios
        .get('http://' + element + '/' + credentials)
        .then((resp) => {
          if (resp.status === 200 && resp.data.Status !== undefined) {
            resp.data.Status['ip'] = element;
            adapter.push(resp.data.Status);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  });
  return adapter;
}
