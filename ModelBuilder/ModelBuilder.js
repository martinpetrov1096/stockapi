/**
 * Description. Personally I'd recommend to just create a modelBuilder class that
 * has a DataScraper object encapsulated within it. And then just have this class 
 * be able to do the following
 * 
 * 1. Generate a data csv from the json the DataScraper creates
 * 2. Generate a "hyperparameter" json file that has all of the proper
 * parameters for the model. This way, the ml team can have their model
 * run by just giving it the data csv and the hyper param json file.
 * I'm imagining it'd have the following stuff inside:
 *  a. which cols from the data csv are inputs
 *  b. which cols from the data csv are outputs
 *  c. Additional hyper params the user of the site can tune to generate 
 *     the model, such as num epochs, lr, etc
 * So ya, just make this class also hold all of the hyper params for each user
 * 
 * 
 * 
 */