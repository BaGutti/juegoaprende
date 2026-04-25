"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getNivel, niveles } from "@/lib/lecciones";
import { useProgreso } from "@/lib/progreso";

export default function NivelPage() {
  const params = useParams();
  const nivelId = params.id as string;
  const nivel = getNivel(nivelId);
  const { isPuzzleCompletado, xpTotal } = useProgreso();

  if (!nivel) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#06080f]">
        <div className="text-center animate-pop-in">
          <p className="text-6xl mb-4">😕</p>
          <p className="text-slate-400">Nivel no encontrado</p>
          <Link href="/" className="text-indigo-400 hover:text-indigo-300 underline mt-4 block transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const completados = nivel.puzzles.filter((p) => isPuzzleCompletado(p.id)).length;
  const total = nivel.puzzles.length;
  const pct = Math.round((completados / total) * 100);
  const terminado = completados === total;
  const xpNivel = nivel.puzzles.reduce((a, p) => a + p.xp, 0);

  return (
    <div className="min-h-screen bg-[#06080f] text-white relative overflow-x-hidden">
      {/* Nebulas */}
      <div className="nebula-1" />
      <div className="nebula-2" />
      <div className="bg-grid fixed inset-0 pointer-events-none" />

      {/* ── Header ──────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06]"
        style={{ background: "rgba(6,8,15,0.85)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/"
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm group">
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
            <span>Inicio</span>
          </Link>
          <span className="text-slate-700">/</span>
          <span className="text-sm text-white font-semibold">{nivel.titulo}</span>
          <div className="ml-auto flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-2.5 py-1">
            <span className="text-yellow-400 text-xs">⚡</span>
            <span className="text-yellow-300 font-bold text-xs">{xpTotal} XP</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-3xl mx-auto px-4 py-10">
        {/* ── Hero banner del nivel ────────────────────────────────── */}
        <div className={`relative rounded-3xl overflow-hidden mb-8 animate-slide-up`}>
          {/* Gradient bg */}
          <div className={`absolute inset-0 bg-gradient-to-br ${nivel.color} opacity-20`} />
          <div className="absolute inset-0 bg-[#06080f]/60" />
          {/* Glow */}
          <div className={`absolute inset-0 bg-gradient-to-br ${nivel.color} opacity-5 blur-2xl`} />

          <div className="relative p-8 flex items-center gap-6">
            <div className="relative shrink-0">
              <div className={`absolute inset-0 bg-gradient-to-br ${nivel.color} rounded-2xl blur-xl opacity-60`} />
              <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${nivel.color} flex items-center justify-center text-4xl shadow-2xl`}>
                {nivel.icono}
              </div>
            </div>
            <div className="flex-1">
              <div className="text-xs text-white/50 font-semibold uppercase tracking-widest mb-1">
                Nivel {nivel.numero}
              </div>
              <h1 className="text-3xl font-bold text-white mb-1">{nivel.titulo}</h1>
              <p className="text-white/60 text-sm">{nivel.descripcion}</p>
            </div>
            <div className="shrink-0 text-right hidden sm:block">
              <div className="text-xs text-white/40 mb-1">total</div>
              <div className="text-2xl font-bold text-yellow-300">⚡ {xpNivel}</div>
              <div className="text-xs text-white/40">XP disponibles</div>
            </div>
          </div>
        </div>

        {/* ── Progress card ────────────────────────────────────────── */}
        <div className={`glass rounded-2xl p-5 mb-8 border animate-slide-up
          ${terminado ? "border-green-500/30" : "border-white/[0.07]"}`}
          style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {terminado
                ? <span className="text-lg animate-bounce-in">🏆</span>
                : <span className="text-slate-400 text-sm">Progreso</span>
              }
              {terminado && (
                <span className="text-sm font-semibold text-green-400 animate-pop-in">
                  ¡Nivel completado!
                </span>
              )}
            </div>
            <span className="text-sm font-bold text-white">{completados}/{total} puzzles</span>
          </div>
          <div className="w-full h-3 bg-white/[0.05] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 xp-bar-fill ${terminado ? "animate-pulse-glow-green" : ""}`}
              style={{
                width: `${pct}%`,
                background: terminado
                  ? "linear-gradient(90deg, #22c55e, #16a34a)"
                  : `linear-gradient(90deg, var(--tw-gradient-stops))`,
                backgroundImage: terminado
                  ? undefined
                  : `linear-gradient(90deg, #6366f1, #a855f7)`,
              }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-slate-600">{pct}% completado</span>
            <span className="text-xs text-slate-600">
              {nivel.puzzles.filter(p => isPuzzleCompletado(p.id)).reduce((a, p) => a + p.xp, 0)} / {xpNivel} XP ganados
            </span>
          </div>
        </div>

        {/* ── Puzzle list ──────────────────────────────────────────── */}
        <div className="space-y-3">
          {nivel.puzzles.map((puzzle, idx) => {
            const completado = isPuzzleCompletado(puzzle.id);
            const desbloqueado = idx === 0 || isPuzzleCompletado(nivel.puzzles[idx - 1].id);

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
              <Link
                key={puzzle.id}
                href={desbloqueado ? `/puzzle/${nivelId}/${puzzle.id}` : "#"}
                className={!desbloqueado ? "cursor-not-allowed block" : "block group"}
                style={{ animationDelay: `${0.15 + idx * 0.05}s` }}
              >
                <div className={`relative rounded-2xl border transition-all duration-250 overflow-hidden animate-slide-up
                  ${completado
                    ? "border-green-500/30 bg-green-500/[0.04] hover:border-green-400/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.08)]"
                    : desbloqueado
                    ? "border-white/[0.07] bg-white/[0.02] hover:border-indigo-400/40 hover:bg-indigo-500/[0.03] hover:shadow-[0_0_20px_rgba(99,102,241,0.08)] hover:-translate-y-0.5"
                    : "border-white/[0.03] bg-white/[0.01] opacity-40"
                  }`}
                >
                  {/* Completed top line */}
                  {completado && (
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400" />
                  )}

                  <div className="flex items-center gap-4 p-4">
                    {/* Number / status circle */}
                    <div className="shrink-0">
                      {completado ? (
                        <div className="w-11 h-11 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-lg shadow-lg animate-pulse-glow-green">
                          ✓
                        </div>
                      ) : desbloqueado ? (
                        <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${nivel.color} flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform`}>
                          {idx + 1}
                        </div>
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-600">
                          🔒
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <h3 className="font-semibold text-white leading-tight">{puzzle.titulo}</h3>
                      </div>
                      <p className="text-slate-500 text-xs mt-0.5 line-clamp-1 leading-relaxed">
                        {puzzle.descripcion}
                      </p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tipoColor[puzzle.tipo] ?? "text-slate-400 bg-white/5 border-white/10"}`}>
                          {tipoLabel[puzzle.tipo] ?? puzzle.tipo}
                        </span>
                      </div>
                    </div>

                    {/* XP */}
                    <div className="shrink-0 text-right">
                      <div className={`text-sm font-bold ${completado ? "text-green-400" : "text-yellow-400"}`}>
                        {completado ? "✓" : "+"}{puzzle.xp} XP
                      </div>
                      {desbloqueado && !completado && (
                        <div className="text-xs text-slate-600 mt-0.5 group-hover:text-indigo-400 transition-colors">
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
      </main>
    </div>
  );
}
