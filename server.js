const express = require('express');
const app = express();

const cfg = require('./config.json');
const fmp = require('financialmodelingprep')(cfg.apiKey)
const myApi = require('./api.js');

let cmpns = []
myApi.getTopHundred()
   .then((apiRes) => {
      cmpns = apiRes;
      //console.log(cmpns)
   });


app.listen(cfg.port, () => {
   console.log(`Example app listening at http://localhost:${cfg.port}`);
});

app.get('/', async (req, res) => {

   console.log(cmpns)

   res.send('Hello World!');

   fmp.stock(cmpns).financial.income().then(response => console.log(response));
   //   fmp.stock(cmpns[0]).quote().then(response => console.log(response));


});
