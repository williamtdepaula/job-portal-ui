import { useEffect, useId, useRef } from 'react';

const TYPE_STYLES = {
  info: {
    icon: 'ℹ️',
    iconBg: 'bg-primary-100 dark:bg-primary-900/30',
    iconColor: 'text-primary-600 dark:text-primary-400',
    confirmBtn: 'bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700'
  },
  warning: {
    icon: '⚠️',
    iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    confirmBtn: 'bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-800'
  },
  danger: {
    icon: '🗑️',
    iconBg: 'bg-red-100 dark:bg-red-900/30',
    iconColor: 'text-red-600 dark:text-red-400',
    confirmBtn: 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800'
  },
  success: {
    icon: '✓',
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400',
    confirmBtn: 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800'
  }
};

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info' // 'info', 'warning', 'danger', 'success'
}) => {
  const titleId = useId();
  const cancelButtonRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // Close modal on ESC key and lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEsc = (e) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    window.addEventListener('keydown', handleEsc);

    cancelButtonRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const styles = TYPE_STYLES[type] ?? TYPE_STYLES.info;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-8 transform transition-all animate-scale-in"
      >
        {/* Icon */}
        <div className={`mx-auto w-16 h-16 rounded-full ${styles.iconBg} flex items-center justify-center mb-6`}>
          <span className={`text-3xl ${styles.iconColor}`}>
            {styles.icon}
          </span>
        </div>

        {/* Title */}
        <h3 id={titleId} className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-4">
          {title}
        </h3>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            ref={cancelButtonRef}
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              try {
                onConfirm();
              } finally {
                onClose();
              }
            }}
            className={`flex-1 px-6 py-3 text-white rounded-xl font-semibold transition-colors ${styles.confirmBtn}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
