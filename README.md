# [Non-Official] Canal Olympia Web API (scrapper) [![Running tests workflow](https://github.com/NemesisX1/canal_olympia_scrapping_api/actions/workflows/main.yml/badge.svg)](https://github.com/NemesisX1/canal_olympia_scrapping_api/actions/workflows/main.yml)

This is a non-official scrapper to get movies and theaters data directly from the Canal Olympia's website.

> ## 👀 Overview

The full docs is located [here](https://canalolympascrappingapi-production.up.railway.app/docs).
I also use the basics folders structures provided by the following command line :

```
npx ts-express
```

And the code architecture is mainly inspired by the default [Nest.js](https://nestjs.com/) one.

The core scrapper is made up of these two packages:

- [Puppeteer](https://pptr.dev/) who act as the main scrapper
- [node-html-parser](https://www.npmjs.com/package/node-html-parser) who helps to parse the html document (thinking about removing this one later, I really guess that i can fully rely on Puppeteer)

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

**Elikem Medehou** [![Twitter Follow](https://img.shields.io/twitter/follow/juniormedehou_?label=Follow&style=social)](https://twitter.com/juniormedehou_)
