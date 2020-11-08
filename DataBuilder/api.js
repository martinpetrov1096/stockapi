const http = require('axios');
const fs = require('fs');
const cfg = require('../config/config.json');

/**
 * @return [] Returns array of the top 100 nasdaq
 * companies
 */
module.exports.getTopHundred = async () => {
   let params = {
      'apikey': cfg.apiKey
   };
   let companies = await myGet('nasdaq_constituent', params);
   return companies.map((x) => {
      return x.symbol;
   });
}

module.exports.getIncome = (stockName) => {
}

module.exports.getBalance= (stockName) => {
}

module.exports.getRatios = async (stockName, period = 'quarter', limit = 3) => {
   let params = {
      'period': period,
      'limit': limit,
      'apikey': cfg.apiKey
   }
   return myGet('ratios/' + stockName, params);
}

/**
 * Description. This is a wrapper for an axios get request. Additionally, it
 * saves the request to a file, and if the file for the request exists, it will
 * return it instead of making the request again
 * @param {*} url The url (not including the base domain) for the request 
 * @param {*} params The params that axois needs
 */
async function myGet(url, params) {
   let fileName = __dirname + cfg.apiCacheDir +  url.replace('/', '-') + '.json';

   if (fs.existsSync(fileName)) {
      return JSON.parse(await fs.promises.readFile(fileName, 'utf8'));
   } else {
      return http.get(cfg.apiUrl + url, {
         params: params
      })
      .then((apiRes) => {      
         fs.writeFile(fileName, JSON.stringify(apiRes.data) , (err, result) => {
            if (err) console.error(err.message);
         });
         return apiRes.data;
      })
      .catch((err) => {
         console.error(err.message);
         return [];
      });
   }   
}