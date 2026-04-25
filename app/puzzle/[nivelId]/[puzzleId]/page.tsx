"use client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getPuzzle } from "@/lib/lecciones";
import { useProgreso } from "@/lib/progreso";
import PuzzleInteractivo from "@/components/PuzzleInteractivo";
import { useState } from "react";

export default function PuzzlePage() {
  const params = useParams();
  const nivelId = params.nivelId as string;
  const puzzleId = params.puzzleId as string;
  const data = getPuzzle(nivelId, puzzleId);
  const { completarPuzzle, isPuzzleCompletado, xpTotal } = useProgreso();
  const [completado, setCompletado] = useState(false);
  const [xpGanado, setXpGanado] = useState(0);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#06080f]">
        <div className="text-center animate-pop-in">
          <p className="text-6xl mb-4">😕</p>
          <p className="text-slate-400">Puzzle no encontrado</p>
          <Link href="/" className="text-indigo-400 hover:text-indigo-300 underline mt-4 block">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const { puzzle, nivel } = data;
  const yaCompletado = isPuzzleCompletado(puzzle.id);
  const idxActual = nivel.puzzles.findIndex((p) => p.id === puzzle.id);
  const siguientePuzzle = nivel.puzzles[idxActual + 1];

  const handleCompletado = (xp: number) => {
    if (!yaCompletado) {
      completarPuzzle(puzzle.id, xp);
      setXpGanado(xp);
    }
    setCompletado(true);
  };

  const tipoLabel: Record<string, string> = {
    "opcion-multiple": "Opción múltiple",
    "completar": "Completar código",
    "ordenar": "Ordenar bloques",
    "verdadero-falso": "Verdadero / Falso",
    "emparejar": "Emparejar",
  };

  const tipoColor: Record<string, string> = {
    "opcion-multiple": "text-blue-400 bg-blue-500/10 border-blue-500/20",
    "completar": "text-purple-400 bg-purple-500/10 border-purple-500/20",
    "ordenar": "text-orange-400 bg-orange-500/10 border-orange-500/20",
    "verdadero-falso": "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    "emparejar": "text-pink-400 bg-pink-500/10 border-pink-500/20",
  };

  return (
    <div className="min-h-screen bg-[#06080f] text-white relative overflow-x-hidden">
      {/* Nebulas */}
      <div className="nebula-1" />
      <div className="nebula-2" />
      <div className="bg-grid fixed inset-0 pointer-events-none" />

      {/* ── Header ────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06]"
        style={{ background: "rgba(6,8,15,0.85)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href={`/nivel/${nivelId}`}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm group shrink-0"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
            <span>{nivel.titulo}</span>
          </Link>
          <span className="text-slate-700">/</span>
          <span className="text-sm text-white font-semibold truncate">{puzzle.titulo}</span>
          <div className="ml-auto flex items-center gap-2 shrink-0">
            <span className={`hidden sm:inline text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tipoColor[puzzle.tipo]}`}>
              {tipoLabel[puzzle.tipo]}
            </span>
            <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-2 py-1">
              <span className="text-yellow-400 text-xs">⚡</span>
              <span className="text-yellow-300 font-bold text-xs">+{puzzle.xp}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-2xl mx-auto px-4 py-10">
        {!completado ? (
          <>
            {/* ── Puzzle header ──────────────────────────────────── */}
            <div className="animate-slide-up mb-6">
              {/* Level + progress indicator */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${nivel.color} flex items-center justify-center text-base`}>
                    {nivel.icono}
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r ${nivel.color} text-white`}>
                    {nivel.titulo}
                  </span>
                </div>
                {/* Step dots */}
                <div className="flex items-center gap-1.5">
                  {nivel.puzzles.map((p, i) => (
                    <div
                      key={p.id}
                      className={`rounded-full transition-all duration-300 ${
                        isPuzzleCompletado(p.id)
                          ? "w-2 h-2 bg-green-400"
                          : i === idxActual
                          ? "w-4 h-2 bg-indigo-400"
                          : "w-2 h-2 bg-white/10"
                      }`}
                    />
                  ))}
                  <span className="text-xs text-slate-500 ml-1">
                    {idxActual + 1}/{nivel.puzzles.length}
                  </span>
                </div>
              </div>

              <h1 className="text-2xl font-bold text-white mb-3">{puzzle.titulo}</h1>

              {/* Description card */}
              <div className="relative rounded-2xl border border-white/[0.07] overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${nivel.color} opacity-[0.04]`} />
                <div className="relative p-4 text-slate-300 text-sm leading-relaxed">
                  {puzzle.descripcion}
                </div>
              </div>
            </div>

            {/* ── Puzzle interactivo ────────────────────────────── */}
            <div className="glass rounded-2xl p-5 border border-white/[0.07] animate-slide-up"
              style={{ animationDelay: "0.1s" }}>
              <PuzzleInteractivo puzzle={puzzle} onCompletado={handleCompletado} />
            </div>
          </>
        ) : (
          /* ── Success screen ──────────────────────────────────── */
          <div className="text-center animate-pop-in py-10">
            {/* Big celebration */}
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-yellow-400 rounded-full blur-2xl opacity-20 animate-pulse" />
              <div className="relative text-8xl animate-bounce-in">🎉</div>
            </div>

            <h2 className="text-3xl font-bold mb-2">
              {yaCompletado ? "¡Ya lo tenías!" : "¡Puzzle completado!"}
            </h2>

            {!yaCompletado && (
              <div className="inline-flex items-center gap-2 mt-3 mb-2 px-6 py-3 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 animate-slide-up" style={{ animationDelay: "0.15s" }}>
                <span className="text-3xl font-bold text-yellow-300">+{xpGanado}</span>
                <span className="text-yellow-400 font-semibold">XP ganados</span>
                <span className="text-yellow-300 animate-spin-slow">⚡</span>
              </div>
            )}

            <p className="text-slate-400 text-sm mt-2 mb-8">
              Total acumulado: <span className="text-white font-semibold">{xpTotal} XP</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
              {siguientePuzzle ? (
                <Link
                  href={`/puzzle/${nivelId}/${siguientePuzzle.id}`}
                  className="relative group px-7 py-3 rounded-2xl font-semibold transition-all duration-200 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600" />
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 shadow-[0_0_30px_rgba(99,102,241,0.4)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative">Siguiente puzzle →</span>
                </Link>
              ) : (
                <Link
                  href={`/nivel/${nivelId}`}
                  className="relative group px-7 py-3 rounded-2xl font-semibold transition-all duration-200 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600" />
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative">¡Nivel completado! 🏆</span>
                </Link>
              )}
              <Link
                href={`/nivel/${nivelId}`}
                className="px-7 py-3 rounded-2xl font-semibold border border-white/10 hover:border-white/25 hover:bg-white/[0.04] text-slate-300 hover:text-white transition-all duration-200"
              >
                Ver todos los puzzles
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
