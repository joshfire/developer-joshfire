const fs=require('fs');

var jsonData = fs.readFileSync('/dev/stdin').toString();
var myJsonObject = JSON.parse(jsonData);

// remove all dependencies
delete myJsonObject.dependencies;

// remove existing repository if needed
delete myJsonObject.repository;

// add local repository
myJsonObject.repository = {"type":"local","directory":process.argv[2]};

console.log(JSON.stringify(myJsonObject));
