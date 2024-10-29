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
  const [win, setWin] = useState("Embaralhe para começar!")
  const [movimento, setMovimento] = useState(0)
  const [winFlag, setWinFlag] = useState(style.win)
  const [melhorResultado, setMelhorResultado] = useState<number | null>(null)
  const [melhorTempo, setMelhorTempo] = useState<number | null>(null)
  const [disableBtn, setDisableBtn] = useState(false)
  const [segundos, setSegundos] = useState(0)
  const [ativo, setAtivo] = useState(false)

  function iniciarCronometro() {
    setAtivo(true)
  }

  function pausarCronometro() {
    setAtivo(false)
  }

  function resetarCronometro() {
    setAtivo(false)
    setSegundos(0)
  }

  function formatarTempo(segundos: number) {
    const minutos = Math.floor(segundos / 60)
    const segundosRestantes = segundos % 60
    return `${String(minutos).padStart(2, "0")}:${String(
      segundosRestantes
    ).padStart(2, "0")}`
  }

  function animatedShuffle(moves = 100) {
    resetarCronometro()
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
    }, 10)
    iniciarCronometro()
  }

  function moveTile(index: number) {
    const emptyIndex = grid.indexOf(null)
    const validMoves = getValidMoves(emptyIndex)

    if (validMoves.includes(index)) {
      setGrid((prevGrid) => {
        const newGrid = [...prevGrid];
        [newGrid[emptyIndex], newGrid[index]] = [
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
      pausarCronometro()
      setDisableBtn(false)
      setWin(
        `Parabéns! Você completou o quebra-cabeça com ${
          movimento + 1
        } movimentos em ${formatarTempo(segundos)}`
      )
      setWinFlag(style.win)
      atualizarMelhorResultado(movimento + 1, segundos)
    }
  }

  function atualizarMelhorResultado(movimentosAtuais: number, tempoAtual: number) {
    if (melhorResultado === null || movimentosAtuais < melhorResultado) {
      setMelhorResultado(movimentosAtuais)
      localStorage.setItem("melhorResultado", movimentosAtuais.toString())
    }
    if (melhorTempo === null || tempoAtual < melhorTempo) {
      setMelhorTempo(tempoAtual)
      localStorage.setItem("melhorTempo", tempoAtual.toString())
    }
  }

  useEffect(() => {
    let intervalo: NodeJS.Timeout | undefined
    if (ativo) {
      intervalo = setInterval(() => {
        setSegundos((segundos) => segundos + 1)
      }, 1000)
    } else if (!ativo && segundos !== 0) {
      clearInterval(intervalo)
    }
    return () => clearInterval(intervalo)
  }, [ativo, segundos])

  useEffect(() => {
    const recordeSalvo = localStorage.getItem("melhorResultado")
    const melhorTempoSalvo = localStorage.getItem("melhorTempo")

    if (recordeSalvo) {
      setMelhorResultado(parseInt(recordeSalvo, 10))
    }
    if (melhorTempoSalvo) {
      setMelhorTempo(parseInt(melhorTempoSalvo, 10))
    }
  }, [])

  return (
    <>
      <div className={style.container}>
        <p>{formatarTempo(segundos)}</p>
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
      <p className={style.movimentos}>Movimentos: {movimento}</p>
      <p>
        Seu melhor resultado: {melhorResultado !== null ? melhorResultado : "N/A"}
      </p>
      <p>
        Melhor tempo:{" "}
        {melhorTempo !== null ? formatarTempo(melhorTempo) : "N/A"}
      </p>
      <button
        disabled={disableBtn}
        onClick={() => animatedShuffle(100)}
        className={styles.btn}
      >
        Embaralhar
      </button>
    </>
  )
}
