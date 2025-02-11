import {FaGithub} from 'react-icons/fa'
import styles from './Footer.module.css'

import fundoFooter from '../../imagens/fundo-rodape.png'
function Footer(){
    return(
        <footer>
            <div>
                <p>COSTS &copy; 2023</p>
                <nav>
                    
                <a className={styles.social} href="#">
                    <FaGithub className={styles.logogit}/> EliasMoreiraDev
                </a>
                </nav>
            </div>
        </footer>
    )
}
export default Footer