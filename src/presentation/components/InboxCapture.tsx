import { useRef, useState, type FormEvent } from "react";

interface Props {
  onAdd: (content: string) => void | Promise<void>;
}

/**
 * InboxCapture — campo único de captura rápida.
 *
 * Propositalmente mínimo: um input de linha única e um botão. Nada
 * aqui pergunta o que o pensamento significa — o objetivo é registrar
 * em segundos, não decidir nada no ato da captura.
 */
export function InboxCapture({ onAdd }: Props) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = async () => {
    const content = value.trim();
    if (!content) return;
    setValue("");
    await onAdd(content);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void submit();
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex items-center gap-2 border-b border-border bg-background px-4 py-3"
    >
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="O que está passando pela sua cabeça?"
        autoFocus
        className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
      <button
        type="submit"
        disabled={value.trim().length === 0}
        className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        Adicionar
      </button>
    </form>
  );
}
