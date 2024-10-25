import Header from "@/components/Header/Header";
import styles from "./page.module.sass";
import Footer from "@/components/Footer/Footer";
import GameBox from "@/components/GameBox/GameBox";

export default function Home() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <GameBox />
      </main>
      <Footer />
    </div>
  );
}
