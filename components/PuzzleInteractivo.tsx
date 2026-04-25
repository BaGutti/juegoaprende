"use client";
import { useState } from "react";
import { Puzzle } from "@/lib/lecciones";

interface Props {
  puzzle: Puzzle;
  onCompletado: (xp: number) => void;
}

// ─── Shared feedback banner ───────────────────────────────────────────────────
function FeedbackBanner({
  correcto,
  explicacion,
  onReintentar,
}: {
  correcto: boolean;
  explicacion: string;
  onReintentar?: () => void;
}) {
  return (
    <div className={`mt-5 p-4 rounded-2xl border animate-pop-in ${
      correcto
        ? "bg-green-500/[0.07] border-green-500/30 text-green-300"
        : "bg-red-500/[0.07] border-red-500/30 text-red-300"
    }`}>
      <p className="font-bold mb-1 flex items-center gap-2 text-base">
        {correcto ? (
          <>
            <span className="text-xl animate-bounce-in">🎉</span>
            <span>¡Correcto!</span>
          </>
        ) : (
          <>
            <span className="text-xl">❌</span>
            <span>Incorrecto</span>
          </>
        )}
      </p>
      <p className="text-sm leading-relaxed opacity-90">{explicacion}</p>
      {!correcto && onReintentar && (
        <button
          onClick={onReintentar}
          className="mt-3 text-sm text-white/60 hover:text-white underline transition-colors"
        >
          Intentar de nuevo
        </button>
      )}
    </div>
  );
}

// ─── Hint button ──────────────────────────────────────────────────────────────
function HintButton({ pista }: { pista?: string }) {
  const [show, setShow] = useState(false);
  if (!pista) return null;
  return (
    <>
      <button
        onClick={() => setShow(!show)}
        className="px-4 py-3 rounded-xl border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 hover:border-yellow-400/50 transition-all duration-150 text-sm font-medium"
      >
        💡 Pista
      </button>
      {show && (
        <div className="absolute left-0 right-0 mt-2 p-3 bg-yellow-500/10 border border-yellow-500/25 rounded-xl text-yellow-300 text-sm animate-pop-in leading-relaxed z-10">
          💡 {pista}
        </div>
      )}
    </>
  );
}

// ─── Verify button ────────────────────────────────────────────────────────────
function VerifyButton({
  onClick,
  disabled,
  label = "Verificar",
}: {
  onClick: () => void;
  disabled: boolean;
  label?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="relative flex-1 py-3 rounded-xl font-semibold transition-all duration-200 overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:from-indigo-500 group-hover:to-purple-500 transition-all" />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-opacity" />
      <span className="relative">{label}</span>
    </button>
  );
}

// ─── Puzzle tipo: opcion-multiple ─────────────────────────────────────────────
function PuzzleOpcionMultiple({ puzzle, onCompletado }: Props) {
  const [seleccion, setSeleccion] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);
  const [mostrarPista, setMostrarPista] = useState(false);

  const verificar = () => {
    if (!seleccion) return;
    setEnviado(true);
    if (seleccion === puzzle.respuestaCorrecta) {
      setTimeout(() => onCompletado(puzzle.xp), 1200);
    }
  };

  const esCorrecta = seleccion === puzzle.respuestaCorrecta;

  return (
    <div>
      <div className="space-y-2.5 mb-5">
        {puzzle.opciones?.map((op, i) => {
          let estilo =
            "border-white/[0.07] bg-white/[0.02] hover:border-indigo-400/50 hover:bg-indigo-500/[0.06] cursor-pointer";
          let leftBar = "";

          if (seleccion === op) {
            if (!enviado) {
              estilo = "border-indigo-400/70 bg-indigo-500/[0.12] shadow-[0_0_15px_rgba(99,102,241,0.15)]";
              leftBar = "bg-indigo-400";
            } else if (op === puzzle.respuestaCorrecta) {
              estilo = "border-green-400/60 bg-green-500/[0.08] shadow-[0_0_15px_rgba(34,197,94,0.12)]";
              leftBar = "bg-green-400";
            } else {
              estilo = "border-red-400/60 bg-red-500/[0.08] animate-shake";
              leftBar = "bg-red-400";
            }
          } else if (enviado && op === puzzle.respuestaCorrecta) {
            estilo = "border-green-400/40 bg-green-500/[0.05]";
            leftBar = "bg-green-400/50";
          }

          const letra = String.fromCharCode(65 + i);

          return (
            <button
              key={op}
              disabled={enviado}
              onClick={() => setSeleccion(op)}
              className={`w-full text-left rounded-xl border transition-all duration-150 font-mono text-sm overflow-hidden flex items-stretch disabled:cursor-default ${estilo}`}
            >
              {/* Left accent bar */}
              <div className={`w-1 shrink-0 rounded-l-xl transition-all ${leftBar || "bg-transparent"}`} />
              <div className="flex items-center gap-3 px-4 py-3 flex-1">
                <span className={`text-xs font-bold w-5 h-5 rounded flex items-center justify-center shrink-0 transition-colors
                  ${seleccion === op && !enviado ? "bg-indigo-500 text-white" : "bg-white/[0.06] text-slate-500"}`}>
                  {letra}
                </span>
                <code className="text-slate-200 text-sm">{op}</code>
              </div>
            </button>
          );
        })}
      </div>

      {!enviado && (
        <div className="relative flex items-center gap-3">
          <VerifyButton onClick={verificar} disabled={!seleccion} />
          <HintButton pista={puzzle.pista} />
        </div>
      )}

      {enviado && (
        <FeedbackBanner correcto={esCorrecta} explicacion={puzzle.explicacion} />
      )}
    </div>
  );
}

