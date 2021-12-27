/*  EXPRESS */
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
var access_token = "";

app.get('/', function(req, res) {
  res.render('pages/index',{client_id: clientID});
});

const port = process.env.PORT || 2400;
app.listen(port , () => console.log('App listening on port ' + port));




// Import the axios library, to make HTTP requests
const axios = require('axios')
// This is the client ID and client secret that you obtained
// while registering on github app
const clientID = '22201645e4e6355f972c'
const clientSecret = 'b38237f77f88dfb5535d964b2b216218b9e9e561'

// Declare the callback route
app.get('/github/callback', (req, res) => {

  // The req.query object has the query params that were sent to this route.
  const requestToken = req.query.code
  
  axios({
    method: 'post',
    url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
    // Set the content type header, so that we get the response in JSON
    headers: {
         accept: 'application/json'
    }
  }).then((response) => {
    access_token = response.data.access_token
    res.redirect('/success');
  })
})

app.get('/success', function(req, res) {

  axios({
    method: 'get',
    url: `https://api.github.com/user`,
    headers: {
      Authorization: 'token ' + access_token
    }
  }).then((response) => {
    console.log(response.data);
    if(response.data.email!=null){
    res.redirect('/finalize/'+response.data.email)
    }
    else{
      res.render('pages/error')
    }
    // res.render('pages/success',{ userData: response.data });
  })
  .catch((error) => {
    console.log(error)
  })
});


app.get('/finalize/:mail',function(req,res){
  console.log("finalize")
  axios({
    method: 'get',
    url: `http://localhost:3000/wifi/`+req.params.mail
  }).then((response) => {
    console.log(response);
    if(response.status==404 || response.status==500){
      res.render('pages/fail')
    }
    else{
      res.render('pages/success',{ response: response.data })
    }
  })
  .catch((error) => {
    res.render('pages/fail')
  })
});