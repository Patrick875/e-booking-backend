import croneJob from "node-cron";
import axios from "axios";
import moment from "moment";
import { Currency } from "../models";

const apiKey = process.env.EXCHANGE_KEY;

// const showCurrency = async( )

const encodedApiKey = encodeURIComponent(apiKey);

const currencyJob = croneJob.schedule("*/30 * * * *", async () => {
  const formattedDate = moment().format("YYYY-MM-DD");

  const isUpTodate = await Currency.findAll({ where: { date: formattedDate } });
  const options = {
    method: "GET",
    headers: {
      apikey: encodedApiKey,
    },
    url: "https://api.apilayer.com/exchangerates_data/latest",
    params: {
      base: "USD",
    },
  };

  !isUpTodate.length &&
    axios(options)
      .then(async (response) => {
        const rates = response.data.rates;
        const base = response.data.base;
        for (let rate in response.data.rates) {
           
          let currency = await Currency.findOne({ where: { name: rate } });

          if (currency) {
            currency.set({ rate: rates[rate], date: response.data.date });
            await currency.save();
          } else {
            await Currency.create({
              name: rate,
              rate: rates[rate],
              date: response.data.date,
              isbase: rate.toString() == base ? 1 : 0,
            });
          }
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
});

export default currencyJob;
