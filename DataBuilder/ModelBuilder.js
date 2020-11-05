
const api = require('./api.js');
const paramRatios = require('../config/paramRatios.json');
const tickerNames = require('../config/nasdaqTickerNames.json');



// Returns a Promise that resolves after "ms" Milliseconds
const timer = ms => new Promise(res => setTimeout(res, ms))


class ModelBuilder {

   #inputs = null;
   #outputs = null;
   #stocks = null;
   #csv = [];
   #period = '';

   constructor(stocks = [], inputs = [], outputs = [], period = 'quarter') {
      /* Sanitize Inputs */
      if (!Array.isArray(stocks))
         throw new Error('Param stocks must be an array');
      if (!stocks.every(s => tickerNames.includes(s)))
         throw new Error('Each value in param stocks must be found in \'config/nasdaqTickerNames.json\'');
      if (!Array.isArray(inputs))
         throw new Error('Param inputs param must be an array');
      if (!outputs.every(s => paramRatios.includes(s)))
         throw new Error('Param outputs not found in \'/config/paramRatios.json\'');
      if (!Array.isArray(outputs))
         throw new Error('Param outputs must be an array');
      if (!outputs.every(s => paramRatios.includes(s)))
         throw new Error('Param outputs not found in \'/config/paramRatios.json\'');
      if (period != 'quarter' && period != 'annual')
         throw new Error('Param period must be either \'quarter\' or \'annual');
      /**
       * Make these sets instead of arrays so we
       * don't have to worry about duplicates ever
       */
      this.#inputs = new Set(inputs);
      this.#outputs = new Set(outputs);
      this.#stocks = new Set(stocks);

      this.#period = period;
   }

   addInputs(inputs) {
      /* Sanitize Inputs */
      if (!Array.isArray(inputs))
         throw new Error('Param inputs must be an array');
      if (!inputs.every(s => paramRatios.includes(s)))
         throw new Error('Param inputs not found in \'/config/paramRatios.json\'');
   
      /* Concatinate with previous inputs */
      this.#inputs = new Set([...inputs, ...this.#inputs]);
   }

   addOutputs(outputs) {
      /* Sanitize outputs */
      if (!Array.isArray(outputs))
         throw new Error('Param outputs must be an array');
      if (!outputs.every(s => paramRatios.includes(s)))
         throw new Error('Param outputs not found in \'/config/paramRatios.json\'');
   
      /* Concatinate with previous outputs */
      this.#outputs = new Set([...outputs, ...this.#outputs]);
   }

   addStocks(stocks) {
      /* Sanitize stocks */
      if (!Array.isArray(stocks))
         throw new Error('Param stocks must be an array');
      // if (!stocks.every(s => tickerNames.includes(s)))
      //    throw new Error('Each value in param stocks must be found in \'config/nasdaqTickerNames.json\'');
      
      /* Concatinate with previous outputs */
      this.#stocks = new Set([...stocks, ...this.#stocks]);
   }

   async generateData() {
      /* Make sure inputs, outputs, and stocks are valid */
      if (this.#stocks.size == 0)
         throw new Error('Cannot generate model with no stocks');
      if (this.#inputs.size == 0)
         throw new Error('Cannot generate model with no inputs');
      if (this.#outputs.size == 0)
         throw new Error('Cannot generate model with no outputs');

      let data = [];
      for (var stock of this.#stocks) {
         data = data.concat(api.getRatios(stock,'annual', null).then((quarterRatios) => {
            return quarterRatios.map((quarterRatio) => [...this.#inputs].map((k) => {
               return quarterRatio[k];
            }));
         }));

         /* Wait 100ms between each request to avoid timeout */
         await timer(100);
      };
      return Promise.all(data);
   }

   removeInputs() {
      throw new Error("TODO");
   }
   removeOutputs() {
      throw new Error("TODO");
   }
   removeStock() {
      throw new Error("TODO");
   }
}

module.exports.ModelBuilder = ModelBuilder;