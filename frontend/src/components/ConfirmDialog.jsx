import { useEffect } from 'react';

export function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, confirmText = '확인', cancelText = '취소', confirmButtonStyle = {} }) {
  useEffect(() => {
    if (isOpen) {
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onCancel();
        }
      };
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        animation: 'fadeIn 0.2s ease-in',
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: '#363a4d',
          borderRadius: '12px',
          padding: '28px',
          maxWidth: '400px',
          width: '90%',
          border: '1px solid #545763',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          animation: 'fadeIn 0.3s ease-in 0.1s both',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ margin: '0 0 16px 0', fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
          {title}
        </h3>
        <p style={{ margin: '0 0 24px 0', color: '#9ca3af', fontSize: '0.9375rem', lineHeight: 1.6 }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: '1px solid #545763',
              background: 'transparent',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.9375rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#475569';
              e.currentTarget.style.backgroundColor = 'rgba(71, 85, 105, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#545763';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: confirmButtonStyle.background || '#475569',
              color: confirmButtonStyle.color || '#ffffff',
              fontWeight: 700,
              fontSize: '0.9375rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              ...confirmButtonStyle,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = confirmButtonStyle.background || '#546a7a';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = confirmButtonStyle.background || '#475569';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
