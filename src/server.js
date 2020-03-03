const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.getCss,
  '/getPosts': jsonHandler.getPosts,
  '/addPost': jsonHandler.addPost,
  '/getPostsMeta': jsonHandler.getPostsMeta,
  '/notFoundMeta': jsonHandler.notFoundMeta,
  notFound: jsonHandler.notFound,
};

const handlePost = (request, response, parsedUrl) => {
    if(parsedUrl.pathname === '/addPost') {
        const res = response;
        const body = [];
        request.on('error', (err) => {
            console.dir(err);
            res.statusCode = 400;
            res.end();
        });

        request.on('data', (chunk) => {
            body.push(chunk);
        });

        request.on('end', () => {
            const bodyString = Buffer.concat(body).toString();
            const bodyParams = query.parse(bodyString);
            jsonHandler.addPost(request, res, bodyParams);
        });
    }
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  }
  else if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response);
  } else {
    urlStruct.notFound(request, response);
  }
};

http.createServer(onRequest).listen(port);

// console.log(`Listening on 127.0.0.1: ${port}`);
