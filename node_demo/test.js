/**
 * Created by kongdaniel on 4/11/15.
 */

var fs = require('fs');


var callback = function(err, contents) {
    console.log(contents);
}

fs.readFile('/etc/hosts', callback);
fs.readFile('/etc/ftpd.conf', callback);