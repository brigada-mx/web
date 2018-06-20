const env = process.env.NODE_ENV === 'development' ? require('./env.dev') : require('./env.prod')
const envLocal = process.env.NODE_ENV === 'development' ? require('./.env.local') : {}

const common = {
  mapbox: {
    accessToken: 'pk.eyJ1Ijoia3lsZWJlYmFrIiwiYSI6ImNqOTV2emYzdjIxbXEyd3A2Ynd2d2s0dG4ifQ.W9vKUEkm1KtmR66z_dhixA',
    sourceOptions: {
      type: 'vector',
      url: 'mapbox://kylebebak.dr7kbl4u',
    },
    sourceLayer: 'tileset-2018-02-13-b7pu9b',
  },
  surveyUrl: 'https://ee.humanitarianresponse.info/x/#Yhgh',
  thumborUrl: 'https://d1usq577esam6j.cloudfront.net',
  google: {
    apiKey: 'AIzaSyBAPo9-LRuETw6wPxGCLNU86IiqWbWIcic',
  },
}

export default { ...common, ...env, ...envLocal, gitHashRelease: process.env.CUSTOM_GIT_COMMIT_HASH }
