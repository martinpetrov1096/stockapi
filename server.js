const express = require('express');
const app = express();

const cfg = require('./config/config.json');
const fmp = require('financialmodelingprep')(cfg.apiKey)
const api = require('./DataBuilder/api.js');

const Stocks = require('./DataBuilder/ModelBuilder.js');


app.listen(cfg.port, () => {
   console.log(`Example app listening at http://localhost:${cfg.port}`);
});

app.get('/', async (req, res) => {

   api.getTopHundred().then((companies) => {
    
         console.log(companies)
         let model = new Stocks.ModelBuilder();
         model.addOutputs(['priceToOperatingCashFlowsRatio']);
         model.addStocks(companies.slice(0,30));

         model.addInputs(['totalDebtToCapitalization']);
         model.addInputs(['returnOnEquity']);
         model.addInputs(['symbol']);
         model.addInputs(['date']);
         model.generateData().then((s) => {
            console.log(s)
         });
      

   
   
      res.send('All Good')

   })
   .catch((err) => {
      console.log(err.message)
   });



});
