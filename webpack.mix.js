const mix = require('laravel-mix');
require('dotenv').config();
const path = require('path');

// Get the APP_URL from .env and remove protocol
let url = process.env.APP_URL.replace(/(^\w+:|^)\/\//, '');

console.log('APP_KEY',process.env.APP_KEY)

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

mix.webpackConfig({
    resolve: {
        alias: {
            '@': path.join(__dirname, 'resources/assets/js'),
            '~': '/resources/assets/sass',
            '@components': '/resources/assets/js/components',
        }
    }
});

mix.js('resources/assets/js/app.js', 'public/js')
// .sass('resources/assets/sass/app.scss', 'public/css')
.vue();
