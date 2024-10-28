import GameBox from "@/components/GameBox/GameBox"
import styles from '@/app/page.module.sass'

export default function Game() {
  return (
    <div className={styles.main}>
      <GameBox />
    </div>
  )
}