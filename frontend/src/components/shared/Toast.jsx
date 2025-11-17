import { useToast } from '../../hooks/useToast'
import '../../styles/toast.css'

export default function Toast() {
  const { toasts } = useToast()

  return (
    <div className="toasts">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast ${toast.type}`}>
          <div style={{ fontSize: '18px' }}>
            {toast.type === 'success' ? '✓' : 'ℹ️'}
          </div>
          <div>{toast.message}</div>
        </div>
      ))}
    </div>
  )
}