// ─── Puzzle tipo: completar ───────────────────────────────────────────────────
function PuzzleCompletar({ puzzle, onCompletado }: Props) {
  const [respuesta, setRespuesta] = useState("");
  const [enviado, setEnviado] = useState(false);

  const respuestasValidas = Array.isArray(puzzle.respuestaCorrecta)
    ? puzzle.respuestaCorrecta
    : [puzzle.respuestaCorrecta ?? ""];

  const esCorrecta = respuestasValidas.some(
    (r) => r.toLowerCase().trim() === respuesta.toLowerCase().trim()
  );

  const verificar = () => {
    setEnviado(true);
    if (esCorrecta) setTimeout(() => onCompletado(puzzle.xp), 1400);
  };

  const placeholder = puzzle.codigoBase?.match(/\[([A-Z]+)\]/)?.[0] ?? "[HUECO]";
  const parts = puzzle.codigoBase?.split(placeholder) ?? ["", ""];

  return (
    <div>
      {/* Code editor mockup */}
      <div className="rounded-2xl overflow-hidden border border-white/[0.08] mb-5 shadow-2xl">
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06]"
          style={{ background: "#0d1117" }}>
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-400 transition-colors cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-400 transition-colors cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-400 transition-colors cursor-pointer" />
          </div>
          <span className="text-slate-600 text-xs ml-2 flex-1">sketch.ino</span>
          <span className="text-slate-700 text-xs">Arduino</span>
        </div>
        {/* Code area */}
        <div style={{ background: "#0a0e17" }} className="p-5">
          <pre className="font-mono text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">
            {parts[0]}
            <span className="inline-block align-middle">
              <input
                type="text"
                value={respuesta}
                onChange={(e) => !enviado && setRespuesta(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !enviado && verificar()}
                disabled={enviado}
                placeholder="???"
                className={`inline-block w-28 px-2 py-0.5 rounded-lg border text-center font-mono text-sm bg-white/[0.04] outline-none transition-all duration-150
                  ${enviado
                    ? esCorrecta
                      ? "border-green-400 text-green-300 bg-green-500/10"
                      : "border-red-400 text-red-300 bg-red-500/10"
                    : "border-indigo-400/60 text-indigo-300 focus:border-indigo-300 focus:bg-indigo-500/10 focus:shadow-[0_0_10px_rgba(99,102,241,0.2)]"
                  }`}
              />
            </span>
            {parts[1]}
          </pre>
        </div>
      </div>

      {!enviado && (
        <div className="relative flex items-center gap-3">
          <VerifyButton onClick={verificar} disabled={!respuesta.trim()} />
          <HintButton pista={puzzle.pista} />
        </div>
      )}

      {enviado && (
        <FeedbackBanner
          correcto={esCorrecta}
          explicacion={puzzle.explicacion}
          onReintentar={!esCorrecta ? () => { setEnviado(false); setRespuesta(""); } : undefined}
        />
      )}
    </div>
  );
}

