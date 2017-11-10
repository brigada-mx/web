./build.sh

scp -i ~/.ssh/919mx html/map.html custom@52.37.92.55:/var/www/919/web/html/map.html
scp -i ~/.ssh/919mx js/map.bundle.js custom@52.37.92.55:/var/www/919/web/js/map.js
scp -i ~/.ssh/919mx styles/map.css custom@52.37.92.55:/var/www/919/web/styles/map.css
scp -i ~/.ssh/919mx styles/global.css custom@52.37.92.55:/var/www/919/web/styles/global.css
