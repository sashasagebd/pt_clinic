import type { ReactNode } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void; //functon that returns nothing
    children: ReactNode; //contents are a react node (component, etc)
}
export default function Modal({ isOpen, onClose, children } : ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="w-[50vw] max-h-[90vh] bg-gray-700 rounded-lg shadow-lg w-96 p-6 relative overflow-y-auto">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}