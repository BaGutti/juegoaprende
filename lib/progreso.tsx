"use client";
import { createContext, useContext, useEffect, useState } from "react";

interface ProgresoContextType {
  xpTotal: number;
  nivel: number;
  puzzlesCompletados: Set<string>;
  completarPuzzle: (puzzleId: string, xp: number) => void;
  isPuzzleCompletado: (puzzleId: string) => boolean;
}

const ProgresoContext = createContext<ProgresoContextType | null>(null);

export function ProgresoProvider({ children }: { children: React.ReactNode }) {
  const [xpTotal, setXpTotal] = useState(0);
  const [puzzlesCompletados, setPuzzlesCompletados] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const data = localStorage.getItem("progreso");
    if (data) {
      const parsed = JSON.parse(data);
      setXpTotal(parsed.xpTotal ?? 0);
      setPuzzlesCompletados(new Set(parsed.puzzlesCompletados ?? []));
    }
  }, []);

  const guardar = (xp: number, completados: Set<string>) => {
    localStorage.setItem(
      "progreso",
      JSON.stringify({
        xpTotal: xp,
        puzzlesCompletados: Array.from(completados),
      })
    );
  };

  const completarPuzzle = (puzzleId: string, xp: number) => {
    if (puzzlesCompletados.has(puzzleId)) return;
    const nuevos = new Set(puzzlesCompletados);
    nuevos.add(puzzleId);
    const nuevoXp = xpTotal + xp;
    setPuzzlesCompletados(nuevos);
    setXpTotal(nuevoXp);
    guardar(nuevoXp, nuevos);
  };

  const nivel = Math.floor(xpTotal / 50) + 1;

  return (
    <ProgresoContext.Provider
      value={{
        xpTotal,
        nivel,
        puzzlesCompletados,
        completarPuzzle,
        isPuzzleCompletado: (id) => puzzlesCompletados.has(id),
      }}
    >
      {children}
    </ProgresoContext.Provider>
  );
}

export function useProgreso() {
  const ctx = useContext(ProgresoContext);
  if (!ctx) throw new Error("useProgreso fuera del ProgresoProvider");
  return ctx;
}
