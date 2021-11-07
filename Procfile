web: vendor/bin/heroku-php-apache2 public/ npm run heroku
worker: php artisan queue:work redis --queue=high,default --sleep=3 --tries=3 --daemon