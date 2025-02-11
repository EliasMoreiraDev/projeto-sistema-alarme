import { useState } from 'react';
import styles from './TimeForm.module.css';
import SubmitStyles from '../form/Submit.module.css';
import Input from '../form/Input';
import Submit from '../form/Submit';

function UserForm({ handleSubmit, userdate, onClose }) {
  const [user, setUser] = useState(userdate || {});

  function submit(e) {
    e.preventDefault();
    if (!user || !user.identificacao) {
      alert('Por favor, preencha o campo da identificação.');
      return;
    }
    try {
      handleSubmit(user);
    } catch (error) {
      console.error(error);
      alert('Erro ao adicionar o usuário. Tente novamente.');
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    if (!name || !value) {
      console.error('Erro ao atualizar o estado do formulário:', e);
      return;
    }
    setUser((prevState) => ({
      ...prevState,
      [name]: value
    }));
  }

  return (
    <form>
      <Input
        type="number"
        text="Identificação"
        name="identificacao"
        handleOnChange={handleChange}
        
      />
      <div className={styles.container_btn}>
        <Submit text="Cancelar" onClick={onClose} style={SubmitStyles.btn_cancelar} />
        <Submit text="Confirmar" onClick={submit} style={SubmitStyles.btn_confirmar} />
      </div>
    </form>
  );
}

export default UserForm;
