import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserForm from '../alarms/UserForm';
import styles from './NewTime.module.css';
import { ip } from '../ip';

function AdicionarUser({ isOpen, onClose, addUser }) {
    const navigate = useNavigate();
  
    if (!isOpen) return null;
  
    const createPost = (user) =>
      fetch(`http://${ip}:5000/users`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(user),
      })
        .then((res) => res.json())
        .then((newUser) => {
          addUser(newUser);
          navigate('/times', { state: { message: 'Usuario adicionado com sucesso!' } });
          onClose();
        });
  
    return (
      <div className={styles.caixa_newProject}>
        <div className={styles.modal_overlay}>
          <div className={styles.modal}>
            <h1 className={styles.titulo}>Adicionar Usuário</h1>
            <UserForm handleSubmit={createPost} onClose={onClose} />
          </div>
        </div>
      </div>
    );
}

export default AdicionarUser;