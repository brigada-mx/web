# Web
Our web app is built with React. It uses Redux to manage global state.


## Dev
Run `npm run dev`. Make sure the API is also up. See the API repo for details on how to run the API on your machine.


## Build
Check out `build.sh`. Run `npm run build`.


## Deploy
`npm run deploy`: our web app [is hosted by S3](https://docs.aws.amazon.com/AmazonS3/latest/dev/website-hosting-custom-domain-walkthrough.html). Deployment uploads necessary static files to the bucket that serves the site.

We use [CloudFront](https://console.aws.amazon.com/cloudfront/home?region=us-west-2#) to cache our assets at edge locations. `deploy.sh` includes a command to invalidate this cache so clients get the updated web app as soon as it's deployed.

An Amazon-issued SSL certificate provides security for the web app and the API.
Route 53 DNS ensures <https://app.brigada.mx> points to the web app, and that HTTP requests are redirected to HTTPS.

CloudFront also __gzips__ assets, which greatly reduces bundle size and initial load time.


## Optimize Bundle Size
Run `NODE_ENV=production webpack --config webpack.prod.js --json > stats.json` to generate a `stats.json` file, and upload it [here](https://chrisbateman.github.io/webpack-visualizer/) for a sweet sunburst chart.
