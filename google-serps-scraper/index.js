const cheerio = require("cheerio");
const request = require("request-promise");
const fs = require("fs");

const result = [];

const scrapeSERP = async () => {
  const html = await request.get(
    "https://www.google.com/search?q=freelance+data+analyst&safe=strict&gbv=1&sei=Y_H3XcT5F8Opmge8lZfwBA"
  );

  //write the response to a local html file to inject jquery locally
  // fs.writeFileSync("./scraped-serp.html", html);

  //1. open the file with disabled
  //2. enable JS again and inject jQuery
  //3. make element selection

  const $ = await cheerio.load(html);

  //create list with the 10 organic results
  const all = $("#main > div > div[class]")
    .filter((item, el) => el.attribs.class.split(" ").length === 4)
    .filter((index, el) => el.children.length === 3)
    // iterate over them
    .each((i, el) => {
      const title = $(el)
        .find("div>a>div:first-child")
        .text();

      //the urls on google are like https://www.google.com/url?q=https://www.upwork.com/freelance-jobs/data-analysis/ and therefore ahve to be split at the "q=" parameter
      const url = $(el)
        .children("div")
        .children("a")
        .attr("href")
        .split("q=")[1];

      const description = $(el)
        .children("div:last-child")
        .text();

      //add data to array
      result.push({
        rank: i + 1,
        title,
        description,
        url
      });

      console.table(result);
    });
};

scrapeSERP();
