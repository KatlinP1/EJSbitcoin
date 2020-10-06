const express = require('express');
const bodyParser= require('body-parser');
const axios= require('axios');
const ejs = require('ejs');
const { response } = require('express');
const app= express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public')); 

app.set('view engine', ejs);
app.get('/', function(request, response){
    response.render("index.ejs", {currency: "", amount:"", bitcoinPrice:""});
});

app.post('/', (req, res) => {
    let currency= req.body.currency;
    currency = (currency!=="USD" && currency!=="EUR")? "EUR" : currency;

    let amount = req.body.amountBitcoins;
    amount = (isNaN(amount))? 1 : amount;

    let url = `https://api.coindesk.com/v1/bpi/currentprice/EURO.json`;

    console.log(currency);
    console.log(amount);
    axios.get(url) 
    .then(function(response){

        console.log(response.data);
        let currencyObject = response.data[0];

        let rate = response.data.bpi[currency].rate_float;
        let price = rate * amount;

        res.render("index.ejs", {currency: currency, amount:amount, bitcoinPrice: price})
        
    })
    .catch(function(error){
        console.log(error);
    });
});

app.listen(3000, ()=> {
    console.log('Server is running on port 3000');
});

