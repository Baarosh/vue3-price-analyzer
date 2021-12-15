import { get } from 'http'; //importing http

function startKeepAlive() {
    setInterval(function() {
        var options = {
            host: 'vue3-price-analyzer.herokuapp.com',
            port: 80,
            path: '/'
        };
        get(options, function(res) {
            res.on('data', function(chunk) {
                try {
                    // optional logging... disable after it's working
                    console.log("HEROKU RESPONSE: " + chunk);
                } catch (err) {
                    console.log(err.message);
                }
            });
        }).on('error', function(err) {
            console.log("Error: " + err.message);
        });
    }, 20 * 60 * 1000); // load every 20 minutes
}

export default startKeepAlive
