import { useEffect, useRef, type PropsWithChildren } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

// Built on the browser's <dialog>, which gives us Escape-to-close, focus handling,
// and screen-reader support for free.
const Modal = ({ isOpen, onClose, title, children }: PropsWithChildren<ModalProps>) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  // Stop the page behind from scrolling while the pop-up is open.
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="modal-title"
      onClose={onClose}
      // Clicks on the dark backdrop land on the <dialog> itself; clicks inside land on its content.
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      className="m-auto w-full max-w-lg rounded-2xl bg-white p-0 text-vandyke shadow-lifted
                 backdrop:bg-vandyke/40 backdrop:backdrop-blur-sm"
    >
      <div className="relative p-6">
        <h2 id="modal-title" className="pr-10 text-lg font-semibold">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-full
                     text-vandyke/60 cursor-pointer transition-colors hover:bg-spinel/10 hover:text-spinel
                     focus-visible:outline-2 focus-visible:outline-spinel"
        >
          ✕
        </button>
        {children}
      </div>
    </dialog>
  );
};

export default Modal;
