import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";

interface Props {
  onSend: (content: string) => void | Promise<void>;
  disabled?: boolean;
  focusToken?: unknown;
}

export function Composer({ onSend, disabled, focusToken }: Props) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [focusToken]);

  const submit = async () => {
    const content = value.trim();
    if (!content || disabled) return;
    setValue("");
    await onSend(content);
    // devolve foco ao textarea depois do envio
    requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const onFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    void submit();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void submit();
    }
  };

  return (
    <form
      onSubmit={onFormSubmit}
      className="border-t border-border bg-background px-4 py-3"
    >
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          rows={1}
          placeholder="Escreva para o Companion…"
          className="flex-1 resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="submit"
          disabled={disabled || value.trim().length === 0}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          Enviar
        </button>
      </div>
    </form>
  );
}
