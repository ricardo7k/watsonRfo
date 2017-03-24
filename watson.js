'use strict';

const HttpDispatcher = require('httpdispatcher');
const dispatcher     = new HttpDispatcher();
const http = require('http')
const fs = require('fs');
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');

var nlu = new NaturalLanguageUnderstandingV1({
  username: " ",
  password: " ",
  version_date: NaturalLanguageUnderstandingV1.VERSION_DATE_2017_02_27
});

function handleRequest(request, response){
  try{
    dispatcher.dispatch(request, response);
  } catch(err) {
    console.log(err);
  }
}

dispatcher.onGet("/",function(req,res){
  fs.readFile('index.html', function (err, html) {
    res.writeHeader(200, {"Content-Type": "text/html"});
    res.write(html);
    res.end();
  });
});

dispatcher.onPost("/send",function(req,res){
  nlu.analyze({
    'html': req.params.text,
    'features': {
      'emotion': {},
      'concepts': {},
      'categories': {},
      'keywords': {},
      'sentiment': {}
    }
  }, function(err, response) {
    var content = "";
    if (err) content = err;
    else content = JSON.stringify(response, null, 2);
    res.writeHead(200,{'Content-Type':'text/plain'});
    res.end(content);
  });
});

http.createServer(handleRequest).listen(8082, function(){
    console.log("Server listening on: http://localhost:%s", 8082);
});
