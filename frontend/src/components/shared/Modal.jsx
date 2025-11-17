import { useEffect } from 'react'

export default function Modal({ isOpen, onClose, children, title }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      <div className="backdrop open" onClick={onClose}></div>
      <div className="modal open">
        <div className="modal-header">
          {title && <h3>{title}</h3>}
          <button className="pill" onClick={onClose}>Close</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </>
  )
}
