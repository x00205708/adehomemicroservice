var bodyParser = require('body-parser');
var express = require('express');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
var app = express();

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'pug');

app.get('/addproduct', async (req, res, next) => {
    res.render('add', {
		title: 'Add Product',
		message: ""
	});
});


app.post('/postproduct', async (req, res, next) => {
    const url ="https://adeproductmicroservices.azurewebsites.net/api/products"

    console.log(req.body)

    const data = {
        product_name: req.body.product_name,
        product_description: req.body.product_description,
        product_price: req.body.product_price
    }

    const customHeaders = {
    	"Content-Type": "application/json",
	}

	const options = {
		method: 'POST',
		headers: customHeaders,
		body: JSON.stringify(data)
	};

	try {
		const fetchres = await fetch(url, options);
		const json = await fetchres.json();

		res.render('add', {
		    title: 'Product Listing',
		    message: "Product Added Succesfully"
		});
		

	} catch (err) {
		console.log(err);
		res.render('add', {
		    title: 'Product Listing',
		    message: "Product Not Added"
		});
	}


});

app.get('/viewproducts', async (req, res, next) => {
	const url ="https://adeproductmicroservices.azurewebsites.net/api/products"

	const options = {
		method: 'GET',
	};

	try {
		const fetchres = await fetch(url, options);
		const json = await fetchres.json();
		res.render('index', {
		    title: 'Product Listing',
		    products: json
		});

	} catch (err) {
		console.log(err);
	}
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Home MicroService running on port ${PORT}`));
