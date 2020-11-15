# stockapi

## Folder Structure
### /ModelBuilder
Inside modelBulder, there's the code for the dataScraper, and potentially 
the ModelBuilder class if you guys decide to go that route (more details in
ModelBuilder.js). 


#### /ModelBuilder/config
This folder just contains various config files. After cloning, copy config-sample.json
and rename as config.json. Everything besides the apikey should be in there. The files 
named params-*.json are all of the "valid" params that the DataScraper class recognizes.
The DataScraper class checks against these when adding params, and should throw an error
if it receieves an invalid param. They also help as a quick way to grab random params for
testing/debugging. nasdaqTickerNames.json could be useful in the future to have the dataScraper
class throw an error when trying to add an unknown stock name, though I need to grab a more
up to date file containing valid stock names

##### /DataScraper/DataScraper.js
This file contains the DataScraper class

#### cache/ 
This file is where the DataScraper caches its requests. I made it this 
way because otherwise you would have to wait 100ms between requests to the
api that we're using, and this speeds things up after the initial requests

### /index.js
A quick example of how to use the datascaper class. It should be
fairly straightforward so I didn't actually write any documentation for
it. Lmk if something's confusing.