
const params = require('./params.js');
const cfg = require('./config/config.json');
const paramsRatios = require('./config/paramsRatios.json');
const paramsBalance = require('./config/paramsBalance.json');
const paramsIncome = require('./config/paramsIncome.json');
const paramsCustom = require('./config/paramsCustom.json');
const tickerNames = require('./config/nasdaqTickerNames.json');

class ModelBuilder {

   /**
    * @inputs The input params for the model
    * @outputs What the model should predict
    * @stocks The names of the companies you want to grab data for
    * @period Either 'quarter' or 'annual'
    */
   #params = null;
   #outputs = null;
   #stocks = null;
   #model = [];
   #period = '';
   #limit = 0;

   constructor(stocks, inputs, outputs, period, limit) {
      /**
       * Make these sets instead of arrays so we
       * don't have to worry about duplicates ever
       */
      this.#stocks = new Set(stocks);
      this.#params = new Set(inputs);
      this.#outputs = new Set(outputs);

      this.addStocks(stocks);
      this.addInputs(inputs);
      this.addOutputs(outputs);
      this.setPeriod(period);
      this.setLimit(limit);
   }

   addInputs(inputs = []) {
      /* Sanitize Inputs */
      if (!Array.isArray(inputs))
         throw new Error('Param inputs must be an array');
      if (!inputs.every(s => paramsRatios.includes(s) || 
                             paramsIncome.includes(s) || 
                             paramsBalance.includes(s) ||
                             paramsCustom.includes(s)))
         throw new Error('Param inputs not found in \'/config/paramsRatios.json\'');
   
      /* Concatinate with the rest of the params we need to find */
      this.#params = new Set([...inputs, ...this.#params]);
   }

   addOutputs(outputs = []) {
      /* Sanitize outputs */
      if (!Array.isArray(outputs))
         throw new Error('Param outputs must be an array');
      if (!outputs.every(s => paramsRatios.includes(s) || 
                              paramsIncome.includes(s) || 
                              paramsBalance.includes(s) ||
                              paramsCustom.includes(s)))
         throw new Error('Param outputs not found in \'/config/paramsRatios.json\'');
   
      this.#outputs = new Set([...outputs, ...this.#outputs]);

      /* Concatinate with the rest of the params we need to find */
      this.#params = new Set([...outputs, ...this.#params]);
   }

   addStocks(stocks = []) {
      /* Sanitize stocks */
      if (!Array.isArray(stocks))
         throw new Error('Param stocks must be an array');

      /* Concatinate with previous outputs */
      this.#stocks = new Set([...stocks, ...this.#stocks]);
   }

   async generateModel() {
      /* Make sure inputs, outputs, and stocks are valid */
      if (this.#stocks.size == 0)
         throw new Error('Cannot generate model with no stocks');
      if (this.#params.size == 0)
         throw new Error('Cannot generate model with no inputs');
      if (this.#outputs.size == 0)
         throw new Error('Cannot generate model with no outputs');

      let rtn = [];
      this.#params.forEach((param) => {
         rtn.push(params.getParam(param, this.#stocks, this.#period, this.#limit));
      });

      return Promise.all(rtn).then((params) => {
         params.forEach((param) => {
            this.#model = param.map((paramRow) => {
               let data = this.#model.find(
                  (modelRow) => paramRow.symbol == modelRow.symbol
                               && paramRow.date == modelRow.date
               );
               return {...paramRow, ...data};
            });
         });
         return this.#model;
      });
   }

   getHyperParams() {
      return {
         'params': [...this.#params],
         'outputs': [...this.#outputs],
         'period': this.#period,
         'limit': this.#limit
      }
   }

   setPeriod(period = cfg.params.defaultPeriod) {
      console.log(period);
      if (period != 'quarter' && period != 'annual')
         throw new Error('Param period must be either \'quarter\' or \'annual');
      this.#period = period;
   }

   setLimit(limit = cfg.params.defaultLimit) {
      if (typeof limit != 'number')
         throw new Error('Param limit must either be left empty to take a default val, or a number');
      this.#limit = limit;
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