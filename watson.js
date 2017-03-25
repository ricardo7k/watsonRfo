'use strict';

const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
const HttpDispatcher = require('httpdispatcher');
const dispatcher     = new HttpDispatcher();
const http = require('http')
const fs = require('fs');

var cors = require('cors');
var express = require('express');
var querystring = require('querystring');
var app = express();
app.use(cors());

var nlu = new NaturalLanguageUnderstandingV1({
  username: "",
  password: "",
  version_date: NaturalLanguageUnderstandingV1.VERSION_DATE_2017_02_27
});

function handleRequest(request, response){
  try{
    dispatcher.dispatch(request, response);
  } catch(err) {
    console.log(err);
  }
}

dispatcher.onGet("/",function(req, res){
  fs.readFile('index.html', function (err, html) {
    res.writeHeader(200, {"Content-Type": "text/html"});
    res.write(html);
    res.end();
  });
});

dispatcher.onPost("/send",function(req, res){
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
    var arr = [
      response.sentiment.document.label,
      response.categories[0]?response.categories[0].label.substring(1,response.categories[0].label.length).split("/").join(", "):"undefined topic"
    ];

    var options = {
      host: 'localhost',
      port: 8083,
      path: '/translate',
      method: 'POST'
    };

    var httpreq = http.request(options, function (response) {
      response.setEncoding('utf8');
      response.on('data', function (chunk) {
        chunk = JSON.parse(chunk);
        var content = chunk.translations[0].translation.split(";");
        var frase = "Estou aprendendo com você, aparentemente você está falando algo " + content[0] + " sobre" + content[1] + ", é isto?";
        res.writeHeader(200, {"Content-Type": "text/plain"});
        res.write(frase);
        res.end();
      });
    });
    httpreq.write(querystring.stringify({
      text: arr[0] + ";" + arr[1]
    }));
    httpreq.end();
  });
});

http.createServer(handleRequest).listen(8082, function(){
    console.log("Server listening on: http://localhost:%s", 8082);
});
