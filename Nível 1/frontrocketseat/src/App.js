import React, { useState, useEffect } from 'react';

import api from './services/api';

import Header from './components/Header';
import Message from './components/Message';

import './App.css';

export default function App(){
  const [projects, setProjects] = useState([]);

  useEffect(()=>{
    api.get('/projects').then(response => {
      setProjects(response.data);
    })
  }, []);

  async function handleAddProject() {
    const response = await api.post('/projects', {
      title: `Novo Projeto ${Date.now()}`,
      owner: "REACT DOM"
    });

    const project = response.data;

    setProjects([...projects, project]);
  }

  return (
    <>
      <Header title="Homepage" />
      <Message>Olá Mundo!</Message>
      <ul>
        {projects.map(project => <li key={project.id}>{project.title}</li>)}
      </ul>

      <button type="button" onClick={handleAddProject}>Adicionar Projeto</button>
    </>
  )
}