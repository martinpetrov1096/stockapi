#!/usr/bin/env node
const inquirer = require('inquirer');
const fs = require('fs');

const stockTickers = require('./config/nasdaqTickerNames.json');
const modelInputs = require('./config/paramRatios.json');
const api = require('./DataBuilder/api.js');
const Stocks = require('./DataBuilder/ModelBuilder.js');

let model = new Stocks.ModelBuilder();
model.addOutputs(['daysOfPayablesOutstanding']) //TODO, fix later


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
   choices: modelInputs
}
function addParams() {
   inquirer.prompt(inputsQ).then((a) => {
      model.addInputs(a.inputs);
      mainMenu();
   });
}




mainMenu();