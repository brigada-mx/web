NODE_ENV=production CUSTOM_GIT_COMMIT_HASH=`git rev-parse HEAD` webpack --config webpack.prod.js
node-sass dist -o dist --output-style compressed
