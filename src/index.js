const express = require("express");

const { v4: uuid, validate } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function checkIfRepositoryExists(request, response, next){
  const { id } = request.params;
  if(validate(id) && (repositories.some((repository) => repository.id === id))){
    const repository = repositories.find((repository) => repository.id === id);
    request.repository = repository;
    next();
  }else{
    return response.status(404).json({error: 'Repository not found.'});  
  }

}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});


app.put("/repositories/:id", checkIfRepositoryExists, (request, response) => {
  const updatedRepository = request.body;
  const { repository } = request;

  repository.title  = updatedRepository.title;
  repository.url  = updatedRepository.url;
  repository.techs  = updatedRepository.techs;

  return response.json(repository);
});

app.delete("/repositories/:id", checkIfRepositoryExists, (request, response) => {
  const { id } = request.params;

  repositoryIndex = repositories.findIndex(repository => repository.id === id);

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", checkIfRepositoryExists, (request, response) => {
  const { repository } = request;

  repository.likes = ++repository.likes;

  return response.json({likes: repository.likes});
});

module.exports = app;
