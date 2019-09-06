# Amazon Product Lookup by ASIN

## Get started
* clone repo
* create `.env` based on `.env.example`
* run `npm install`
* run `npm start`
* visit on browser

## Technical Debt To Resolve
* Another more performant tool - Puppeteer too heavy weight 
  * or show progressbar after clicking submit
* Alternative solution for differences in Amazon product pages -- not every page has the same selector; either this or handle additional use cases. Less brittle solution preferred -- current crawl would fail the moment Amazon changes anything
  * Error handling in place to fail gracefully and opaquely (e.g. show "not available")
* Tests
* Modularize code for POST '/'
* Dry up ejs templates and use partials
* Logging
* Scaling considerations: 
  * If expecting to scale massively, would convert backend to remove template engine, API application only serving raw JSON, launch with serverless, allow automatic scaling --> minimal amount of code, perfect for serverless deployment 
  * Front end can use static site generator and host on cdn
  * this will result in cheapest solution for scaling
  * use Nosql rather than sql db for fast operations; not a lot of entity relationship going on, relational db overkill

## Planning
* Tools:
  * Front-end: Vanilla JS
  * Back-end: Node
    * puppeteer: no web crawling exp, this was very easy to get started despite heavy weight 
    * express: usually i use Hapi for api applications, express for full stack apps 
  * Database: PostgresQL
  * Reason for most tools: familiarity of technology, time crunch

* Back-end exposes single API endpoint: 
  * /lookup?asin={asin}
    * POST operation
    * No POST param, a POST operation because a db write is performed
    * Output: 
      * product: {
        category: {string}, 
        rank: {string}, 
        dimensions: {string}
      } 
      *
    * Operations:
      * Look up product by ASIN in db; if found, return product info stored in DB
      * If not found, make call to Amazon API and fetch information, store in DB and return to front end
* Front-end has single input 
  * Form: Enter ASIN for lookup, submit button 
  * Returned input: render 

## Documenting difficulties:
* Navigating Amazon ecommerce ecosystem to figure out which API to call for retrieving product info with
  * Realizing that we have to visit actual product page and fetch elements
* Finding the right DOM elements - brittleness of getting information via selectors, not every Amazon product page has the same selectors
* Puppeteer unpredictably failing - unfamiliarity with tool and web scraping in general

