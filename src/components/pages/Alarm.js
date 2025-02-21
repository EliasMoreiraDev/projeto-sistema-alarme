import styles from "./Alarm.module.css";
import { useState, useEffect } from "react";
import AlarmForm from "../alarms/TimeForm";
import { ip } from "../ip";

function Projeto({ isOpen, onClose, id, onUpdate }) {
  const [alarm, setAlarm] = useState(null);
  const [message, setMessage] = useState();
  const [type, setType] = useState();

  useEffect(() => {
    if (!isOpen) return;

    fetch(`http://${ip}:5000/alarms/${id}`)
      .then((resp) => resp.json())
      .then((data) => setAlarm(data))
      .catch((erro) => console.log(erro));
  }, [isOpen, id]);

  function editPost(alarm) {
    setMessage('');

    fetch(`http://${ip}:5000/alarms/${alarm.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(alarm),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setAlarm(data);
        setType('success');
        setMessage('Projeto atualizado!');
        onClose(); 
        onUpdate(data); 
        window.location.reload()
      })
      .catch((erro) => console.log(erro));
  }

  if (!alarm || !isOpen) return null;

  return (
    <div className={styles.modal_overlay}>
      <div className={styles.modal}>
        <AlarmForm handleSubmit={editPost} alarmdate={alarm} onClose={onClose} />
      </div>
    </div>
  );
}

export default Projeto;
