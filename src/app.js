const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");
const { response } = require("express");

const app = express();
app.use(express.json());
app.use(cors());

const verifyIdExisting = (request, repsonse, next) => {
  const { id } = request.params;

  if (!id) {
    return response.status(400).send({"error": "Id not sent!"})
  }

  return next();
}

const verifyRepositoryExisting = (request, response, next) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).send({'error': 'Repository not find!'})
  }

  return next();
}

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.send(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { 
    id: uuid(), 
    title, 
    url, 
    techs, 
    likes: 0 
  };

  repositories.push(repository);

  return response.send(repository)
});

app.put("/repositories/:id", verifyIdExisting, verifyRepositoryExisting, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  const repository = { 
    ...repositories[repositoryIndex], 
    title, 
    url, 
    techs 
  };

  repositories[repositoryIndex] = repository;

  return response.send(repository);
});

app.delete("/repositories/:id", verifyIdExisting, verifyRepositoryExisting, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", verifyIdExisting, verifyRepositoryExisting, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
 
  const repository = { 
    ...repositories[repositoryIndex], 
    likes: repositories[repositoryIndex].likes + 1
  };

  repositories[repositoryIndex] = repository

  return response.send({ likes: repository.likes });
});

module.exports = app;
