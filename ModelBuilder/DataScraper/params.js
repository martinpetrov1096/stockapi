const myApi = require('./api.js');
const cfg = require('../config/config.json');
const paramsRatios = require('../config/paramsRatios.json');
const paramsBalance = require('../config/paramsBalance.json');
const paramsIncome = require('../config/paramsIncome.json');
const paramsCustom = require('../config/paramsCustom.json');

module.exports.getParam = async (param, stocks, period, limit) => {
   if (paramsRatios.includes(param)) {
      return getStandard(cfg.api.endpoints.ratios, param, stocks, period, limit);
   }
   else if (paramsBalance.includes(param)) {
      return getStandard(cfg.api.endpoints.balance, param, stocks, period, limit);
   }
   else if (paramsIncome.includes(param)) {
      return getStandard(cfg.api.endpoints.income, param, stocks, period, limit);
   } 
   else if (paramsCustom.includes(param)) {
      return getCustom(param);
   } 
   else {
      throw new Error('Invalid Param');
   }
}

async function getStandard(endpoint, param, stocks, period, limit) {
   return await myApi.getStandard(endpoint, stocks, period)
   .then(async (cmps) => {
      let rtn = [];
      cmps.forEach((cmp) => {
         cmp.slice(0, limit).forEach((period) => {
            rtn.push({
               'symbol': period['symbol'],
               'date': period['date'],
               [param]: period[param]
            });
         });
      });
      return Promise.all(rtn)
   });
}

async function getCustom(param) {


}