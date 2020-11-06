const express = require('express');
const bodyParser = require('body-parser');
const port = 3000;
const axios = require('axios').default;
const exphbs = require("express-handlebars");

const app = express();
const jsonParser = bodyParser.json()

app.set('views', `${__dirname}/views`);
app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers:  require('./helpers') //only need this
}));
app.set('view engine', 'hbs');

const BACKEND_URL = "https://rampant-arm.us-west-2.aws.cloud.dgraph.io/graphql"

async function fetchGraphQL(operationsDoc, variables) {
  const result = await axios({
    method: 'POST',
    url: BACKEND_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      query: operationsDoc,
      variables,
    }),
  })

  return result.data
}

const query = `
query {
  queryBook {
    title
    isbn
    rating {
      ratings_count
      average_rating
    }
    author {
      firstname
      lastname
    }
  }
}
`

app.get('/', jsonParser, async (req, res) => {
  let gqlResponseData = await fetchGraphQL(query,  {})

  res.render('index', { books: gqlResponseData.data.queryBook })
})

app.listen(port, () => {
  console.log(`Bookstore listening at http://localhost:${port}`)
})

