import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  CircleDashed,
  CircleDot,
  ClipboardList,
  Users,
  Car,
  ScrollText,
  Paperclip,
  ChevronRight,
  ChevronLeft,
  Save,
  Printer,
  ShieldCheck,
  Hash,
  Calendar,
  Plus,
  Trash2,
  Upload,
  Moon,
  Sun,
  Mic,
  Square,
  FileSignature,
  Sparkles,
  UserCheck,
  FilePlus2,
  Search,
  Zap,
  FileEdit,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ocorrências Policiais | Polícia Civil do Distrito Federal" },
      {
        name: "description",
        content:
          "Preencha o registro de ocorrência policial em etapas: dados básicos, pessoas, objetos/veículos, histórico e anexos.",
      },
    ],
  }),
  component: Index,
});

type StepId = "basicos" | "pessoas" | "objetos" | "historico" | "anexos";
type Status = "pending" | "partial" | "complete";

type StepDef = {
  id: StepId;
  title: string;
  description: string;
  icon: typeof ClipboardList;
};

const STEPS: StepDef[] = [
  {
    id: "basicos",
    title: "Dados Básicos",
    description: "Natureza, data, hora e local da ocorrência",
    icon: ClipboardList,
  },
  {
    id: "pessoas",
    title: "Pessoas Envolvidas",
    description: "Vítimas, autores, testemunhas e comunicantes",
    icon: Users,
  },
  {
    id: "objetos",
    title: "Objetos / Veículos",
    description: "Bens, armas e veículos relacionados",
    icon: Car,
  },
  {
    id: "historico",
    title: "Histórico",
    description: "Narrativa detalhada dos fatos",
    icon: ScrollText,
  },
  {
    id: "anexos",
    title: "Anexos",
    description: "Documentos, fotos e laudos",
    icon: Paperclip,
  },
];

type Pessoa = {
  id: string;
  nome: string;
  tipo: string;
  documento: string;
};

type Objeto = {
  id: string;
  categoria: string;
  descricao: string;
  placa: string;
};

type Anexo = {
  id: string;
  nome: string;
  tipo: string;
};

type FormState = {
  basicos: {
    natureza: string;
    data: string;
    hora: string;
    endereco: string;
    bairro: string;
    municipio: string;
    uf: string;
  };
  pessoas: Pessoa[];
  objetos: Objeto[];
  historico: string;
  anexos: Anexo[];
};

const initialState: FormState = {
  basicos: {
    natureza: "",
    data: "",
    hora: "",
    endereco: "",
    bairro: "",
    municipio: "",
    uf: "",
  },
  pessoas: [],
  objetos: [],
  historico: "",
  anexos: [],
};

function stepProgress(id: StepId, data: FormState): number {
  if (id === "basicos") {
    const fields = Object.values(data.basicos);
    const filled = fields.filter((v) => v.trim().length > 0).length;
    return filled / fields.length;
  }
  if (id === "pessoas") {
    if (data.pessoas.length === 0) return 0;
    const total = data.pessoas.length * 3;
    const filled = data.pessoas.reduce(
      (acc, p) =>
        acc +
        [p.nome, p.tipo, p.documento].filter((v) => v.trim().length > 0).length,
      0,
    );
    return filled / total;
  }
  if (id === "objetos") {
    if (data.objetos.length === 0) return 0;
    const total = data.objetos.length * 2;
    const filled = data.objetos.reduce(
      (acc, o) =>
        acc + [o.categoria, o.descricao].filter((v) => v.trim().length > 0).length,
      0,
    );
    return filled / total;
  }
  if (id === "historico") {
    return data.historico.trim().length >= 30 ? 1 : data.historico.trim().length > 0 ? 0.5 : 0;
  }
  return data.anexos.length > 0 ? 1 : 0;
}

function statusFromProgress(p: number): Status {
  if (p === 0) return "pending";
  if (p >= 1) return "complete";
  return "partial";
}

const STATUS_LABEL: Record<Status, string> = {
  pending: "Pendente",
  partial: "Parcial",
  complete: "Completo",
};

