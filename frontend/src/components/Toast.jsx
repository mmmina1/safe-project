import { useState, useEffect } from 'react';

const TOAST_DURATION = 3000;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    const newToast = { id, message, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, TOAST_DURATION);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const success = (message) => showToast(message, 'success');
  const error = (message) => showToast(message, 'error');
  const info = (message) => showToast(message, 'info');
  const warning = (message) => showToast(message, 'warning');

  return { toasts, success, error, info, warning, showToast, removeToast };
}

export function ToastContainer({ toasts, onRemove }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: '110px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          data-toast-id={toast.id}
          style={{
            background: toast.type === 'success' ? '#22c55e' : 
                       toast.type === 'error' ? '#ef4444' :
                       toast.type === 'warning' ? '#f59e0b' : '#3b82f6',
            color: '#ffffff',
            padding: '14px 20px',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            minWidth: '300px',
            maxWidth: '400px',
            fontSize: '0.9375rem',
            fontWeight: 600,
            animation: 'slideIn 0.3s ease-out',
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div style={{ flex: 1 }}>{toast.message}</div>
          <button
            onClick={() => {
              if (onRemove) {
                onRemove(toast.id);
              }
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              fontSize: '1.2rem',
              cursor: 'pointer',
              padding: '0',
              lineHeight: '1',
              opacity: 0.8,
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
