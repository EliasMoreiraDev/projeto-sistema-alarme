
import styles from './Home.module.css'
import logo from '../../imagens/Logo-Nav.png'
import img from '../../imagens/prediomoeda.png'
import LinkButton from '../layouts/LinkButton'
function Home(){
    return(
        <section className={styles.caixaConteudo}>
            
            <div>
                <h1>Bem vindo ao <img src={logo} alt="Logo costs"/></h1>
                <p>Comece seus projetos agora mesmo!</p>
                <LinkButton to='/newTime' text='Criar projeto'/>
            </div>
           
            
            <img className={styles.imgPrincipal} src={img} alt="imagem principal"></img>
        </section>
    )
}

export default Home