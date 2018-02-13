# `aws` command depends on credentials in `~/.aws` directory
./build.sh

bucketname='719s-web'

aws s3 cp dist/index.html s3://${bucketname} --acl public-read
aws s3 cp dist/bundle.js s3://${bucketname} --acl public-read
aws s3 cp dist/bundle.css s3://${bucketname} --acl public-read
aws s3 cp dist/global.css s3://${bucketname} --acl public-read
aws s3 sync dist/assets s3://${bucketname}/assets/ --acl public-read
