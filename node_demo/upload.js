/**
 * Created by kongdaniel on 4/11/15.
 */

var http = require('http');
var fs = require('fs');

http.createServer(function(request, response) {
    var newFile = fs.createWriteStream("readme_copy.md");
    var fileBytes = request.headers['content-length'];
    var uploadedBytes = 0;

    request.pipe(newFile);

    request.on('data', function(chunk) {
        uploadedBytes += chunk.length;
        var progress = (uploadedBytes / fileBytes) * 100;
        response.write("progress: " + parseInt(progress, 10) + "%\n");
    });

}).listen(8080);

console.log('Listening on port 8080...');