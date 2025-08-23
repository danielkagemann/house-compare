# house-compare

This is a small project to compare different houses (from idealista) and show them enxt to each other.
Sorting can be changed by dropdown.

Because websites do not like webcrawling, I decided to add new data by using pasted HTML source. I tried different things for crawling but
captcha hits hard and could not get it done in less effort (tried puppeteer, playwright).

## Some insights

![](./screenshot.gif)

## dependencies used

- nextjs for client and server
- tailwind css
- cheerio (server api parses the HTML here)
- lucide-react for nice symbols

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
