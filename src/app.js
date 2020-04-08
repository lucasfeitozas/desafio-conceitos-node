const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

/**
 * Middleware that validates if repository exists
 */
function checkIfRepositoryExists(req, res, next){
  const { id } = req.params;

  const index = repositories.findIndex(repository => repository.id === id);

  if (index < 0) {
    return res.status(400).send({"error": "Repository not exists"});
  }

  return next();
}

/**
 * function to find repository
 */
function find(id){
  return repositories.find(repository => repository.id === id);
}
/**
 * Returns all repositories
 */
app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

/**
 * Request body: title, url, techs
 * Create a new repository
 */
app.post("/repositories", (request, response) => {
  const { title, url, techs} = request.body;

  const repository = { 
    id: uuid(), 
    title, 
    url, 
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(200).json(repository);
});

/**
 * Request params: id;
 * Request body: title, url, techs
 * Update a repository
 */
app.put("/repositories/:id", checkIfRepositoryExists, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repository = find(id);
  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  return response.status(200).json(repository);

});

/**
 * Request params: id;
 * Delete a repository
 */
app.delete("/repositories/:id", checkIfRepositoryExists, (req, res) => {
  const { id } = req.params;

  const index = repositories.findIndex(repository => repository.id === id);
  repositories.splice(index, 1);

  return res.status(204).send();
});

/**
 * Route params: id;
 * Increase the count of likes
 */
app.post("/repositories/:id/like", checkIfRepositoryExists, (request, response) => {
  const { id } = request.params;

  const repository = find(id);
  repository.likes +=1;
  
  return response.json(repository);

});

module.exports = app;
