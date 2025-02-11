import styles from "./TimeCard.module.css";
import { BsPencil, BsFillTrashFill } from "react-icons/bs";
import ToggleSwitch from "../layouts/ToggleSwitch";
import Projeto from "../pages/Alarm";
import { useState } from "react";
import Confirmacao from "../layouts/Confirmacao";

function TimeCard({ id, time, handleRemove }) {
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalConfOpen, setIsModalConfOpen] = useState(false);
  const [currentAlarmTime, setCurrentAlarmTime] = useState(time);

  const toggleModalEdit = () => setIsModalEditOpen((prev) => !prev);
  const toggleModalConf = () => setIsModalConfOpen((prev) => !prev);

  const remove = (e) => {
    e.preventDefault();
    handleRemove(id);
  };

  const handleUpdate = (updatedAlarm) => {
    setCurrentAlarmTime(updatedAlarm.time);
  };

  return (
    <div className={styles.container_card}>
      <Projeto isOpen={isModalEditOpen} onClose={toggleModalEdit} id={id} onUpdate={handleUpdate} />

      <Confirmacao
        isOpen={isModalConfOpen}
        onClose={toggleModalConf}
        onConfirm={remove}
        text="Deseja remover o alarme?"
      />

      <div className={styles.project_card}>
        <ToggleSwitch id={id} />

        <h1 className={styles.category_text}>{currentAlarmTime}</h1> {/* Usa o estado atualizado */}
        <div className={styles.project_card_actions}>
          <button onClick={toggleModalEdit} className={styles.button_edit}>
            <BsPencil /> Editar
          </button>
          <button onClick={toggleModalConf} className={styles.button_remove}>
            <BsFillTrashFill /> Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

export default TimeCard;
