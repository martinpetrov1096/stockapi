
const api = require('./api.js');

class DataBuilder {

   #inputs = null;
   #outputs = null;
   #stocks = null;
   #csv = [];
   #period = ''

   constructor(stocks = [], inputs = [], outputs = [], period = 'quarter') {
      /* Sanitize Inputs */
    
      if (!Array.isArray(stocks))
         throw new Error('Param stocks must be an array');
      if (!stocks.every(s => (typeof s === 'string')))
         throw new Error('Param stocks must be an array of strings');
      
      if (!Array.isArray(inputs))
         throw new Error('Param inputs param must be an array');
      if (!inputs.every(s => (typeof s === 'string')))
         throw new Error('Param inputs must be an array of strings');
      
      if (!Array.isArray(outputs))
         throw new Error('Param outputs must be an array');
      if (!outputs.every(s => (typeof s === 'string')))
         throw new Error('Param outputs must be an array of strings');
      
      if (period != 'quarter' && period != 'annual')
         throw new Error('Param period must be either \'quarter\' or \'annual');


      this.#period = period;
      /**
       * Make these sets instead of arrays so we
       * don't have to worry about duplicates ever
       */
      this.#inputs = new Set(inputs);
      this.#outputs = new Set(outputs);
      this.#stocks = new Set(stocks);
   }

   addInputs(inputs) {
      
      /* Sanitize Inputs */
      if (!Array.isArray(inputs))
         throw new Error('Stocks param must be an array');
      if (inputs.every(s => (typeof s === 'string')))
         throw new Error('Stocks param must be an array of strings');
   



   }

   addOutputs() {

   }

   addStocks() {

   }

   async generateData() {
      let data = [];
      this.#stocks.forEach( async (stock) => {
         data = data.concat(api.getRatios(stock,'annual', 5).then((quarterRatios) => {
            return quarterRatios.map((quarterRatio) => [...this.#inputs].map((k) => {
               return quarterRatio[k];
            }));
         }));
      });
      return Promise.all(data);
   }

   removeInputs() {

   }

   removeOutputs() {


   }

}

module.exports.DataBulder = DataBuilder;
module.exports.x = 1;