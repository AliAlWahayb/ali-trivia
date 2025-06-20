import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";

const ANIMATE_BASE = "animate-fade-down animate-once animate-duration-300 animate-ease-linear animate-alternate animate-fill-both";

export function customConfirm(
  message: string,
  confirmText = "OK",
  cancelText = "Cancel"
): Promise<boolean> {
  return new Promise((resolve) => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    const root = createRoot(div);

    const cleanup = () => {
      root.unmount();
      div.remove();
    };

    const Dialog = () => {
      useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
          if (e.key === "Escape") {
            resolve(false);
            cleanup();
          }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
      }, []);

      return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/25 bg-opacity-30">
          <div className={`flex flex-col bg-background-light rounded-lg p-6 w-fit text-center ${ANIMATE_BASE}`}>
            <div className=" text-lg text-start text-textPrimary mb-4">
              {message}
            </div>
            <div className="flex justify-end gap-4 ">
              <button
                className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/80 text-white font-medium"
                onClick={() => {
                  resolve(true);
                  cleanup();
                }}
              >
                {confirmText}
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-gray-800 font-medium"
                onClick={() => {
                  resolve(false);
                  cleanup();
                }}
                autoFocus
              >
                {cancelText}
              </button>
            </div>
          </div>
        </div>
      );
    };

    root.render(<Dialog />);
  });
}
