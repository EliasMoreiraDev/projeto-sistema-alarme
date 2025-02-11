import styles from './NewTime.module.css';
import TimeForm from '../alarms/TimeForm';
import { useNavigate } from 'react-router-dom';
import { ip } from '../ip';

function NewTime({ isOpen, onClose, addTime }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const createPost = (alarm) =>
    fetch(`http://${ip}:5000/alarms`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(alarm),
    })
      .then((res) => res.json())
      .then((newAlarm) => {
        addTime(newAlarm);
        navigate('/times', { state: { message: 'Alarme programado com sucesso!' } });
        onClose();
      });

  return (
    <div className={styles.caixa_newProject}>
      <div className={styles.modal_overlay}>
        <div className={styles.modal}>
          <h1 className={styles.titulo}>Criar Alarme</h1>
          <TimeForm handleSubmit={createPost} onClose={onClose} textobtn="Criar projeto" />
        </div>
      </div>
    </div>
  );
}

export default NewTime;
