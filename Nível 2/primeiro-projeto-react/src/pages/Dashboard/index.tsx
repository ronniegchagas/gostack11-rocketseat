import React, { useState, useEffect, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

import api from '../../services/api';
import logoImg from '../../assets/logo.svg';

import { Title, Form, Repositories, Error } from './styles';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  }
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [inputError, setInputError] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storageRepositories = localStorage.getItem("@githubexplore:repositories");

    return (storageRepositories) ? JSON.parse(storageRepositories) : [];
  });

  useEffect(() => {
    localStorage.setItem('@githubexplore:repositories', JSON.stringify(repositories))
  }, [repositories])

  async function handleAddRepository(
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    e.preventDefault();

    if (!newRepo) {
      setInputError('Digite o autor/nome do repositório.');
      return;
    }

    try {
      const response = await api.get<Repository>(`repos/${newRepo}`);

      const repository = response.data;

      setNewRepo('');
      setInputError('');

      setRepositories([...repositories, repository]);
    } catch (err) {
      setInputError('Erro na busca por esse repositório.');
    }
  }

  return (
    <>
      <img src={logoImg} alt="GitHub Explorer" />
      <Title>Explore Repositórios no Github</Title>

      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input value={newRepo} onChange={e => setNewRepo(e.target.value)} placeholder="Digite o nome do Repositório" />
        <button type="submit">Pesquisar</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {repositories.map(repository => (
          <Link key={repository.full_name} to={`/repository/${repository.full_name}`}>
            <img src={repository.owner.avatar_url} alt={repository.owner.login} />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;