const http = require('axios');
const cfg = require('../config/config.json');


/**
 * @return [] Returns array of the top 100 nasdaq
 * companies
 */
module.exports.getTopHundred = () => {
   return http.get(cfg.apiUrl + '/nasdaq_constituent', {
      params: {
         'apikey': cfg.apiKey
      }
   })
   .then((apiRes) => {
      return apiRes.data.map((x) => {
         return x.symbol;
      })
   })
   .catch((err) => {
      console.error(err)
      console.error(err.message);
      return [];
   })
}

module.exports.getIncome = (stockName) => {


}

module.exports.getBalance= (stockName) => {

}

module.exports.getRatios = async (stockName, period = 'quarter', limit = 300) => {

   return http.get(cfg.apiUrl + 'ratios/' + stockName, {
      params: {
         'period': period,
         'limit': limit,
         'apikey': cfg.apiKey
      }
   })
   .then((apiRes) => {
      return apiRes.data;
   })
   .catch((err) => {
      console.error(err)
      console.error(err.message);
      return [];
   });

}