const params = require('./params.js');
const cfg = require('../config/config.json');
const paramsRatios = require('../config/paramsRatios.json');
const paramsBalance = require('../config/paramsBalance.json');
const paramsIncome = require('../config/paramsIncome.json');
const paramsCustom = require('../config/paramsCustom.json');
const tickerNames = require('../config/nasdaqTickerNames.json');

const api = require('./api.js');

class DataScraper {

   /**
    * @params The params for the model
    * @stocks The names of the companies you want to grab data for
    * @period Either 'quarter' or 'annual'
    */
   #params = null;
   #stocks = null;
   #model = [];
   #period = '';
   #limit = 0;

   constructor(stocks, params, period, limit) {
      /**
       * Make these sets instead of arrays so we
       * don't have to worry about duplicates ever
       */
      this.#stocks = new Set(stocks);
      this.#params = new Set(params);

      this.addStocks(stocks);
      this.addParams(params);
      this.setPeriod(period);
      this.setLimit(limit);

   }

   addParams(params = []) {
      /* Sanitize Inputs */
      if (!Array.isArray(params))
         throw new Error('Param params must be an array');
      if (!params.every(s => 
         paramsRatios.includes(s) || 
         paramsIncome.includes(s) || 
         paramsBalance.includes(s) ||
         paramsCustom.includes(s))) {
            throw new Error('At least one of the params not found in \'/config/params-....json\'');
         }
      /* Concatinate with the rest of the params we need to find */
      this.#params = new Set([...params, ...this.#params]);
   }

   addStocks(stocks = []) {
      /* Sanitize stocks */
      if (!Array.isArray(stocks))
         throw new Error('Param stocks must be an array');

      /* Concatinate with previous stocks */
      this.#stocks = new Set([...stocks, ...this.#stocks]);
   }

   async generateModel() {
      /* Make sure params and stocks are valid */
      if (this.#stocks.size == 0)
         throw new Error('Cannot generate model with no stocks');
      if (this.#params.size == 0)
         throw new Error('Cannot generate model with no params');

      let rtn = [];
      this.#params.forEach((param) => {
         rtn.push(params.getParam(param, this.#stocks, this.#period, this.#limit));
      });
      api.gtimer = 0;
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

   setPeriod(period = cfg.params.defaultPeriod) {
      if (period != 'quarter' && period != 'annual')
         throw new Error('Param period must be either \'quarter\' or \'annual');
      this.#period = period;
   }

   setLimit(limit = cfg.params.defaultLimit) {
      if (typeof limit != 'number')
         throw new Error('Param limit must either be left empty to take a default val, or a number');
      this.#limit = limit;
   }

   removeParams(params) {
      if (!Array.isArray(params))
         throw new Error('Param params must be an array');
      if (!params.every(s => typeof s == 'string'))
         throw new Error('Each param must be a string');

      params.forEach((param) => {
         this.#params.delete(param);
      });
   }

   removeStock(stocks) {
      if (!Array.isArray(stocks))
         throw new Error('Param params must be an array');
      if (!stocks.every(s => typeof s == 'string'))
         throw new Error('Each param must be a string');

      stocks.forEach((stock) => {
         this.#stocks.delete(stock);
      });
   }
}


module.exports.DataScraper = DataScraper;