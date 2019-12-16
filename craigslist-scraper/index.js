// use requestretry instead and let it return only the repsponse body as in the code before, so I can leave the code as it is
const request = require("requestretry").defaults({
  fullResponse: false,
  maxAttempts: 10,
  retryDelay: 5000
});
const cheerio = require("cheerio");
const ObjectsToCsv = require("objects-to-csv")

//url of developer jobs in berlin to scrape
const url =
  "https://berlin.craigslist.org/d/software-qa-dba-etc/search/sof?lang=en&cc=gb";

const scrapeSample = {
  title: "jobtitle",
  description: "description",
  datePosted: new Date("2018-07-13"),
  url: "url of the job",
  neighbourhood: "some hood",
  address: "13455 some street",
  compensation: "35/hr"
};

const scrapeResults = [];

async function scrapeJobheader() {
  try {
    //download the page
    const htmlResult = await request.get(url);
    const $ = await cheerio.load(htmlResult);

    //get a list of all job links
    $(".result-info").each((index, element) => {
      //get the job title
      const jobTitle = $(element)
        .children(".result-title")
        .text();

      //get the job url
      const jobURL = $(element)
        .children(".result-title")
        .attr("href");

      //get date
      const date = new Date(
        $(element)
          .children("time")
          .attr("datetime")
      );

      //get neighborhood
      const neighborhood = $(element)
        .find(".result-hood")
        .text()
        .trim()
        .toLowerCase();

      //add to result object
      const scrapeResult = { jobTitle, jobURL, date, neighborhood };
      scrapeResults.push(scrapeResult);
    });

    return scrapeResults;
  } catch (err) {
    console.error(err);
  }
}

async function scrapeDescription(jobHeaders) {
  return await Promise.all(
    jobHeaders.map(async job => {
      try {
        //get the url from the object
        const htmlResult = await request.get(job.jobURL);

        const $ = cheerio.load(htmlResult);

        //remove print information
        $("#postingbody>div.print-information").remove();

        //get job description
        job.description = $("#postingbody").text();

        //get compensation
        let compensation = $("p.attrgroup:first-child")
          .children()
          .first()
          .text();
        job.compensation = compensation.replace("compensation: ", "");

        return job;
      } catch (err) {
        console.error(err);
      }
    })
  );
}

//write to csv file
async function createCsvFile(data) {
  let csv = new ObjectsToCsv(data)
  //save to file
  await csv.toDisk("./data.csv")
}

async function scrapeCraigslist() {
  const jobHeaders = await scrapeJobheader();
  const jobFullData = await scrapeDescription(jobHeaders);

  await createCsvFile(jobFullData)
}

scrapeCraigslist();
