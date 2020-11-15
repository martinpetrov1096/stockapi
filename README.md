# stockapi

## Folder Structure
### /ModelBuilder
Inside modelBulder, there's the code for the dataScraper, and potentially 
the ModelBuilder class if you guys decide to go that route (more details in
ModelBuilder.js). 
#### /DataScraper
##### DataScraper.js
This file contains the DataScraper class

#### cache/ 
This file is where the DataScraper caches its requests. I made it this 
way because otherwise you would have to wait 100ms between requests to the
api that we're using, and this speeds things up after the initial requests

### /index.js
A quick example of how to use the datascaper class. It should be
fairly straightforward so I didn't actually write any documentation for
it. Lmk if something's confusing.