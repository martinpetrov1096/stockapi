const http = require('axios');
const fs = require('fs');
const cfg = require('./config/config.json');

const timer = ms => new Promise(res => setTimeout(res, ms));
var delay = 0;
/**
 * @return [] Returns array of the top 100 nasdaq
 * companies
 */
module.exports.getTopHundred = async () => {
   let params = {
      'apikey': cfg.api.key
   };
   let companies = await myGet('nasdaq_constituent', params);
   return companies.map((x) => {
      return x.symbol;
   });
}

module.exports.getStandard = async (endpoint, stockName, period, limit) => {
   let params = {
      'period': period,
      'limit': limit,
      'apikey': cfg.api.key
   }
   return myGet(endpoint + stockName, params, period, limit);
}


/**
 * Description. This is a wrapper for an axios get request. Additionally, it
 * saves the request to a file, and if the file for the request exists, it will
 * return it instead of making the request again
 * @param {*} url The url (not including the base domain) for the request 
 * @param {*} params The params that axois needs
 */
async function myGet(url, params, period, limit) {
   let fileName = __dirname 
                + cfg.api.cacheDir 
                + url.replace('/', '-') 
                + '-period=' + period
                + '-limit=' + limit
                + '.json';

   if (fs.existsSync(fileName)) {
      return JSON.parse(await fs.promises.readFile(fileName, 'utf8'));
   } else {
      setTimeout(() => {
         return http.get(cfg.api.baseUrl + url, {
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
   }, delay+=cfg.api.timeBetweenRequests)
   }   
}