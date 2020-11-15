#!/usr/bin/env node
const inquirer = require('inquirer');
const fs = require('fs');

const stockTickers = require('./ModelBuilder/config/nasdaqTickerNames.json');
const paramsRatios = require('./ModelBuilder/config/paramsRatios.json');
const paramsBalance = require('./ModelBuilder/config/paramsBalance.json');
const paramsIncome = require('./ModelBuilder/config/paramsIncome.json');
const paramsCustom = require('./ModelBuilder/config/paramsCustom.json');
const api = require('./ModelBuilder/DataScraper/api.js');
const Stocks = require('./ModelBuilder/DataScraper/DataScraper.js');

///////////////////////////////////////////////////////////////////////
///////////////////////////// EXAMPLE /////////////////////////////////
///////////////////////////////////////////////////////////////////////

let model = new Stocks.DataScraper();
model.setLimit(3);
model.addStocks(['AAPL', 'GOOG', 'GOOGL']);
model.removeStock(['AAPL', 'GOOG'])
model.addParams(['shortTermInvestments', 'revenue', 'cashRatio']);
model.generateModel().then((m) => {
   console.log(m);
});


/**
 * Description. This is a super jank cli version of the program. I don't expect us 
 * to actually use any of the code below, it was just a useful tool to debug stuff
 * To "activate" it, just uncomment the mainMenu() call all the way at the bottom
 * 
 */
var mainMenuQ = {
   type: 'list',
   name: 'mainMenu',
   message: "What do you want to do?",
   choices: ['Add Stock', 'Add Params', 'Generate CSV', 'Quit']
};
function mainMenu() {
   inquirer.prompt(mainMenuQ).then((a) => {
      if (a.mainMenu == 'Add Stock')
         addStocks();
      else if (a.mainMenu == 'Add Params') {
         addParams();
      }
      else if (a.mainMenu == 'Generate CSV') {
         model.generateModel().then((m) => {
            console.log(m);
         })
         .catch((err) => {
            console.log(err.message);
            mainMenu();
         })
      }
      else {
         console.log('Exiting. . .');
      }
  });
}

let stocksQ = {
   type: 'checkbox',
   name: 'stocks',
   message: 'Select Stocks',
   choices: ['Top 100', ...stockTickers]
}
function addStocks() {
   inquirer.prompt(stocksQ).then((a) => {
      if (a.stocks.includes('Top 100')) {
         api.getTopHundred().then((companies) => {
            model.addStocks(companies);
         });
      } 
      model.addStocks(a.stocks.slice(1,));
      mainMenu();
   });
}

let inputsQ = {
   type: 'checkbox',
   name: 'inputs',
   message: 'Select Model Input Params',
   choices: [
      ...paramsBalance, 
      ...paramsCustom,
      ...paramsIncome,
      ...paramsRatios
   ] 
};
function addParams() {
   inquirer.prompt(inputsQ).then((a) => {
      model.addParams(a.inputs);
      mainMenu();
   });
}


//mainMenu();
