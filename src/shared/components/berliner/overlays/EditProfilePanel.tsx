"use client";

import { type ChangeEvent, useRef, useState, useTransition } from "react";
import { updateMyProfileAction } from "@/actions/berliner";
import { useTheme } from "@/shared/design/ThemeProvider";
import { Mono } from "@/shared/design/primitives";
import { OverlayShell } from "./OverlayShell";

// EditProfilePanel
type EditProfilePanelProps = {
  onClose: () => void;
  initial: {
    first_name: string;
    last_name: string;
    email: string;
    avatar_url: string | null;
  };
  onSaved?: () => void;
};

export function EditProfilePanel({ onClose, initial, onSaved }: EditProfilePanelProps) {
  const { palette: p } = useTheme();
  const [first, setFirst] = useState(initial.first_name);
  const [last, setLast] = useState(initial.last_name);
  const [avatar, setAvatar] = useState<string | null>(initial.avatar_url);
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const onPick = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 1024 * 1024) {
      setMsg({ kind: "err", text: "Image trop lourde (max 1 Mo)." });
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result;
      if (typeof dataUrl === "string") setAvatar(dataUrl);
    };
    reader.readAsDataURL(f);
  };

  const initials = (first?.[0] ?? "") + (last?.[0] ?? "");

  const save = () => {
    setMsg(null);
    startTransition(async () => {
      const r = await updateMyProfileAction({
        first_name: first,
        last_name: last,
        avatar_url: avatar,
      });
      if (!r.ok) {
        setMsg({ kind: "err", text: r.error.message });
        return;
      }
      setMsg({ kind: "ok", text: "Profil mis à jour" });
      onSaved?.();
      window.setTimeout(onClose, 700);
    });
  };

  return (
    <OverlayShell
      p={p}
      kicker="PROFIL · ÉDITION"
      title={
        <>
          Modifier mon <span className="text-primary">profil</span>
        </>
      }
      onClose={onClose}
      footer={
        <div className="flex gap-2">
          <div
            onClick={onClose}
            className="cursor-pointer rounded-[9px] border border-border bg-chip px-[18px] py-[11px] font-mono text-[11px] font-semibold tracking-[0.5px] text-ink-2 dark:bg-surface-2"
          >
            ANNULER
          </div>
          <div
            onClick={isPending ? undefined : save}
            className="flex-1 rounded-[9px] py-[11px] text-center font-mono text-[11px] font-semibold tracking-[0.5px]"
            style={{
              background: isPending ? (p.dark ? p.surface2 : p.chip) : p.accent,
              color: isPending ? p.ink3 : p.dark ? "#0E0E10" : "#FFF",
              cursor: isPending ? "wait" : "pointer",
              border: `1px solid ${isPending ? p.border : p.accent}`,
            }}
          >
            {isPending ? "ENREGISTREMENT…" : "ENREGISTRER"}
          </div>
        </div>
      }
    >
      <div className="mb-4 flex items-center gap-3.5 rounded-[14px] border border-border bg-surface p-3.5">
        <div
          className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border-[1.5px] border-border font-mono text-[22px] font-semibold tracking-[-1px]"
          style={{
            background: avatar ? "#000" : p.accentSoft,
            backgroundImage: avatar ? `url(${avatar})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: p.accent,
          }}
        >
          {!avatar && (initials.toUpperCase() || "?")}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-0.5 text-[14px] font-medium">Photo</div>
          <Mono className="mb-2 block text-[10.5px] tracking-[0.4px] text-ink-3">
            JPG / PNG · max 1 Mo
          </Mono>
          <div className="flex gap-1.5">
            <div
              onClick={() => fileRef.current?.click()}
              className="cursor-pointer rounded-md border border-border bg-chip px-2.5 py-1.5 font-mono text-[10.5px] font-semibold tracking-[0.4px] text-ink-2 dark:bg-surface-2"
            >
              CHOISIR
            </div>
            {avatar && (
              <div
                onClick={() => setAvatar(null)}
                className="cursor-pointer rounded-md border border-border bg-transparent px-2.5 py-1.5 font-mono text-[10.5px] font-medium tracking-[0.4px] text-sem-bad"
              >
                RETIRER
              </div>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onPick}
            className="hidden"
          />
        </div>
      </div>

      <Field label="Prénom" value={first} onChange={setFirst} placeholder="Prénom" />
      <Field label="Nom" value={last} onChange={setLast} placeholder="Nom" />
      <Field
        label="Email contact"
        value={initial.email}
        onChange={() => {
          /* email change requires auth flow, locked here */
        }}
        type="email"
        placeholder="adresse@exemple.com"
        disabled
      />

      {msg && (
        <div
          className="mt-1 rounded-lg px-[11px] py-[9px] font-mono text-[11px] tracking-[0.3px]"
          style={{
            background: msg.kind === "err" ? p.sem.bad + "20" : p.sem.ok + "20",
            color: msg.kind === "err" ? p.sem.bad : p.sem.ok,
          }}
        >
          {msg.text}
        </div>
      )}
    </OverlayShell>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div className="mb-2.5">
      <Mono className="mb-1.5 block text-[9.5px] uppercase tracking-[0.5px] text-ink-3">
        {label}
      </Mono>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full rounded-[9px] border border-border bg-surface px-3 py-[11px] font-sans text-[14px] outline-none dark:bg-surface-2 ${
          disabled ? "text-ink-3 opacity-70" : "text-ink opacity-100"
        }`}
      />
    </div>
  );
}
