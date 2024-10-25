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
  const [win, setWin] = useState('')


  function animatedShuffle(moves = 100) {
    setWin('')
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
          [newGrid[emptyIndex], newGrid[randomMove]] = [newGrid[randomMove], newGrid[emptyIndex]]
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
        const newGrid = [...prevGrid];
        [newGrid[emptyIndex], newGrid[index]] = [newGrid[index], newGrid[emptyIndex]]
        checkWin(newGrid)
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
    const isSolved = currentGrid
      .slice(0, -1)
      .every((tile, i) => tile === i + 1)
    if (isSolved) setWin("Parabéns! Você completou o quebra-cabeça!")
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
            <p>{win}</p>
        </div>
        <button onClick={() => animatedShuffle(100)} className={styles.btn}>Replay</button>
    </>
  )
}