// ─── Puzzle tipo: ordenar ─────────────────────────────────────────────────────
function PuzzleOrdenar({ puzzle, onCompletado }: Props) {
  const [orden, setOrden] = useState<number[]>(
    puzzle.bloques?.map((_, i) => i).sort(() => Math.random() - 0.5) ?? []
  );
  const [enviado, setEnviado] = useState(false);
  const [arrastrandoIdx, setArrastrandoIdx] = useState<number | null>(null);
  const [sobreIdx, setSobreIdx] = useState<number | null>(null);

  const mover = (de: number, a: number) => {
    const nuevo = [...orden];
    const [item] = nuevo.splice(de, 1);
    nuevo.splice(a, 0, item);
    setOrden(nuevo);
  };

  const ordenContenido = (ord: number[]) =>
    ord.map((i) => puzzle.bloques?.[i] ?? "");

  const verificar = () => {
    setEnviado(true);
    const contenidoCorrecto = ordenContenido(puzzle.ordenCorrecto ?? []);
    if (JSON.stringify(ordenContenido(orden)) === JSON.stringify(contenidoCorrecto)) {
      setTimeout(() => onCompletado(puzzle.xp), 1400);
    }
  };

  const esCorrecta =
    JSON.stringify(ordenContenido(orden)) ===
    JSON.stringify(ordenContenido(puzzle.ordenCorrecto ?? []));

  return (
    <div>
      <p className="text-slate-500 text-xs mb-4 flex items-center gap-2">
        <span>⠿</span> Arrastra los bloques para ordenarlos correctamente
      </p>
      <div className="space-y-2 mb-5">
        {orden.map((bloqueIdx, posicion) => (
          <div
            key={bloqueIdx}
            draggable={!enviado}
            onDragStart={() => setArrastrandoIdx(posicion)}
            onDragOver={(e) => { e.preventDefault(); setSobreIdx(posicion); }}
            onDragLeave={() => setSobreIdx(null)}
            onDrop={() => {
              if (arrastrandoIdx !== null && arrastrandoIdx !== posicion) {
                mover(arrastrandoIdx, posicion);
              }
              setArrastrandoIdx(null);
              setSobreIdx(null);
            }}
            className={`flex items-center gap-3 rounded-xl border font-mono text-sm transition-all duration-150 select-none overflow-hidden
              ${enviado
                ? esCorrecta
                  ? "border-green-400/40 bg-green-500/[0.06]"
                  : "border-red-400/40 bg-red-500/[0.06]"
                : sobreIdx === posicion && arrastrandoIdx !== posicion
                  ? "border-indigo-400 bg-indigo-500/15 scale-[1.01] shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                  : arrastrandoIdx === posicion
                    ? "border-white/20 bg-white/5 opacity-50 scale-95"
                    : "border-white/[0.07] bg-white/[0.02] hover:border-indigo-400/40 hover:bg-indigo-500/[0.04] cursor-grab active:cursor-grabbing"
              }`}
          >
            {/* Drag handle */}
            {!enviado && (
              <div className="w-8 h-full flex items-center justify-center text-slate-600 hover:text-slate-400 shrink-0 py-3 border-r border-white/[0.05]">
                ⠿
              </div>
            )}
            {/* Line number */}
            <span className="text-slate-700 text-xs w-5 shrink-0 text-right select-none">
              {posicion + 1}
            </span>
            <code className="text-slate-200 py-3 pr-4 flex-1">{puzzle.bloques?.[bloqueIdx]}</code>
          </div>
        ))}
      </div>

      {!enviado && (
        <VerifyButton onClick={verificar} disabled={false} label="Verificar orden" />
      )}

      {enviado && (
        <FeedbackBanner
          correcto={esCorrecta}
          explicacion={puzzle.explicacion}
          onReintentar={!esCorrecta ? () => {
            setEnviado(false);
            setOrden(puzzle.bloques?.map((_, i) => i).sort(() => Math.random() - 0.5) ?? []);
          } : undefined}
        />
      )}
    </div>
  );
}

