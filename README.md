# Amazon Product Lookup by ASIN

## Requirements
* Based on category, rank & product dimensions

## Planning
* Front-end: Vanilla JS
* Back-end: Node
* Database: MongoDB 
* Reason: familiarity of technology, time crunch

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

# Documenting difficulties:
* Navigating Amazon ecommerce ecosystem to figure out which API to call for retrieving product info with