function StatusBadge({ status }: { status: Status }) {
  const styles: Record<Status, string> = {
    pending: "bg-pending-soft text-muted-foreground",
    partial: "bg-partial-soft text-partial-foreground",
    complete: "bg-complete-soft text-complete",
  };
  const Icon = status === "complete" ? Check : status === "partial" ? CircleDot : CircleDashed;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        styles[status],
      )}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
      {STATUS_LABEL[status]}
    </span>
  );
}

const OCCURRENCE_INFO = {
  numero: "2026.0006148",
  protocolo: "PRT-2026-0099421",
  abertura: "22/06/2026 14:32",
};

type Participante = {
  id: string;
  nome: string;
  papel: string;
  em: string;
};

const PARTICIPANTES_INICIAIS: Participante[] = [
  { id: "p1", nome: "Inv. Carla Mendes", papel: "Atendente — abertura", em: "14:32" },
  { id: "p2", nome: "Esc. Rafael Lima", papel: "Edição — Dados básicos", em: "14:41" },
  { id: "p3", nome: "Inv. Carla Mendes", papel: "Edição — Histórico", em: "15:02" },
];

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function Index() {
  const [data, setData] = useState<FormState>(initialState);
  const [activeIdx, setActiveIdx] = useState(0);
  const [homologada, setHomologada] = useState(false);
  const [homologadoPor, setHomologadoPor] = useState<{ nome: string; em: string } | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [participantes] = useState<Participante[]>(PARTICIPANTES_INICIAIS);

  // Recording state
  type RecState = "idle" | "recording" | "recorded";
  const [recState, setRecState] = useState<RecState>("idle");
  const [recSeconds, setRecSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioProtocolado, setAudioProtocolado] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const progresses = useMemo(() => STEPS.map((s) => stepProgress(s.id, data)), [data]);
  const statuses = progresses.map(statusFromProgress);
  const completeCount = statuses.filter((s) => s === "complete").length;
  const overall = Math.round(
    (progresses.reduce((a, b) => a + b, 0) / STEPS.length) * 100,
  );

  const active = STEPS[activeIdx];
  const canHomologate = statuses.every((s) => s === "complete") && !homologada;

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = ["audio/webm", "audio/mp4"].find((t) => MediaRecorder.isTypeSupported(t));
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      chunksRef.current = [];
      rec.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data);
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: rec.mimeType });
        setAudioUrl(URL.createObjectURL(blob));
        setRecState("recorded");
      };
      recorderRef.current = rec;
      rec.start();
      setRecSeconds(0);
      setAudioProtocolado(false);
      setAudioUrl(null);
      setRecState("recording");
      tickRef.current = window.setInterval(() => setRecSeconds((s) => s + 1), 1000);
    } catch {
      // Fallback simulation when microphone is unavailable (e.g. iframe preview)
      setRecState("recording");
      setRecSeconds(0);
      setAudioProtocolado(false);
      setAudioUrl(null);
      tickRef.current = window.setInterval(() => setRecSeconds((s) => s + 1), 1000);
    }
  };

  const stopRecording = () => {
    if (tickRef.current) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }
    const rec = recorderRef.current;
    if (rec && rec.state !== "inactive") {
      rec.stop();
    } else {
      setRecState("recorded");
    }
  };

  const discardRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setAudioProtocolado(false);
    setRecState("idle");
    setRecSeconds(0);
  };

  const autoFillFromAudio = () => {
    setData((d) => ({
      ...d,
      basicos: {
        natureza: d.basicos.natureza || "furto",
        data: d.basicos.data || "2026-06-22",
        hora: d.basicos.hora || "13:50",
        endereco: d.basicos.endereco || "Av. Paulista, 1.500, próximo ao MASP",
        bairro: d.basicos.bairro || "Bela Vista",
        municipio: d.basicos.municipio || "São Paulo",
        uf: d.basicos.uf || "SP",
      },
      historico:
        d.historico ||
        "Transcrição automática do áudio: a vítima relatou que, por volta das 13h50, ao caminhar pela Av. Paulista, teve seu aparelho celular subtraído por indivíduo em motocicleta, que evadiu-se sentido Consolação. Não houve agressão física. Foram acionadas viaturas para diligências na região.",
    }));
  };

  const homologar = () => {
    setHomologada(true);
    setHomologadoPor({
      nome: "Del. Marcos Pereira",
      em: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    });
  };

  return (
    <div className="min-h-screen bg-background lg:flex">
      <AppSidebar />
      <div className="min-w-0 flex-1">
      {/* Top bar — preto, enxuto */}
      <header className="bg-header text-header-foreground">

        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-white/10 text-header-foreground">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-semibold leading-tight">
                Ocorrências Policiais
              </h1>
              <p className="text-xs text-header-muted">
                Polícia Civil do Distrito Federal
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              aria-label={theme === "dark" ? "Mudar para tema claro" : "Mudar para tema escuro"}
              className="grid h-9 w-9 place-items-center rounded-md bg-white/10 text-header-foreground transition-colors hover:bg-white/20"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>

        </div>
      </header>

      {/* Linha de ações */}
      <div className="border-b bg-card">
        <div className="mx-auto flex max-w-[1400px] items-center justify-end gap-2 px-6 py-2.5">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4" /> Imprimir
          </Button>
          <Button
            size="sm"
            disabled={!canHomologate}
            onClick={homologar}
            className={cn(homologada && "bg-complete hover:bg-complete/90")}
          >
            <ShieldCheck className="h-4 w-4" />
            {homologada ? "Ocorrência homologada" : "Homologar"}
          </Button>
        </div>
      </div>

      {/* Info bar enxuta */}
      <div className="border-b bg-muted/40">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-x-6 gap-y-3 px-6 py-4 sm:grid-cols-3">
          <InfoItem icon={Hash} label="Nº Ocorrência" value={OCCURRENCE_INFO.numero} />
          <InfoItem icon={ClipboardList} label="Protocolo" value={OCCURRENCE_INFO.protocolo} />
          <InfoItem icon={Calendar} label="Abertura" value={OCCURRENCE_INFO.abertura} />
        </div>
      </div>

      <main className="mx-auto grid max-w-[1400px] grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-[340px_minmax(0,1fr)]">
        {/* Sidebar steps */}
        <aside className="space-y-5 lg:sticky lg:top-8 lg:self-start">
          <div className="rounded-xl border bg-card p-5 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Progresso da ocorrência</h2>
              <span className="text-sm font-semibold text-primary">{overall}%</span>
            </div>
            <Progress value={overall} className="h-2" />

            <ol className="mt-6 space-y-1">
              {STEPS.map((step, i) => {
                const status = statuses[i];
                const isActive = i === activeIdx;
                const Icon = step.icon;
                return (
                  <li key={step.id}>
                    <button
                      type="button"
                      onClick={() => setActiveIdx(i)}
                      className={cn(
                        "group grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-transparent p-3 text-left transition-colors",
                        isActive ? "border-border bg-accent/40" : "hover:bg-accent/30",
                      )}
                    >
                      <span
                        className={cn(
                          "grid h-9 w-9 shrink-0 place-items-center rounded-lg ring-1",
                          status === "complete" &&
                            "bg-complete text-complete-foreground ring-complete/30",
                          status === "partial" &&
                            "bg-partial-soft text-partial-foreground ring-partial/40",
                          status === "pending" &&
                            "bg-pending-soft text-muted-foreground ring-border",
                        )}
                      >
                        {status === "complete" ? (
                          <Check className="h-4 w-4" strokeWidth={3} />
                        ) : (
                          <Icon className="h-4 w-4" />
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-center gap-2">
                          <span className="text-xs font-medium text-muted-foreground">
                            Etapa {i + 1}
                          </span>
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              status === "complete" && "bg-complete",
                              status === "partial" && "bg-partial",
                              status === "pending" && "bg-border",
                            )}
                          />
                        </span>
                        <span className="block truncate text-sm font-semibold">
                          {step.title}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {STATUS_LABEL[status]}
                        </span>
                      </span>
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                          isActive && "translate-x-0.5 text-foreground",
                        )}
                      />
                    </button>
                  </li>
                );
              })}
            </ol>

            <div className="mt-5 grid grid-cols-3 gap-2 border-t pt-4">
              <Legend dotClass="bg-border" label="Pendente" />
              <Legend dotClass="bg-partial" label="Parcial" />
              <Legend dotClass="bg-complete" label="Completo" />
            </div>

            <div
              className={cn(
                "mt-5 rounded-lg border p-3 text-xs",
                homologada
                  ? "border-complete/40 bg-complete-soft text-complete"
                  : "border-dashed text-muted-foreground",
              )}
            >
              <div className="flex items-center gap-2 font-medium">
                <ShieldCheck className="h-4 w-4" />
                {homologada ? "Ocorrência homologada" : "Aguardando homologação"}
              </div>
              <p className="mt-1 leading-relaxed">
                {homologada && homologadoPor
                  ? `Homologada por ${homologadoPor.nome} às ${homologadoPor.em}.`
                  : "Conclua todas as etapas para liberar a homologação."}
              </p>
            </div>
          </div>

          {/* Participantes */}
          <div className="rounded-xl border bg-card p-5 shadow-card">
            <div className="mb-3 flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold">Participantes do registro</h2>
            </div>
            <ul className="space-y-2.5">
              {participantes.map((p) => (
                <li key={p.id} className="flex items-start gap-3">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                    {p.nome
                      .split(" ")
                      .slice(-2)
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{p.nome}</p>
                    <p className="truncate text-xs text-muted-foreground">{p.papel}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{p.em}</span>
                </li>
              ))}
              {homologada && homologadoPor && (
                <li className="flex items-start gap-3 rounded-md border border-complete/30 bg-complete-soft/60 p-2">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-complete text-xs font-semibold text-complete-foreground">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{homologadoPor.nome}</p>
                    <p className="truncate text-xs text-complete">Homologação</p>
                  </div>
                  <span className="text-xs text-complete">{homologadoPor.em}</span>
                </li>
              )}
            </ul>
          </div>
        </aside>

        {/* Form panel */}
        <section className="space-y-6">
          {/* Painel de gravação de áudio */}
          <div className="rounded-xl border bg-card p-5 shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "grid h-11 w-11 place-items-center rounded-lg",
                    recState === "recording"
                      ? "bg-recording text-white animate-pulse"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  <Mic className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Gravação do atendimento</h3>
                  <p className="text-xs text-muted-foreground">
                    {recState === "idle" &&
                      "Grave o relato em áudio para protocolar e auto-preencher a ocorrência."}
                    {recState === "recording" && (
                      <>
                        Gravando…{" "}
                        <span className="font-mono font-semibold text-recording">
                          {formatTime(recSeconds)}
                        </span>
                      </>
                    )}
                    {recState === "recorded" &&
                      `Áudio capturado (${formatTime(recSeconds)}) — pronto para protocolar.`}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {recState === "idle" && (
                  <Button onClick={startRecording}>
                    <Mic className="h-4 w-4" /> Iniciar gravação
                  </Button>
                )}
                {recState === "recording" && (
                  <Button
                    onClick={stopRecording}
                    className="bg-recording text-white hover:bg-recording/90"
                  >
                    <Square className="h-4 w-4" /> Encerrar
                  </Button>
                )}
                {recState === "recorded" && (
                  <>
                    <Button variant="ghost" size="sm" onClick={discardRecording}>
                      <Trash2 className="h-4 w-4" /> Descartar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAudioProtocolado(true)}
                      disabled={audioProtocolado}
                    >
                      <FileSignature className="h-4 w-4" />
                      {audioProtocolado ? "Áudio protocolado" : "Protocolar áudio"}
                    </Button>
                    <Button size="sm" onClick={autoFillFromAudio}>
                      <Sparkles className="h-4 w-4" /> Auto-preencher ocorrência
                    </Button>
                  </>
                )}
              </div>
            </div>

            {audioUrl && (
              <audio src={audioUrl} controls className="mt-4 w-full" />
            )}
            {audioProtocolado && (
              <p className="mt-3 inline-flex items-center gap-2 rounded-md bg-complete-soft px-3 py-1.5 text-xs font-medium text-complete">
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
                Áudio anexado ao protocolo {OCCURRENCE_INFO.protocolo}
              </p>
            )}
          </div>

          <div className="rounded-xl border bg-card shadow-elevated">
            <div className="flex items-start justify-between gap-6 border-b p-6">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Etapa {activeIdx + 1} de {STEPS.length}
                </p>
                <h2 className="mt-1 text-2xl font-semibold">{active.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{active.description}</p>
              </div>
              <StatusBadge status={statuses[activeIdx]} />
            </div>

            <div className="p-6">
              <StepForm stepId={active.id} data={data} setData={setData} />
            </div>

            <div className="flex items-center justify-between gap-3 border-t bg-muted/30 px-6 py-4">
              <Button
                variant="ghost"
                onClick={() => setActiveIdx((i) => Math.max(0, i - 1))}
                disabled={activeIdx === 0}
              >
                <ChevronLeft className="h-4 w-4" /> Voltar
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="outline">
                  <Save className="h-4 w-4" /> Salvar
                </Button>
                {activeIdx < STEPS.length - 1 ? (
                  <Button onClick={() => setActiveIdx((i) => Math.min(STEPS.length - 1, i + 1))}>
                    Próxima etapa <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button disabled={!canHomologate} onClick={homologar}>
                    <ShieldCheck className="h-4 w-4" /> Homologar
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile strip */}
          <div className="flex items-center gap-1.5 lg:hidden">
            {STEPS.map((s, i) => (
              <div
                key={s.id}
                className={cn(
                  "h-1.5 flex-1 rounded-full",
                  statuses[i] === "complete" && "bg-complete",
                  statuses[i] === "partial" && "bg-partial",
                  statuses[i] === "pending" && "bg-border",
                  i === activeIdx && "ring-2 ring-ring/40",
                )}
              />
            ))}
          </div>
        </section>
      </main>
      </div>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Hash;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

function Legend({ dotClass, label }: { dotClass: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn("h-2 w-2 rounded-full", dotClass)} />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function StepForm({
  stepId,
  data,
  setData,
}: {
  stepId: StepId;
  data: FormState;
  setData: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  if (stepId === "basicos") {
    const set = (k: keyof FormState["basicos"], v: string) =>
      setData((d) => ({ ...d, basicos: { ...d.basicos, [k]: v } }));
    const b = data.basicos;
    return (
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <Field label="Natureza da ocorrência" className="md:col-span-3">
          <Select value={b.natureza} onValueChange={(v) => set("natureza", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a natureza" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="furto">Furto</SelectItem>
              <SelectItem value="roubo">Roubo</SelectItem>
              <SelectItem value="lesao">Lesão corporal</SelectItem>
              <SelectItem value="ameaca">Ameaça</SelectItem>
              <SelectItem value="transito">Acidente de trânsito</SelectItem>
              <SelectItem value="desaparecimento">Desaparecimento</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Data do fato">
          <Input type="date" value={b.data} onChange={(e) => set("data", e.target.value)} />
        </Field>
        <Field label="Hora do fato">
          <Input type="time" value={b.hora} onChange={(e) => set("hora", e.target.value)} />
        </Field>
        <Field label="UF">
          <Select value={b.uf} onValueChange={(v) => set("uf", v)}>
            <SelectTrigger>
              <SelectValue placeholder="UF" />
            </SelectTrigger>
            <SelectContent>
              {["SP", "RJ", "MG", "RS", "PR", "BA", "DF"].map((u) => (
                <SelectItem key={u} value={u}>
                  {u}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Endereço" className="md:col-span-2">
          <Input
            placeholder="Logradouro, número, complemento"
            value={b.endereco}
            onChange={(e) => set("endereco", e.target.value)}
          />
        </Field>
        <Field label="Bairro">
          <Input value={b.bairro} onChange={(e) => set("bairro", e.target.value)} />
        </Field>
        <Field label="Município" className="md:col-span-3">
          <Input value={b.municipio} onChange={(e) => set("municipio", e.target.value)} />
        </Field>
      </div>
    );
  }

  if (stepId === "pessoas") {
    const add = () =>
      setData((d) => ({
        ...d,
        pessoas: [
          ...d.pessoas,
          { id: crypto.randomUUID(), nome: "", tipo: "", documento: "" },
        ],
      }));
    const update = (id: string, k: keyof Pessoa, v: string) =>
      setData((d) => ({
        ...d,
        pessoas: d.pessoas.map((p) => (p.id === id ? { ...p, [k]: v } : p)),
      }));
    const remove = (id: string) =>
      setData((d) => ({ ...d, pessoas: d.pessoas.filter((p) => p.id !== id) }));

    return (
      <div className="space-y-4">
        {data.pessoas.length === 0 && (
          <EmptyState
            icon={Users}
            title="Nenhuma pessoa adicionada"
            description="Inclua vítimas, autores, testemunhas ou comunicantes envolvidos na ocorrência."
          />
        )}
        {data.pessoas.map((p, i) => (
          <div key={p.id} className="rounded-lg border bg-muted/20 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Pessoa {i + 1}
              </p>
              <Button variant="ghost" size="sm" onClick={() => remove(p.id)}>
                <Trash2 className="h-4 w-4" /> Remover
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Field label="Nome completo" className="md:col-span-2">
                <Input
                  value={p.nome}
                  onChange={(e) => update(p.id, "nome", e.target.value)}
                />
              </Field>
              <Field label="Tipo de envolvimento">
                <Select value={p.tipo} onValueChange={(v) => update(p.id, "tipo", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vitima">Vítima</SelectItem>
                    <SelectItem value="autor">Autor</SelectItem>
                    <SelectItem value="testemunha">Testemunha</SelectItem>
                    <SelectItem value="comunicante">Comunicante</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="CPF / RG" className="md:col-span-3">
                <Input
                  placeholder="000.000.000-00"
                  value={p.documento}
                  onChange={(e) => update(p.id, "documento", e.target.value)}
                />
              </Field>
            </div>
          </div>
        ))}
        <Button variant="outline" onClick={add} className="w-full">
          <Plus className="h-4 w-4" /> Adicionar pessoa
        </Button>
      </div>
    );
  }

  if (stepId === "objetos") {
    const add = () =>
      setData((d) => ({
        ...d,
        objetos: [
          ...d.objetos,
          { id: crypto.randomUUID(), categoria: "", descricao: "", placa: "" },
        ],
      }));
    const update = (id: string, k: keyof Objeto, v: string) =>
      setData((d) => ({
        ...d,
        objetos: d.objetos.map((o) => (o.id === id ? { ...o, [k]: v } : o)),
      }));
    const remove = (id: string) =>
      setData((d) => ({ ...d, objetos: d.objetos.filter((o) => o.id !== id) }));

    return (
      <div className="space-y-4">
        {data.objetos.length === 0 && (
          <EmptyState
            icon={Car}
            title="Nenhum objeto ou veículo"
            description="Cadastre bens subtraídos, recuperados, armas apreendidas ou veículos envolvidos."
          />
        )}
        {data.objetos.map((o, i) => (
          <div key={o.id} className="rounded-lg border bg-muted/20 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Item {i + 1}
              </p>
              <Button variant="ghost" size="sm" onClick={() => remove(o.id)}>
                <Trash2 className="h-4 w-4" /> Remover
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Field label="Categoria">
                <Select
                  value={o.categoria}
                  onValueChange={(v) => update(o.id, "categoria", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="veiculo">Veículo</SelectItem>
                    <SelectItem value="arma">Arma</SelectItem>
                    <SelectItem value="eletronico">Eletrônico</SelectItem>
                    <SelectItem value="documento">Documento</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Placa (se veículo)">
                <Input
                  placeholder="ABC-1D23"
                  value={o.placa}
                  onChange={(e) => update(o.id, "placa", e.target.value)}
                />
              </Field>
              <Field label="Descrição" className="md:col-span-3">
                <Textarea
                  rows={3}
                  placeholder="Marca, modelo, cor, características, número de série..."
                  value={o.descricao}
                  onChange={(e) => update(o.id, "descricao", e.target.value)}
                />
              </Field>
            </div>
          </div>
        ))}
        <Button variant="outline" onClick={add} className="w-full">
          <Plus className="h-4 w-4" /> Adicionar objeto / veículo
        </Button>
      </div>
    );
  }

  if (stepId === "historico") {
    return (
      <div className="space-y-3">
        <Field label="Narrativa dos fatos">
          <Textarea
            rows={14}
            placeholder="Descreva detalhadamente o ocorrido: dinâmica do fato, local, horário, ações dos envolvidos, providências adotadas..."
            value={data.historico}
            onChange={(e) => setData((d) => ({ ...d, historico: e.target.value }))}
          />
        </Field>
        <p className="text-xs text-muted-foreground">
          {data.historico.trim().length} caracteres — mínimo recomendado: 30
        </p>
      </div>
    );
  }

  // anexos
  const addAnexo = (tipo: string) =>
    setData((d) => ({
      ...d,
      anexos: [
        ...d.anexos,
        { id: crypto.randomUUID(), nome: `arquivo-${d.anexos.length + 1}.pdf`, tipo },
      ],
    }));
  const removeAnexo = (id: string) =>
    setData((d) => ({ ...d, anexos: d.anexos.filter((a) => a.id !== id) }));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { tipo: "Foto", label: "Foto / imagem" },
          { tipo: "Documento", label: "Documento" },
          { tipo: "Laudo", label: "Laudo / perícia" },
        ].map((c) => (
          <button
            key={c.tipo}
            type="button"
            onClick={() => addAnexo(c.tipo)}
            className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-center transition-colors hover:border-foreground/30 hover:bg-accent/30"
          >
            <div className="grid h-10 w-10 place-items-center rounded-full bg-muted text-muted-foreground">
              <Upload className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium">{c.label}</p>
            <p className="text-xs text-muted-foreground">Clique para anexar</p>
          </button>
        ))}
      </div>

      {data.anexos.length > 0 && (
        <div className="divide-y rounded-lg border">
          {data.anexos.map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-4 p-3">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-muted text-muted-foreground">
                  <Paperclip className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{a.nome}</p>
                  <p className="text-xs text-muted-foreground">{a.tipo}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeAnexo(a.id)}>
                <Trash2 className="h-4 w-4" /> Remover
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Users;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 text-center">
      <div className="grid h-10 w-10 place-items-center rounded-full bg-muted text-muted-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm font-medium">{title}</p>
      <p className="max-w-md text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

type MenuItem = { id: string; label: string; icon: LucideIcon };

const MENU_ITEMS: MenuItem[] = [
  { id: "registrar", label: "Registrar", icon: FilePlus2 },
  { id: "pesquisar", label: "Pesquisar", icon: Search },
  { id: "abrir-rapido", label: "Abrir Rápido", icon: Zap },
  { id: "aditamento", label: "Incluir Aditamento", icon: FileEdit },
  { id: "excluir", label: "Excluir", icon: XCircle },
];

const USER_INFO = {
  nome: "Inv. Carla Mendes",
  matricula: "Matrícula 24.815-7",
  unidade: "1ª DP — Centro",
};

function AppSidebar() {
  const [active, setActive] = useState<string>("registrar");
  return (
    <aside className="border-b bg-sidebar text-sidebar-foreground lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col">
        {/* Usuário logado */}
        <div className="border-b border-sidebar-border/60 px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sidebar-accent text-sm font-semibold text-sidebar-accent-foreground">
              {USER_INFO.nome
                .split(" ")
                .slice(-2)
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{USER_INFO.nome}</p>
              <p className="truncate text-xs text-sidebar-foreground/70">
                {USER_INFO.matricula}
              </p>
              <p className="truncate text-xs text-sidebar-foreground/70">
                {USER_INFO.unidade}
              </p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto p-3">
          <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/60">
            Ocorrências
          </p>
          <ul className="space-y-1">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setActive(item.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}

