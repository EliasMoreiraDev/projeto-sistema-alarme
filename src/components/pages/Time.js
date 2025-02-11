import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useSuapClient from '../../login_suap/client';
import Message from "../layouts/Message";
import styles from './Time.module.css';
import Container from '../layouts/Container';
import TimeCard from "../alarms/TimeCard";
import Loading from "../layouts/Loading";
import NoTimes from "../layouts/NoTime";
import HorarioReal from "../layouts/HorarioReal";
import NewTime from "./NewTime";
import Confirmacao from "../layouts/Confirmacao";
import DiasDeAlarme from "../layouts/DiasDeAlarme";
import { ip } from "../ip";
import AddUser from "./AddUser";
import Cookies from "js-cookie";

function Time() {
  const [removeLoading, setRemoveLoading] = useState(false);
  const [times, setTimes] = useState([]);
  const [users, setUser] = useState([]);
  const [timeMessage, setTimeMessage] = useState('');
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [isModalAddUserOpen, setIsModalAddUserOpen] = useState(false);
  const [isModalConfOpen, setIsModalConfOpen] = useState(false);

  const clientID = 'S3uUVTw2uvD0hixw0zsrJxlNJt8aWIPXU70LhtYH';
  const redirectURI = 'http://localhost:3000/times';
  const authHost = 'https://suap.ifro.edu.br';
  const scope = 'identificacao email documentos_pessoais';

  const { logout } = useSuapClient(authHost, clientID, redirectURI, scope);
  const navigate = useNavigate();
  const logoutUser = () => {
    setRemoveLoading(false); 
    setTimeout(() => {
      navigate('/login');
    }, 2000); 
};


  useEffect(() => {
    setTimeout(() => {
      fetch(`http://${ip}:5000/alarms`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((resp) => resp.json())
        .then((data) => {
          setTimes(data);
          setRemoveLoading(true);
        })
        .catch((err) => console.log(err));
    }, 1500);
}, []);

const dispararSirene = async () => {
  try {
      const esp8266IP = '10.84.101.15';
      const response = await fetch(`${esp8266IP}/tocar`, { method: 'GET' });
      
      if (response.ok) {
          alert("Sirene disparada com sucesso!");
      } else {
          alert("Erro ao disparar a sirene.");
      }
  } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Falha na comunicação com o ESP8266.");
  }
};

  function removeTime(id){
    fetch(`http://${ip}:5000/alarms/${id}` ,{
        method: 'DELETE',
        headers: {
            'Content-Type':'application/json'
        },
    }).then(resp => resp.json())
    .then(() =>{
        setTimes(times.filter((time)=> time.id !== id))
        setTimeMessage('Alarme removido com sucesso!')
    })
    .catch(erro => console.log(erro))
}


  const openModalAdd = () => setIsModalAddOpen(true);
  const closeModalAdd = () => setIsModalAddOpen(false);
  const openModalAddUser = () => setIsModalAddUserOpen(true);
  const closeModalAddUser = () => setIsModalAddUserOpen(false);

  const openModalConf = () => setIsModalConfOpen(true);
  const closeModalConf = () => setIsModalConfOpen(false);

  const addTime = (newTime) => setTimes((prevTimes) => [...prevTimes, newTime]);
  const addUsers = (newUser) => setUser((prevUsers) => [...prevUsers, newUser]);

  return (
    <div className={styles.project_container}>
      
      <HorarioReal />
      <div className={styles.botoes_log}>
        
        <button className={styles.botaoAddUser} onClick={openModalAddUser}>
          <span className="material-symbols-outlined">
            person_add
          </span>
        </button>

        <button className={styles.botaoLogout} onClick={logoutUser}>
          <span className="material-symbols-outlined">
            logout
          </span>
        </button>
        
      </div>
      <NewTime isOpen={isModalAddOpen} onClose={closeModalAdd} addTime={addTime} />
      <AddUser isOpen={isModalAddUserOpen} onClose={closeModalAddUser} addUser={addUsers}/>
      <Confirmacao isOpen={isModalConfOpen} onClose={closeModalConf} onConfirm={dispararSirene} text="Deseja tocar a sirene agora?" />
      
      <div className={styles.title_container}>
        <div className={styles.caixaBotoes}>
          <button className={styles.botaoCriar} onClick={openModalAdd}>Adicionar Horário</button>
          <button className={styles.botaoTocarAgora} onClick={openModalConf}>Tocar Agora</button>
          
        </div>
        
        <DiasDeAlarme />
        <h1>Alarmes</h1>
      </div>
      

      {timeMessage && <Message type="success" msg={timeMessage} />}
      
      <Container customClass="column">
        {times.length > 0 &&
          times.map((time) => <TimeCard key={time.id} id={time.id} time={time.time} handleRemove={removeTime} />)
          }

        {!removeLoading && <Loading />}

        {removeLoading && times.length === 0 && <NoTimes />}
      </Container>
    </div>
  );
}

export default Time;
