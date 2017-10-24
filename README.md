# Web


## Set Up NGINX
Edit `/usr/local/etc/nginx/nginx.conf`, add the following line before the closing curly brace: `include conf.d/*.conf;`.

Copy `919.template.conf` to `919.conf` and sym link it into the newly created `conf.d` directory.

~~~sh
mkdir /usr/local/etc/nginx/conf.d
ln -s /path/to/this/repo/919.conf /usr/local/etc/nginx/conf.d/919.conf
~~~

Edit `subl /etc/hosts`, add this line: `127.0.0.1 919.local.mx`.

Make sure directories containing your site files are readable and executable by all users: `chmod 755 ~`.


## Restart NGINX
~~~sh
sudo nginx -s stop; sudo nginx
~~~
