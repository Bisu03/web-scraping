const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const app = express();
const port = 8000;

const getData = async () => {
  try {
    const url = "https://coinmarketcap.com/";
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    // console.log($);
    const element =
      "#__next > div > div.main-content > div.sc-4vztjb-0.cLXodu.cmc-body-wrapper > div > div:nth-child(1) > div.h7vnx2-1.bFzXgL > table > tbody > tr";

    const keys = [
      "rank",
      "name",
      "price",
      "24h",
      "7d",
      "marketcap",
      "volume",
      "circulating",
      "extra",
    ];

    let Coinarr = [];

    $(element).each((parentIndx, parentElem) => {
      let keyIndx = 0;

      let coinObj = {};

      if (parentIndx <= 10) {
        $(parentElem)
          .children()
          .each((childIdx, childElm) => {
            let tdValue = $(childElm).text();
            if (keyIndx === 1 || keyIndx === 6) {
              tdValue = $("p:first-child", $(childElm).html()).text();
            }

            if (tdValue) {
              coinObj[keys[keyIndx]] = tdValue;
              keyIndx++;
            }
          });
        Coinarr.push(coinObj);
      }
    });
    return Coinarr;
  } catch (error) {
    console.error(error);
  }
};

app.get("/test", async (req, res) => {
  try {
    const priceBit = await getData()
    return res.json({ priceBit });
  } catch (error) {
    console.error(error);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
