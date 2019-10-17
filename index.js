require('dotenv').config({
  silent: true
});

const ENV = process.env.NODE_ENV || "development";
const port = process.env.PORT || 8080;
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

const bodyParser = require('body-parser')
const puppeteer = require('puppeteer');
const randomUseragent = require('random-useragent');

const knexConfig = require('./db/knexfile');
const knex = require('knex')(knexConfig[ENV]);
const dbActions = require('./db/actions')(knex);


app.set('view engine', 'ejs');
app.set('views', './public');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));

server.listen(port, function listening() {
  console.log('Listening on %d', server.address().port);
});

app.get('/', async (req, res) => {
  res.render('index');
})

app.use((req,res,next) =>{
  console.log('Placeholder for validating and sanitizing input param');
  next();
}); 

app.post('/search_by_keyword', async(req, res, next) => {
  const keyword = req.body.keyword;
  let asins = [];
  //look for it in db
  // if in db, asins = db query results
  // if not in db, scrabe
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent(randomUseragent.getRandom())

  try {
    const response = await page.goto(``, {
      waitUntil: 'networkidle0'
    });
    const statusCode = response.headers().status

    if (statusCode !== '200') {
      next(new Error(errors[statusCode]));
    }  
  } catch (e) {
    next(e);
  }

  // await page.waitFor(2000);

  let results = await page.evaluate(async () => {
    try {
      return {}
    } catch (e) {
      console.error(JSON.stringify(e));
      return {
      };
    }
  });

  const title = await page.title();

  res.json()
})

app.post('/search_by_asin', async (req, res, next) => {

  const asin = req.body.asin;
  let retrieved;

  try {
    retrieved = await dbActions.read(asin);
  } catch (e) {
    console.error(e);
  }

  // Render product info if existing entry is complete
  if (retrieved[0] && retrieved[0].category && retrieved[0].dimensions) {
    return res.render('product', retrieved[0]);
  } else if (retrieved[0]){
    // If previously saved info is incomplete, delete entry and scrape again
    await dbActions.delete(asin);
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent(randomUseragent.getRandom())

  try {
    const response = await page.goto(`https://www.amazon.com/gp/product/${asin}`, {
      waitUntil: 'networkidle0'
    });
    const statusCode = response.headers().status

    if (statusCode !== '200') {
      next(new Error(errors[statusCode]));
    }  
  } catch (e) {
    next(e);
  }

  // await page.waitFor(2000);

  let results = await page.evaluate(async () => {
    try {
      let rank = await document.querySelector('#SalesRank');

      if (rank) {
        rank = rank.innerText;
      } else {
        rank = await [...document.querySelectorAll('#productDetails_db_sections table th')]
          .filter(a => a.innerText.includes('Best Sellers Rank'))[0].parentElement.cells[1].innerText;
      }

      let dimensions = await [...document.querySelectorAll('li b')].filter(a => a.innerText.includes('Product Dimensions:'))[0];
      dimensions = dimensions ? dimensions.parentElement.innerText : 'Not Available'

      return {
        rank: rank.replace('Amazon Best Sellers Rank','').replace(':', ''),
        dimensions: dimensions.replace('Product Dimensions','').replace(':','')
      };
    } catch (e) {
      console.error(JSON.stringify(e));
      return {
        rank: null,
        dimensions: null
      };
    }
  });

  const title = await page.title();
  results.category = title ? title.split(':')[2].trim(' ') : "Not Available";
  results.asin = asin;

  await dbActions.create(asin, results.category, results.dimensions, results.rank);
  await browser.close();
  res.render('product', {
    asin: asin,
    category: results.category ? results.category : errors.scrapeFailure,
    dimensions: results.dimensions ? results.dimensions: errors.scrapeFailure,
    rank: results.rank ? results.rank : errors.scrapeFailure
  });

})

app.use((err, req, res, next) => {
  console.error(err.stack);
  return res.render('error', {msg: err.message});
});



const errors = {
  404: 'No product exists with this ASIN', 
  scrapeFailure: 'Sorry, we were unable to retrieve this, please refresh the page and try again'
}

module.exports = server;