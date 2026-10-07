"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

interface DialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialog() {
  const context = useContext(DialogContext);
  if (!context)
    throw new Error("Dialog components must be used inside Dialog.");
  return context;
}

export function Dialog({
  open,
  onOpenChange,
  children,
}: DialogContextValue & { children: ReactNode }) {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogContent({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const { open, onOpenChange } = useDialog();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="transfer-dialog-title"
      onClose={() => onOpenChange(false)}
      className={`m-auto w-[calc(100%-2rem)] max-w-lg rounded-lg border border-slate-200 bg-white p-0 text-slate-900 shadow-xl backdrop:bg-black/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 ${className}`}
    >
      <div className="p-6">{children}</div>
    </dialog>
  );
}

export function DialogHeader({ children }: { children: ReactNode }) {
  return <div className="space-y-1.5">{children}</div>;
}

export function DialogTitle({ children }: { children: ReactNode }) {
  return (
    <h2 id="transfer-dialog-title" className="text-lg font-semibold">
      {children}
    </h2>
  );
}

export function DialogDescription({ children }: { children: ReactNode }) {
  return (
    <p className="text-sm text-slate-500 dark:text-slate-400">{children}</p>
  );
}
