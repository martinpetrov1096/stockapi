const express = require('express');
const app = express();

const cfg = require('./config.json');
const fmp = require('financialmodelingprep')(cfg.apiKey)
const api = require('./DataBuilder/api.js');

const tst = require('./DataBuilder/DataBuilder.js');


app.listen(cfg.port, () => {
   console.log(`Example app listening at http://localhost:${cfg.port}`);
});

app.get('/', async (req, res) => {

   api.getTopHundred().then((companies) => {
      try {
         let tmp = new tst.DataBulder(stocks = ['AAPL', 'GOOG'], inputs = ['priceToOperatingCashFlowsRatio', 'currentRatio'], outputs = [], period='annual');

         tmp.generateData().then((s) => {
            console.log(s)
         })
      }
      catch(err) {
         console.log(err.message)
       //  res.send(err.message);
      }
   
   
      res.send('All Good')

   });



});
