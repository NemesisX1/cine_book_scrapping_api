# [Non-Official] Cine Book Web API (scrapper) [![Running tests workflow](https://github.com/NemesisX1/canal_olympia_scrapping_api/actions/workflows/main.yml/badge.svg)](https://github.com/NemesisX1/canal_olympia_scrapping_api/actions/workflows/main.yml) [![Better Stack Badge](https://uptime.betterstack.com/status-badges/v1/monitor/vyrp.svg)](https://uptime.betterstack.com/?utm_source=status_badge)

This is a non-official scrapper to get movies and theaters data directly from a famous theater's website.

**If you want to contribute check [this file](https://github.com/NemesisX1/canal_olympia_scrapping_api/blob/main/CONTRIBUTING.md).**

> ## 👀 Overview

The full docs is located [here](https://canalolympascrappingapi-production.up.railway.app/docs).
I also use the basics folders structures provided by the following command line :

```
npx ts-express
```

And the code architecture is mainly inspired by the default [Nest.js](https://nestjs.com/) one.

The core scrapper is made up of this package:

- [Cheerio](https://www.npmjs.com/package/cheerio) who helps us parsing the html document.

> ### 🚀 Deployment

- With npm

  ```shell
  npm install
  npm run start
  ```
- With Docker

  ```
  sudo docker compose up
  ```

  or

  ```
  sudo docker compose up -d
  ```

Then go to `localhost:3213` or (localhost:PORT with PORT defined in the .env file)

**Elikem Medehou** [![Twitter Follow](https://img.shields.io/twitter/follow/juniormedehou_?label=Follow&style=social)](https://twitter.com/juniormedehou_)
