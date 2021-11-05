const mix = require('laravel-mix');

// Get the APP_URL from .env and remove protocol
let url = process.env.APP_URL.replace(/(^\w+:|^)\/\//, '');

if (mix.inProduction()) {
   mix.version();
}else{
    mix.options({
        hmrOptions: {
            host: url,
            port: 8080 // Can't use 443 here because address already in use
        }
    });
}

mix.js('resources/assets/js/app.js', 'public/js')
// .sass('resources/assets/sass/app.scss', 'public/css')
.vue();
