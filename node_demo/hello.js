/**
 * Created by kongdaniel on 4/11/15.
 */

var http = require('http');

http.createServer(function(request, response){
    response.writeHead(200); //Status code in header
    response.write("Dog is running."); //Response body
    setTimeout(function(){
        response.write("Dog is done.");
        response.end(); //Close the connection
    }, 5000);
}).listen(8080);

console.log('Listening on port 8080...');