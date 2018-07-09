set -e

python3 ./tools/sitemap.py
./build.sh

bucketname='719s-web'

# `aws` command depends on credentials in `~/.aws` directory
aws s3 cp dist/index.html s3://${bucketname} --acl public-read
aws s3 cp dist/bundle.js s3://${bucketname} --acl public-read
aws s3 cp dist/bundle.css s3://${bucketname} --acl public-read
aws s3 cp dist/global.css s3://${bucketname} --acl public-read
aws s3 sync dist/assets s3://${bucketname}/assets/ --acl public-read

aws s3 cp dist/robots.txt s3://${bucketname} --acl public-read
aws s3 cp dist/sitemap.xml s3://${bucketname} --acl public-read
aws s3 cp dist/google2056132fa8ef12ca.html s3://${bucketname} --acl public-read

aws cloudfront create-invalidation --distribution-id E26AO23800RE7C --paths '/*'

# sleep until API is up
until curl -s https://api.brigada.mx/api/ | python3 -mjson.tool > /dev/null; do
  >&2 echo "API is unavailable - sleeping"
  sleep 1
done

curl -d '{"app_type":"web", "git_hash":"'`git rev-parse HEAD`'"}' -H "Content-Type: application/json" -H "Authorization: Bearer `cat .internal-auth-key`" -X POST https://api.brigada.mx/api/internal/app_versions/
