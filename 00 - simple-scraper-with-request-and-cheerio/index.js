const request = require("request-promise");
const fs = require("fs");
const cheerio = require("cheerio");

//download the page
async function scrape() {
  const html = await request.get("https://bluerivermountains.com");

  //save the page to a local html file
  fs.writeFileSync("./scraped-page.html", html);

  //scrape multiple h2s with cheerio
  const $ = await cheerio.load(html);
  $("h2").each((index, element) => {
    //do something with the h2s
    console.log($(element).text());
  });
}

scrape();
