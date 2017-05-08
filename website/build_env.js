
var fs = require('fs');

// The list of variables to export
variables = ['STRIPE_PUBLISHABLE_KEY'];

// Code to fetch and write out each variable as an export (so we can include them in the Angular2 app)
var outfile = 'src/app/app.environment.ts';
var str = "";
for (var i in variables) {
    var v = variables[i];
    var str = "export let " + v + "=\"" + process.env[v] + "\"\n";
}

fs.writeFileSync(outfile, str)
