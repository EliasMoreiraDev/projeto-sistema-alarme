import { Link } from "react-router-dom"
import styles from './NavBar.module.css'
import logo from '../../imagens/Logo-Nav.png'


function NavBar(){

    return(
        <nav className={styles.navbar}>
            <div className={styles.titulo}>Sistema de Controle de Alarmes</div>

            <img src={logo} alt='IFRO' className={styles.logo}/>
        </nav>
    )
}
export default NavBar