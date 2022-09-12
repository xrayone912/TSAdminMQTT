const find = require('local-devices');
const axios = require('axios');
const param = 'cm?cmnd=status';
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
        .get('http://' + element + '/' + param)
        .then((resp) => {
          if (resp.status === 200 && resp.data.Status !== undefined) {
            resp.data.Status['ip'] = element;
            resp.data.is401 = false;
            adapter.push(resp.data.Status);
          }
        })
        .catch(function (error) {
          if (error.response.status === 401) {
            var info = "IP: " + element + " Adapter with access data found Please enter user name and password in the next step then the adapter name will be updated"
            adapter.push({FriendlyName: [info], ip: element, is401: true})
          }
        });

    });
  });
  return adapter;
}
