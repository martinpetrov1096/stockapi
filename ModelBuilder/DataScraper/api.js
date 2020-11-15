const http = require('axios');
const { Service } = require('axios-middleware');
const fs = require('fs');
const cfg = require('../config/config.json');

/**
 * Description. Just a simple way to see when requests were made
 * to ensure that we're waiting an appropriate amount of time between
 * requests. If it's annoying just set cfg.debug in the config to false
 */
if (cfg.debug) {
   const service = new Service(http);
   service.register({
      onRequest(config) {
        console.log('Request Sent at: ' + new Date().getTime());
        return config;
      },
    });
}

/**
 * @return {[]} Returns array of strings representing the top 100 nasdaq 
 * companies
 */
module.exports.getTopHundred = async () => {
   let params = {
      'apikey': cfg.api.key
   };
   let companies = await myGet('nasdaq_constituent', params);
   return Promise.all(companies.map((x) => {
      return x.symbol;
   }));
}

/**
 * Description. This function is used to do the "standard" requests that currently 
 * include getting the balancesheet, income statement, cashflow statement, and 
 * ratios. Can be used for any request that has the params endpoint, period, and
 * limit in the request.
 * @param {string} endpoint The api endpoint. E.g. /ratios or /balance-sheet
 * @param {[]} stocks Array of stock names of the companies you are looking for
 * @param {string} period Either "quarter" or "annual"
 * @param {number} limit The number of quarters/years you want to grab info on
 * @return {[]} Returns a 2d array that contains the params for each stock for
 * each requests quarter
 */
module.exports.getStandard = async (endpoint, stocks, period) => {
   let params = {
      'period': period,
      'apikey': cfg.api.key
   }
   return Promise.all([...stocks].map(stock =>  
      myGet(endpoint + stock, params)
   ));
}

/**
 * Description. @gtimer is a timer that allows a timer in between requests so 
 * that we don't overwhelm the api.
 */
module.exports.gtimer = 0;

/**
 * Description. This is a wrapper for an axios get request. Additionally, it
 * saves the request to a file, and if the file for the request exists, it will
 * return it instead of making the request again
 * @param {string} url The url (not including the base domain) for the request 
 * @param {object} params The params that axois needs. Look at params variable
 * within the getStandard function (right above) for an example
 */
async function myGet(url, params) {
   let fileName = 
      __dirname 
      + cfg.api.cacheDir 
      + url.replace('/', '-') 
      + '-period=' + params.period
      + '.json';

   if (fs.existsSync(fileName)) {
      return JSON.parse(await fs.promises.readFile(fileName, 'utf8'));
   }
   else {
      return new Promise((resolve) => {
         setTimeout(() => {
            resolve(
               http.get(cfg.api.baseUrl + url, {
                  params: params
               }).then((res) => {
                  return res.data;
               })
               .then((apiRes) => {  
                  fs.writeFile(fileName, JSON.stringify(apiRes) , (err, result) => {
                     if (err) console.error(err.message);
                  });
                  return apiRes;
               })
            
            );
         }, module.exports.gtimer += cfg.api.timeBetweenRequests);
      })
   }  
}