// ─── Puzzle tipo: verdadero-falso ────────────────────────────────────────────
function PuzzleVerdaderoFalso({ puzzle, onCompletado }: Props) {
  const [seleccion, setSeleccion] = useState<boolean | null>(null);
  const [enviado, setEnviado] = useState(false);

  const verificar = (valor: boolean) => {
    setSeleccion(valor);
    setEnviado(true);
    if (valor === puzzle.esVerdadero) {
      setTimeout(() => onCompletado(puzzle.xp), 1200);
    }
  };

  const esCorrecta = seleccion === puzzle.esVerdadero;

  return (
    <div>
      {/* Statement card */}
      <div className="rounded-2xl border border-white/[0.08] overflow-hidden mb-6 shadow-xl">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06]"
          style={{ background: "#0d1117" }}>
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-slate-600 text-xs ml-2">afirmacion.ino</span>
        </div>
        <div style={{ background: "#0a0e17" }} className="p-5">
          <pre className="font-mono text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
            {puzzle.afirmacion}
          </pre>
        </div>
      </div>

      {!enviado ? (
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => verificar(true)}
            className="group relative py-5 rounded-2xl border border-green-500/20 bg-green-500/[0.05] hover:bg-green-500/10 hover:border-green-400/50 hover:shadow-[0_0_25px_rgba(34,197,94,0.15)] transition-all duration-200 hover:scale-[1.02] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-green-500/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="text-3xl mb-1">✅</div>
              <div className="font-bold text-green-300 text-lg">Verdadero</div>
            </div>
          </button>
          <button
            onClick={() => verificar(false)}
            className="group relative py-5 rounded-2xl border border-red-500/20 bg-red-500/[0.05] hover:bg-red-500/10 hover:border-red-400/50 hover:shadow-[0_0_25px_rgba(239,68,68,0.15)] transition-all duration-200 hover:scale-[1.02] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-red-500/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="text-3xl mb-1">❌</div>
              <div className="font-bold text-red-300 text-lg">Falso</div>
            </div>
          </button>
        </div>
      ) : (
        <div className={`p-5 rounded-2xl border animate-pop-in text-center
          ${esCorrecta
            ? "bg-green-500/[0.07] border-green-500/30"
            : "bg-red-500/[0.07] border-red-500/30"}`}>
          <div className="text-4xl mb-2 animate-bounce-in">
            {esCorrecta ? "🎉" : "💭"}
          </div>
          <p className="font-bold text-lg mb-1">
            {esCorrecta
              ? <span className="text-green-300">¡Correcto!</span>
              : <span className="text-red-300">Era {puzzle.esVerdadero ? "Verdadero" : "Falso"}</span>}
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">{puzzle.explicacion}</p>
        </div>
      )}
    </div>
  );
}

