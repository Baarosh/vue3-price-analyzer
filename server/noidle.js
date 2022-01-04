import { get } from 'http'

const timeInterval = 1 * 1000 * 60 * 20 // 20 minutes

function initializeNoIdle() {
    setInterval(function() {
        var options = {
            host: 'vue3-price-analyzer.herokuapp.com',
            port: 80,
            path: '/'
        };
        get(options, function(response) {
            response.on('data', function(_chunk) {
                try {
                } catch (err) {
                    console.log(err.message);
                }
            });
        }).on('error', function(err) {
            console.log("Error: " + err.message);
        });
    }, timeInterval);
}

export default initializeNoIdle
