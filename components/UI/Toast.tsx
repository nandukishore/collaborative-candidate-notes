
import React, { useEffect } from 'react';
import { ToastMessage } from '../../types';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

const icons = {
  success: <CheckCircleIcon className="h-6 w-6 text-green-500" aria-hidden="true" />,
  error: <XCircleIcon className="h-6 w-6 text-red-500" aria-hidden="true" />,
  info: <InformationCircleIcon className="h-6 w-6 text-sky-500" aria-hidden="true" />,
  warning: <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" aria-hidden="true" />,
};

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  
  useEffect(() => {
    // This component itself doesn't manage timeout, parent ToastContainer does.
    // This is just in case for some reason parent fails.
    const timer = setTimeout(() => {
       // onDismiss(toast.id); // This might cause double dismiss if parent has timeout too
    }, 6000); // Slightly longer than TOAST_TIMEOUT
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);


  return (
    <div className={`
      max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden
      toast-enter-active
    `}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {icons[toast.type]}
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-slate-900">{toast.message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={() => onDismiss(toast.id)}
              className="bg-white rounded-md inline-flex text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
            >
              <span className="sr-only">Close</span>
              <XCircleIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
    