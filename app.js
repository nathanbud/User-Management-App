const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const redis = require('redis');

//Set port
const port = 3000;

//Init app
const app = express();

app.use(express.urlencoded({ extended: false }));

//Create Redis Client
let client = redis.createClient();

client.on('connect', () => console.log('Connected to Redis'));

//View Engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
//app.set('views', path.join(__dirname, 'views'));

//methodOverride
app.use(methodOverride('_method'));

//Search Page
app.get('/', (req, res, next) => {
  res.render('searchUser');
});

//Search User Processing
app.post('/user/search', (req, res, next) => {
  const id = req.body.id;
  console.log(id);

  client.hgetall(id, (err, obj) => {
    if (!obj) {
      res.render('index', {
        error: 'User does not exist',
      });
    } else {
      obj.id = id;
      res.render('details', {
        user: obj,
      });
    }
  });
});

//Add User Page
app.get('/user/add', (req, res, next) => {
  res.render('addUser');
});

//Process User Page
app.post('/user/add', (req, res, next) => {
  res.render('addUser');
});

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
