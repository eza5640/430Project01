//should be in a db
const currentPosts = {};

const respondJSON = (request, response, status, object) => {
	response.writeHead(status, { 'Content-Type': 'application/json' });
	response.write(JSON.stringify(object));
	response.end();
};
const respondJSONMeta = (request, response, status) => {
	response.writeHead(status, { 'Content-Type': 'application/json' });
	response.end();
};

const getPosts = (request, response) => {
	const responseJSON = {
		currentPosts,
	};

	return respondJSON(request, response, 200, responseJSON);
};

const getPostsMeta = (request, response) => respondJSONMeta(request, response, 200);

const getPost = (request, response, params) => {
    //does nothing yet
};

const addPost = (request, response, params) => {
    //default json message
    const responseJSON = {
      message: 'Title and description are both required.',
    };
  
    //check to make sure we have both fields
    //We might want more validation than just checking if they exist
    //This could easily be abused with invalid types (such as booleans, numbers, etc)
    //If either are missing, send back an error message as a 400 badRequest
    if (!params.title || !params.description) {
      responseJSON.id = 'missingParams';
      return respondJSON(request, response, 400, responseJSON);
    }
  
    //default status code to 201 created
    let responseCode = 201;
  
    //if that user's name already exists in our object
    //then switch to a 204 updated status
    if (currentPosts[params.title]) {
      responseCode = 204;
    } else {
      //otherwise create an object with that name
      currentPosts[params.title] = {};
    }
  
    //add or update fields for this user name
    currentPosts[body.title].title = body.title;
    currentPosts[body.title].description = body.description;
  
    //if response is created, then set our created message
    //and sent response with a message
    if (responseCode === 201) {
      responseJSON.message = 'Created Successfully';
      return respondJSON(request, response, responseCode, responseJSON);
    }
    // 204 has an empty payload, just a success
    // It cannot have a body, so we just send a 204 without a message
    // 204 will not alter the browser in any way!!!
    return respondJSONMeta(request, response, responseCode);
};

const notFoundMeta = (request, response) => respondJSONMeta(request, response, 404);

const notFound = (request, response) => {
	const responseJSON = {
		message: 'Error: Page not found.'
	};

	return respondJSON(request, response, 404, responseJSON);
};

module.exports = {
  addPost,
  getPost,
  notFound,
  getPosts,
  getPostsMeta,
  notFoundMeta,
};
