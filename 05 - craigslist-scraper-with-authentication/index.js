const dotenv = require("dotenv").config({ path: `${__dirname}/../config.env` })
const request = require("request-promise")
const fs = require("fs")


const main = async () => {
    try {
        const html = await request.post("https://accounts.craigslist.org/login?lang=es&cc=es", {
            form: {
                inputEmailHandle: process.env.CRAIGSLIST_LOGIN,
                inputPassword: process.env.CRAIGSLIST_PASS
            },
            headers: {
                ["Content-Type"]: "application/x-www-form-urlencoded",
                Referer: "https://accounts.craigslist.org/login?lang=es&cc=es",
                ["User-Agent"]: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36"
            },
            followAllRedirects: true,
            jar: true
        })

        fs.writeFileSync("./output.html", html)

    } catch (err) { console.error(err) }

}
main()