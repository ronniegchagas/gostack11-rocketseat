const express = require('express');
const cors = require('cors');
const { uuid, isUuid } = require('uuidv4');

const app = express();
app.use(cors());
app.use(express.json());

/**
 * Metódos HTTP:
 * 
 * GET : Buscar informações do back-end
 * POST: Criar uma informação no back-end
 * PUT/PATCH: Alterar todas/uma informação no back-end
 * DELETE: Deletar uma informação no back-end
 */

/**
 * Tipos de parâmetros:
 * 
 * Query Params: Filtros e Paginação
 * Route Params: Identificar recursos (Atualizar/Deletar)
 * Request Body: Conteúdo na hora de criar ou editar um recurso (JSON)
 */

/**
 * Middleware:
 * 
 * Interceptador de requisição que pode interromper totalmente a requisição ou alterar dados da requisição
 */

const projects = [];

function logRequests(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.time(logLabel);

  next(); // Próximo middleware

  console.timeEnd(logLabel);
}

function validateId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid Id.' });
  }

  return next();
}

app.use(logRequests);
app.use('/projects/:id', validateId);

// http:localhost:3333/projects?title=React&owner=Ronnie
app.get('/projects', (request, response) => {
  // Query Params
  const { title } = request.query;

  const results = title
    ? projects.filter(project => project.title.includes(title))
    : projects;

  return response.json(results);
});

app.post('/projects', (request, response) => {
  // Request Body
  const { title, owner } = request.body;

  const project = { id: uuid(), title, owner };

  projects.push(project);

  return response.json(project);
});

// http:localhost:3333/projects/2
app.put('/projects/:id', (request, response) => {
  // Route Params
  const { id } = request.params;
  const { title, owner } = request.body;

  const projectIndex = projects.findIndex(project => project.id == id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: 'Project not found.' });
  }

  const project = {
    id,
    title,
    owner
  }

  projects[projectIndex] = project;

  return response.json(project);
});

// http:localhost:3333/projects/2
app.delete('/projects/:id', (request, response) => {
  const { id } = request.params;

  const projectIndex = projects.findIndex(project => project.id == id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: 'Project not found.' });
  }

  projects.splice(projectIndex, 1);

  return response.status(204).send();
});

app.listen(3333, () => {
  console.log('Backend started! 🚀')
});