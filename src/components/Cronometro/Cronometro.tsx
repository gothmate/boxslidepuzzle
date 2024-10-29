'use client'

import { useState, useEffect } from 'react';

export default function Cronometro() {
  const [segundos, setSegundos] = useState(0);
  const [ativo, setAtivo] = useState(false);

  useEffect(() => {
    let intervalo: NodeJS.Timeout | undefined
    if (ativo) {
      intervalo = setInterval(() => {
        setSegundos((segundos) => segundos + 1)
      }, 1000)
    } else if (!ativo && segundos !== 0) {
        clearInterval(intervalo)
    }
    return () => clearInterval(intervalo);
  }, [ativo, segundos]);

  const iniciarCronometro = () => {
    setAtivo(true);
  };

  const pausarCronometro = () => {
    setAtivo(false);
  };

  const resetarCronometro = () => {
    setAtivo(false);
    setSegundos(0);
  };

  const formatarTempo = (segundos: number) => {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    return `${String(minutos).padStart(2, '0')}:${String(segundosRestantes).padStart(2, '0')}`;
  };

  return (
    <div>
      <h1>Cronômetro</h1>
      <p>{formatarTempo(segundos)}</p>
      <button onClick={iniciarCronometro} disabled={ativo}>
        Iniciar
      </button>
      <button onClick={pausarCronometro} disabled={!ativo}>
        Pausar
      </button>
      <button onClick={resetarCronometro}>
        Resetar
      </button>
    </div>
  )
}