// ─── Puzzle tipo: emparejar ───────────────────────────────────────────────────
function PuzzleEmparejar({ puzzle, onCompletado }: Props) {
  const pares = puzzle.pares ?? [];
  const [ordenDerecha] = useState<number[]>(
    () => pares.map((_, i) => i).sort(() => Math.random() - 0.5)
  );
  const [conexiones, setConexiones] = useState<Record<number, number | null>>(
    () => Object.fromEntries(pares.map((_, i) => [i, null]))
  );
  const [selIzq, setSelIzq] = useState<number | null>(null);
  const [enviado, setEnviado] = useState(false);

  const handleIzq = (i: number) => {
    if (enviado) return;
    setSelIzq(i === selIzq ? null : i);
  };

  const handleDer = (derIdx: number) => {
    if (enviado || selIzq === null) return;
    const nuevo = { ...conexiones };
    for (const key in nuevo) {
      if (nuevo[key] === derIdx) nuevo[key] = null;
    }
    nuevo[selIzq] = derIdx;
    setConexiones(nuevo);
    setSelIzq(null);
  };

  const todasConectadas = pares.every((_, i) => conexiones[i] !== null);
  const verificar = () => {
    setEnviado(true);
    if (pares.every((_, i) => conexiones[i] === i)) {
      setTimeout(() => onCompletado(puzzle.xp), 1400);
    }
  };
  const esCorrecta = pares.every((_, i) => conexiones[i] === i);

  const resetear = () => {
    setEnviado(false);
    setConexiones(Object.fromEntries(pares.map((_, i) => [i, null])));
    setSelIzq(null);
  };

  return (
    <div>
      <p className="text-slate-500 text-xs mb-4 flex items-center gap-1.5">
        <span>👆</span>
        Selecciona un elemento izquierdo, luego su pareja derecha
      </p>

      <div className="grid grid-cols-2 gap-3 mb-5">
        {/* Left column */}
        <div className="space-y-2">
          <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-wider mb-2">Concepto</p>
          {pares.map((par, i) => {
            const conectado = conexiones[i] !== null;
            let cls = "border-white/[0.07] bg-white/[0.02] hover:border-indigo-400/40 cursor-pointer";
            if (selIzq === i) cls = "border-indigo-400 bg-indigo-500/15 shadow-[0_0_12px_rgba(99,102,241,0.2)] cursor-pointer";
            else if (conectado && !enviado) cls = "border-indigo-400/40 bg-indigo-500/[0.06] cursor-pointer";
            else if (enviado) {
              cls = conexiones[i] === i
                ? "border-green-400/50 bg-green-500/[0.07]"
                : "border-red-400/50 bg-red-500/[0.07]";
            }

            return (
              <button key={i} disabled={enviado} onClick={() => handleIzq(i)}
                className={`w-full text-left px-3 py-2.5 rounded-xl border text-xs font-mono transition-all duration-150 ${cls} disabled:cursor-default`}>
                <div className="flex items-center gap-2">
                  {conectado && !enviado && <span className="text-indigo-400 text-[10px] shrink-0">●</span>}
                  {enviado && <span className="text-[10px] shrink-0">{conexiones[i] === i ? "✓" : "✗"}</span>}
                  <span className="text-slate-200">{par.izquierda}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right column (shuffled) */}
        <div className="space-y-2">
          <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-wider mb-2">Definición</p>
          {ordenDerecha.map((derIdx) => {
            const izqEntry = Object.entries(conexiones).find(([, v]) => v === derIdx);
            const estaConectado = !!izqEntry;
            const esActivo = selIzq !== null && !enviado;

            let cls = "border-white/[0.07] bg-white/[0.02] text-slate-400";
            if (esActivo) cls = "border-indigo-400/30 hover:border-indigo-400 hover:bg-indigo-500/[0.08] cursor-pointer text-slate-300";
            if (estaConectado && !enviado) cls = "border-indigo-400/40 bg-indigo-500/[0.06] text-indigo-200";
            if (enviado && izqEntry) {
              const izqIdx = parseInt(izqEntry[0]);
              cls = conexiones[izqIdx] === izqIdx
                ? "border-green-400/50 bg-green-500/[0.07] text-green-200"
                : "border-red-400/50 bg-red-500/[0.07] text-red-200";
            }

            return (
              <button key={derIdx}
                disabled={enviado || selIzq === null}
                onClick={() => handleDer(derIdx)}
                className={`w-full text-left px-3 py-2.5 rounded-xl border text-xs font-mono transition-all duration-150 ${cls} disabled:cursor-default`}>
                {pares[derIdx].derecha}
              </button>
            );
          })}
        </div>
      </div>

      {!enviado && (
        <VerifyButton
          onClick={verificar}
          disabled={!todasConectadas}
          label="Verificar emparejamiento"
        />
      )}

      {enviado && (
        <FeedbackBanner
          correcto={esCorrecta}
          explicacion={puzzle.explicacion}
          onReintentar={!esCorrecta ? resetear : undefined}
        />
      )}
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function PuzzleInteractivo({ puzzle, onCompletado }: Props) {
  if (puzzle.tipo === "opcion-multiple")
    return <PuzzleOpcionMultiple puzzle={puzzle} onCompletado={onCompletado} />;
  if (puzzle.tipo === "completar")
    return <PuzzleCompletar puzzle={puzzle} onCompletado={onCompletado} />;
  if (puzzle.tipo === "ordenar")
    return <PuzzleOrdenar puzzle={puzzle} onCompletado={onCompletado} />;
  if (puzzle.tipo === "verdadero-falso")
    return <PuzzleVerdaderoFalso puzzle={puzzle} onCompletado={onCompletado} />;
  if (puzzle.tipo === "emparejar")
    return <PuzzleEmparejar puzzle={puzzle} onCompletado={onCompletado} />;
  return null;
}
