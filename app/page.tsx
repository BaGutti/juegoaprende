"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { niveles } from "@/lib/lecciones";
import { useProgreso } from "@/lib/progreso";
import { LEVELS } from "@/components/RobotGame";

// Rendered only on the client to avoid SSR/hydration mismatch with Math.random()
function Stars() {
  const [stars, setStars] = useState<Array<{
    id: number; left: string; top: string;
    delay: string; duration: string; size: number;
  }>>([]);

  useEffect(() => {
    setStars(Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 4}s`,
      duration: `${1.5 + Math.random() * 3}s`,
      size: Math.random() > 0.8 ? 3 : 2,
    })));
  }, []);

  return (
    <div className="stars-container">
      {stars.map((s) => (
        <div
          key={s.id}
          className="star animate-star-twinkle"
          style={{
            left: s.left,
            top: s.top,
            animationDelay: s.delay,
            animationDuration: s.duration,
            width: s.size,
            height: s.size,
          }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const { xpTotal, nivel, puzzlesCompletados } = useProgreso();

  const xpParaSiguienteNivel = nivel * 50;
  const xpEnNivelActual = xpTotal - (nivel - 1) * 50;
  const porcentaje = Math.min(100, (xpEnNivelActual / 50) * 100);
  const totalPuzzles = niveles.reduce((acc, n) => acc + n.puzzles.length, 0);

  // Robot completado = todos los niveles del robot completados
  const robotNivelesCompletados = LEVELS.filter((l) => puzzlesCompletados.has(`robot-${l.id}`)).length;
  const robotTerminado = robotNivelesCompletados === LEVELS.length;
  const robotXP = LEVELS.reduce((a, l) => a + l.xp, 0);
  const robotPct = Math.round((robotNivelesCompletados / LEVELS.length) * 100);

  return (
    <div className="min-h-screen bg-[#06080f] text-white relative overflow-x-hidden">
      {/* Nebulas */}
      <div className="nebula-1" />
      <div className="nebula-2" />
      <div className="nebula-3" />

      {/* Stars */}
      <Stars />

      {/* Grid overlay */}
      <div className="bg-grid fixed inset-0 pointer-events-none" />

      {/* ── Header ────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06]"
        style={{ background: "rgba(6,8,15,0.85)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 rounded-xl blur-md opacity-40" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl">
                🤖
              </div>
            </div>
            <div>
              <h1 className="text-base font-bold shimmer-text leading-none">JuegoCódigo</h1>
              <p className="text-[10px] text-slate-500 mt-0.5">Arduino · C++ · Interactivo</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* XP Badge */}
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-500 rounded-lg blur-sm opacity-20" />
              <div className="relative flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-1.5">
                <span className="text-yellow-400 text-sm">⚡</span>
                <span className="text-yellow-300 font-bold text-sm">{xpTotal} XP</span>
              </div>
            </div>

            {/* Level + XP bar */}
            <div className="hidden sm:flex flex-col items-end gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Nivel</span>
                <span className="text-xs font-bold text-white bg-indigo-500/30 border border-indigo-500/40 rounded px-1.5 py-0.5">{nivel}</span>
              </div>
              <div className="w-28 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full xp-bar-fill"
                  style={{
                    width: `${porcentaje}%`,
                    background: "linear-gradient(90deg, #6366f1, #a855f7, #38bdf8)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 py-12">
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <div className="text-center mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6 animate-slide-up"
            style={{ animationDelay: "0.05s" }}>
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Aprende programando · Gratis · Sin registro
            </div>
          </div>

          {/* Title */}
          <h2
            className="text-5xl sm:text-6xl md:text-7xl font-bold mb-5 leading-tight animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            Programa tu{" "}
            <span className="shimmer-text">primer Arduino</span>
          </h2>

          <p
            className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed animate-slide-up"
            style={{ animationDelay: "0.15s" }}
          >
            Aprende variables, condiciones, bucles, funciones y más resolviendo
            puzzles interactivos. Cada reto te acerca a crear proyectos reales con Arduino.
          </p>

          {/* Stats */}
          <div
            className="flex items-center justify-center gap-8 mt-8 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            {[
              { val: niveles.length, label: "Niveles" },
              { val: totalPuzzles, label: "Puzzles" },
              { val: "5", label: "Minijuegos" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold text-white">{s.val}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Progress overview ─────────────────────────────────────────── */}
        {xpTotal > 0 && (
          <div className="mb-10 animate-slide-up glass rounded-2xl p-5 border border-indigo-500/20"
            style={{ animationDelay: "0.25s" }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🏆</span>
                <span className="font-semibold text-white">Tu progreso</span>
              </div>
              <span className="text-sm text-slate-400">
                {puzzlesCompletados.size}/{totalPuzzles} puzzles
              </span>
            </div>
            <div className="w-full h-2.5 bg-white/[0.05] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full xp-bar-fill"
                style={{
                  width: `${(puzzlesCompletados.size / totalPuzzles) * 100}%`,
                  background: "linear-gradient(90deg, #6366f1, #a855f7, #22d3ee)",
                }}
              />
            </div>
          </div>
        )}

        {/* ── Level Map ─────────────────────────────────────────────────── */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: "0.28s" }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-widest">Mapa de aprendizaje</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          <div className="grid gap-4">

            {/* ── Robot Game (siempre desbloqueado, prerrequisito) ────── */}
            <Link href="/juego" className="group block" style={{ animationDelay: "0.3s" }}>
              <div className={`relative rounded-2xl border transition-all duration-300 overflow-hidden
                ${robotTerminado
                  ? "border-green-500/30 bg-green-500/[0.04] hover:border-green-400/50 hover:shadow-[0_0_30px_rgba(34,197,94,0.12)]"
                  : "border-indigo-500/20 bg-indigo-500/[0.03] hover:border-indigo-400/40 hover:bg-indigo-500/[0.06] hover:shadow-[0_0_30px_rgba(99,102,241,0.12)] hover:-translate-y-0.5"
                }`}>
                {/* top stripe */}
                {robotPct > 0 && (
                  <div className="absolute top-0 left-0 h-0.5 transition-all duration-700"
                    style={{
                      width: `${robotPct}%`,
                      background: robotTerminado ? "linear-gradient(90deg,#22c55e,#16a34a)" : "linear-gradient(90deg,#6366f1,#a855f7,#38bdf8)",
                    }}
                  />
                )}
                <div className="p-5 flex items-center gap-4">
                  <div className="relative shrink-0">
                    {robotTerminado && <div className="absolute inset-0 bg-green-500 rounded-2xl blur-lg opacity-30 animate-pulse-glow-green" />}
                    <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center text-3xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg
                      ${!robotTerminado ? "group-hover:scale-110 transition-transform duration-200" : "ring-2 ring-green-400/50"}
                    `}>
                      {robotTerminado ? "✅" : "🤖"}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wide">Introducción</span>
                      {robotTerminado
                        ? <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">✓ Completado</span>
                        : <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">Juego de bloques</span>
                      }
                    </div>
                    <h3 className="font-bold text-white text-lg leading-tight">Robot Programable</h3>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed line-clamp-1">
                      Aprende lógica de programación moviendo un robot con bloques. Complétalo para desbloquear el Nivel 1.
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${robotTerminado ? "bg-gradient-to-r from-green-400 to-emerald-400" : "bg-gradient-to-r from-indigo-500 to-purple-500"}`}
                          style={{ width: `${robotPct}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 shrink-0">{robotNivelesCompletados}/{LEVELS.length}</span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right hidden sm:block">
                    <div className="text-xs text-slate-500 mb-1">recompensa</div>
                    <div className="text-sm font-bold text-yellow-400">⚡ {robotXP} XP</div>
                    {!robotTerminado && (
                      <div className="mt-2 text-xs text-indigo-400 group-hover:text-indigo-300 transition-colors">Jugar →</div>
                    )}
                  </div>
                </div>
              </div>
            </Link>

            {/* ── Puzzle levels ─────────────────────────────────────── */}
            {niveles.map((n, idx) => {
              const completados = n.puzzles.filter((p) => puzzlesCompletados.has(p.id)).length;
              const total = n.puzzles.length;
              const pct = Math.round((completados / total) * 100);
              // Nivel 1 requires robot done; subsequent levels require previous level done
              const desbloqueado =
                idx === 0
                  ? robotTerminado
                  : niveles[idx - 1].puzzles.every((p) => puzzlesCompletados.has(p.id));
              const terminado = completados === total;

              return (
                <Link
                  key={n.id}
                  href={desbloqueado ? `/nivel/${n.id}` : "#"}
                  className={`group block ${!desbloqueado ? "cursor-not-allowed" : ""}`}
                  style={{ animationDelay: `${0.3 + idx * 0.06}s` }}
                >
                  <div
                    className={`relative rounded-2xl border transition-all duration-300 overflow-hidden
                      ${desbloqueado
                        ? terminado
                          ? "border-green-500/30 bg-green-500/[0.04] hover:border-green-400/50 hover:shadow-[0_0_30px_rgba(34,197,94,0.12)]"
                          : "border-white/[0.08] bg-white/[0.02] hover:border-indigo-400/40 hover:bg-indigo-500/[0.04] hover:shadow-[0_0_30px_rgba(99,102,241,0.1)] hover:-translate-y-0.5"
                        : "border-white/[0.04] bg-white/[0.01] opacity-50"
                      }`}
                  >
                    {/* Progress stripe at top */}
                    {desbloqueado && pct > 0 && (
                      <div className="absolute top-0 left-0 h-0.5 rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          background: `linear-gradient(90deg, var(--tw-gradient-stops))`,
                          backgroundImage: `linear-gradient(90deg, ${terminado ? "#22c55e, #16a34a" : `#6366f1, #a855f7`})`,
                        }}
                      />
                    )}

                    <div className="p-5 flex items-center gap-4">
                      {/* Icon */}
                      <div className="relative shrink-0">
                        {terminado && (
                          <div className="absolute inset-0 bg-green-500 rounded-2xl blur-lg opacity-30 animate-pulse-glow-green" />
                        )}
                        <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center text-3xl bg-gradient-to-br ${n.color} shadow-lg
                          ${desbloqueado && !terminado ? "group-hover:scale-110 transition-transform duration-200" : ""}
                          ${terminado ? "ring-2 ring-green-400/50" : ""}
                        `}>
                          {terminado ? "✅" : !desbloqueado ? "🔒" : n.icono}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">
                            Nivel {n.numero}
                          </span>
                          {terminado && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                              ✓ Completado
                            </span>
                          )}
                          {!desbloqueado && (
                            <span className="text-[10px] text-slate-600">Bloqueado</span>
                          )}
                        </div>
                        <h3 className="font-bold text-white text-lg leading-tight">{n.titulo}</h3>
                        <p className="text-slate-400 text-xs mt-1 leading-relaxed line-clamp-1">
                          {n.descripcion}
                        </p>

                        {/* Mini progress bar */}
                        {desbloqueado && (
                          <div className="mt-3 flex items-center gap-3">
                            <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-700 bg-gradient-to-r ${terminado ? "from-green-400 to-emerald-400" : n.color}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-slate-500 shrink-0">
                              {completados}/{total}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* XP total del nivel */}
                      <div className="shrink-0 text-right hidden sm:block">
                        <div className="text-xs text-slate-500 mb-1">recompensa</div>
                        <div className="text-sm font-bold text-yellow-400">
                          ⚡ {n.puzzles.reduce((a, p) => a + p.xp, 0)} XP
                        </div>
                        {desbloqueado && !terminado && (
                          <div className="mt-2 text-xs text-indigo-400 group-hover:text-indigo-300 transition-colors">
                            Jugar →
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Footer ────────────────────────────────────────────────────── */}
        <div className="mt-16 text-center space-y-1">
          <p className="text-slate-600 text-xs">
            {puzzlesCompletados.size} puzzles completados · {xpTotal} XP acumulados
          </p>
          <p className="text-slate-700 text-xs">
            Hecho con ❤️ para aprender Arduino
          </p>
        </div>
      </main>
    </div>
  );
}
