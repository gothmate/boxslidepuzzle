import styles from '@/app/page.module.sass'
import Link from "next/link";

export default function Home() {
  return (
		<div className={styles.container}>
			<div className={styles.bloco}>
				<h3>O Desafio dos Quebra-Cabeças Deslizantes</h3>
				<p>
					Imagine um jogo que desafia o seu raciocínio lógico, paciência e
					habilidade de planejamento...
				</p>
				<p>
					Esse é o Box Slide! O objetivo é mover as peças dentro de um tabuleiro
					até alcançar uma disposição final específica.
				</p>
				<p>Parece simples?</p>
				<p>É aí que vem o desafio! Como Funciona?</p>
			</div>
			<div className={styles.bloco}>
				<h3>Objetivo:</h3>
				<p>
					Organizar as peças do tabuleiro conforme uma imagem ou padrão
					predefinido.
				</p>
			</div>
			<div className={styles.bloco}>
				<h3>Movimentos:</h3>
				<p>
					Só é possível deslizar as peças para o espaço vazio, um de cada vez.
				</p>
			</div>
			<div className={styles.bloco}>
				<h3>Desafio:</h3>
				<p>
				Concluir o jogo no menor número de movimentos. Curiosidade Sabia que o
				Box Slide tem raízes que remontam aos quebra-cabeças japoneses do século
				19? Esse tipo de jogo tem até um apelido lá: “Hakoiri Musume”, que
				significa algo como filha confinada em uma caixa. A ideia era criar uma
				solução estratégica para um problema aparentemente simples, mas com
				infinitas possibilidades de resolução! Por Que Jogar Box Slide? Além de
				ser uma ótima maneira de passar o tempo, jogar Box Slide ajuda a:
				Desenvolver habilidades de resolução de problemas. Melhorar o pensamento
				estratégico. Treinar a paciência e o foco.
				</p>
			</div>
			<div className={styles.bloco}>
				<h3>Conclusão:</h3>
				<p>
					O Box Slide é muito
					mais que um jogo – é um exercício para o cérebro! Se você acha que está
					preparado para o desafio, venha experimentar e descobrir o quão ágil e
					estratégico você consegue ser.
				</p>
			</div>
			<Link className={styles.link} href='/game'>
				Jogar
			</Link>
		</div>
	)
}
