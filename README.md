# house-compare

This is a private project to collect favorite real estates to be able to compare them. You can add as many real estates you want and also
entering the data is done half-automatic or completely manually.

Because websites do not like webcrawling, there is a half-automatic import for idealista links by using pasted HTML source. I tried different things for crawling but
captcha hits hard and could not get it done in less effort (tried puppeteer, playwright, proxy, ...).

## ideas for future implementations

- add translation of description possibility
- share links via datenkommo.de
- add personal notes
- show map on compare
- show map when entering location

## features

- set real estate data manually or from idealista html
- export and import of data
- storage in browser
- favorite colelction
- comparison of real estates by user selection (up to 3)
- add starting point to calculate distance (air)
- works on mobile and desktop

## Some insights

### Overview

Collect all your favorite real estates. Mark them by click on the heart and go into compare mode.

![](./screen1.jpg)

![](./screen2.jpg)

Some filters help to reduce your favorites to focus on your criterias.

![](./screen3.jpg)

### Location

You can define a starting point and the (air) distance is calculated to give you a better understanding of the place.

![](./screen2.jpg)

## dependencies used

- nextjs for client ~~and server~~
- tailwind css
- ~~cheerio (server api parses the HTML here)~~ replaced with DOM parsing to be deployable on GH pages
- lucide-react for nice symbols

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
