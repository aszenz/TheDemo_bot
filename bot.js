// jshint esversion:6
// Telegraf is the bot framework that simplifies dealing with telegrams bot api
const Telegraf = require("telegraf"); 
// each bot in telegram has a unique token
const BOT_TOKEN = "343972209:AAG2NU4Y994zdBEbKezUBoJRefGx2tvhCXo";
const app = new Telegraf(BOT_TOKEN); // pass the token for the bot
const bingUrl = "https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1";
const https = require("https");
const options = {
	host: "bing.com",
	path: "/HPImageArchive.aspx?format=js&idx=0&n=1",
};
function getBingWallpaper()
{
	return new Promise((resolve, reject) =>
	{
		console.log(" promise called");
		var jsonStringFromBing = "";
		const req = https.get(options, function(resp)
		{
			// console.log('STATUS: ' + resp.statusCode);
			// console.log('HEADERS: ' + JSON.stringify(resp.headers));
			resp.setEncoding('utf8');
			resp.on('data', function(chunk){
				jsonStringFromBing += chunk;
				console.log("receiving data");
			});
			resp.on('end', ()=>{
				console.log(`The JSON is: ${jsonStringFromBing}`);
				const link = getImageUrl(jsonStringFromBing);
				resolve(link);
			});
		});
		req.on("error", function(e)
		{
			reject("The error is:" + e.message);
		});
	});
}

function getImageUrl(jsonString)
{
	const jsonObject = JSON.parse(jsonString);
	console.log(`The json object is ${jsonObject}`);
	const imgUrl = jsonObject.images[0].url;
	console.log(`The base image url: ${imgUrl}`);
	const completeUrl = "http://www.bing.com" + imgUrl;
	return completeUrl;
}

// app.hears("hi", ctx=>{
	// if user send hi to the bot reply "Hey welcome!" message
// 	return ctx.reply("Hey welcome!");
// });

// handle every time user sends a text message
// app.on('text', ctx=>{
// 	const message = ctx.message.text; // the string text of the user's message
// 	console.log(`New message: ${message}`); // log it
// 	ctx.reply(`hey you sent this message: ${message}`); // reply it back to user
// });

// commands are predefined strings for bots
// they can be accessed via /command
// listen for the /bing command from user then return link to bing's daily wallpaper
app.command('bing', ctx=>{
	console.log("command entered");
	getBingWallpaper()
	.then(
			(link)=>
			{
				console.log("The wallpaper link is: " + link);
				ctx.reply(link);
			},
			(error)=>
			{
				console.log("an error occurred: " + error);
				ctx.reply("An error occurred");
			}
		);


});
app.startPolling(); // start listening for messages or in short start the bot
console.log("Bot Running!!!");