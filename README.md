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

## Documenting difficulties:
* Navigating Amazon ecommerce ecosystem to figure out which API to call for retrieving product info with
  * Realizing that we have to visit actual product page and fetch elements
* Finding the right DOM elements were annoying -- it may not even work, lets find out

## Getting info from DOM elements: 

### Rank
* inside div with ID productDetails_db_sections
  * in tbody, <tr> where there is a <th> with the inner text Best Sellers Rank, get the inner text of all the children of its subsequent <td><span></span></td>

### Category
* String inside previous inner text found

### Dimensions
* inside <table> with id productDetails_techSpec_section_2
  * in <tbody>, then <tr> with nested <th> with inner text Product Dimensions, the inner text of its subsequent <td>
