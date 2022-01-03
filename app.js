const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const PORT = process.env.PORT || 3000;

const publicDir = path.join(__dirname, "./public");
app.use(express.static(publicDir));
const partialsPath = path.join(__dirname, "./views/partials");
app.set("view engine", "hbs");
hbs.registerPartials(partialsPath);

app.get("/", (req, res) => {
	res.render("index", {});
});

app.get("/weather/api/current.json", (req, res) => {
	const address = req.query.address;
	var request = require("postman-request");
	request(
		{
			url: `https://api.weatherapi.com/v1/current.json?key=2645755d47e549fea0151213220101&q=${address}`,
			json: true,
		},
		(err, response, body) => {
			if (err) {
				res.send("Unable to connect to weather service!");
			} else {
				try {
					res.send(
						JSON.stringify({
							body,
						})
					);
				} catch {
					res.send(body.error.message);
				}
			}
		}
	);
});
app.get("/weather/api/ip.json", (req, res) => {
	const address = req.query.address;
	var request = require("postman-request");
	request(
		{
			url: `https://api.weatherapi.com/v1/ip.json?key=2645755d47e549fea0151213220101&q=auto:ip`,
			json: true,
		},
		(err, response, body) => {
			if (err) {
				res.send("Unable to fetch current location ip!");
			} else {
				try {
					res.send(
						JSON.stringify({
							ip: body.ip,
							location: body.city,
							country: body.country_name,
							timezone: body.tz_id,
							localtime: body.localtime,
						})
					);
				} catch {
					res.send(body.error);
				}
			}
		}
	);
});
app.get("/weather/api/forecast.json", (req, res) => {
	const address = req.query.address;
	var request = require("postman-request");
	request(
		{
			url: `https://api.weatherapi.com/v1/forecast.json?key=2645755d47e549fea0151213220101&q=${address}&days=3`,
			json: true,
		},
		(err, response, body) => {
			if (err) {
				res.send("Unable to connect to weather service!");
			} else {
				try {
					res.send(
						JSON.stringify({
							body: body,
						})
					);
				} catch {
					res.send(body.forecast);
				}
			}
		}
	);
});

app.get("*", (req, res) => {
	res.render("404");
});

app.listen(PORT);
