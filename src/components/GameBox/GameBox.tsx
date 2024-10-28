"use client"
import { useState, useEffect } from "react"
import style from "./page.module.sass"
import styles from "@/app/page.module.sass"

export default function GameBox() {
  const puzzleSize = 3
  const initialTiles: (number | null)[] = Array.from(
    { length: puzzleSize * puzzleSize - 1 },
    (_, i) => i + 1
  )
  initialTiles.push(null)

  const [grid, setGrid] = useState<(number | null)[]>(initialTiles)
  const [win, setWin] = useState('Embaralhe para começar!');
  const [movimento, setMovimento] = useState(0)
  const [winFlag, setWinFlag] = useState(style.win);
  const [melhorResultado, setMelhorResultado] = useState<number | null>(null)
  const [disableBtn, setDisableBtn] = useState(false)

  useEffect(() => {
    const recordeSalvo = localStorage.getItem("melhorResultado")
    if (recordeSalvo) {
      setMelhorResultado(parseInt(recordeSalvo, 10))
    }
  }, [])

  function animatedShuffle(moves = 100) {
    setDisableBtn(true)
    setMovimento(0)
    setWinFlag("")
    setWin("")
    let count = 0
    let lastMove: number | null = null
    let secondLastMove: number | null = null

    const shuffleInterval = setInterval(() => {
      const gridMount = (prevGrid: any) => {
        const emptyIndex = prevGrid.indexOf(null)
        const validMoves = getValidMoves(emptyIndex)

        const filteredMoves = validMoves.filter(
          (move) => move !== secondLastMove
        )
        const randomMove =
          filteredMoves[Math.floor(Math.random() * filteredMoves.length)]

        if (randomMove !== lastMove) {
          secondLastMove = lastMove
          lastMove = randomMove

          const newGrid: (number | null)[] = [...prevGrid];
          [newGrid[emptyIndex], newGrid[randomMove]] = [
            newGrid[randomMove],
            newGrid[emptyIndex],
          ]
          count++

          if (count >= moves) clearInterval(shuffleInterval)

          return newGrid
        }
        return prevGrid
      }
      setGrid(gridMount)
    }, 100)
  }

  function moveTile(index: number) {
    const emptyIndex = grid.indexOf(null)
    const validMoves = getValidMoves(emptyIndex)

    if (validMoves.includes(index)) {
      setGrid((prevGrid) => {
        const newGrid = [...prevGrid]
        ;[newGrid[emptyIndex], newGrid[index]] = [
          newGrid[index],
          newGrid[emptyIndex],
        ]
        checkWin(newGrid)
        setMovimento(movimento + 1)
        return newGrid
      })
    }
  }

  function getValidMoves(emptyIndex: number): number[] {
    const moves: number[] = []
    const row = Math.floor(emptyIndex / puzzleSize)
    const col = emptyIndex % puzzleSize

    if (row > 0) moves.push(emptyIndex - puzzleSize)
    if (row < puzzleSize - 1) moves.push(emptyIndex + puzzleSize)
    if (col > 0) moves.push(emptyIndex - 1)
    if (col < puzzleSize - 1) moves.push(emptyIndex + 1)

    return moves
  }

  function checkWin(currentGrid: (number | null)[]) {
    const isSolved = currentGrid.slice(0, -1).every((tile, i) => tile === i + 1)
    if (isSolved) {
      setDisableBtn(false)
      setWin(`Parabéns! Você completou o quebra-cabeça com ${movimento + 1} movimentos.`)
      setWinFlag(style.win)
      atualizarMelhorResultado(movimento + 1)
    }
  }

  function atualizarMelhorResultado(movimentosAtuais: number) {
    if (melhorResultado === null || movimentosAtuais < melhorResultado) {
      setMelhorResultado(movimentosAtuais)
      localStorage.setItem("melhorResultado", movimentosAtuais.toString())
    }
  }

  return (
    <>
      <div className={style.container}>
        <div className={styles.puzzle}>
          {grid.map((tile, i) => (
            <div
              key={i}
              className={`${styles.tile} ${tile === null ? styles.empty : ""}`}
              onClick={() => moveTile(i)}
              style={{ userSelect: "none" }}
            >
              {tile || ""}
            </div>
          ))}
        </div>
        <div className={winFlag}>
          <h3>{win}</h3>
        </div>
      </div>
      <p>Movimentos: {movimento}</p>
      <p>Seu melhor resultado: {melhorResultado !== null ? melhorResultado : "N/A"}</p>
      <button disabled={disableBtn} onClick={() => animatedShuffle(100)} className={styles.btn}>
        Embaralhar
      </button>
    </>
  )
}
