import { useRef, useState, useEffect } from 'react'

export default function SignaturePad({ onSave, onClose }) {
  const canvasRef = useRef(null)
  const [drawing, setDrawing] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = '#1A3C5E'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
  }, [])

  function getPos(e) {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      }
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    }
  }

  function startDraw(e) {
    e.preventDefault()
    const ctx = canvasRef.current.getContext('2d')
    const pos = getPos(e)
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
    setDrawing(true)
  }

  function draw(e) {
    e.preventDefault()
    if (!drawing) return
    const ctx = canvasRef.current.getContext('2d')
    const pos = getPos(e)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
  }

  function stopDraw(e) {
    e.preventDefault()
    setDrawing(false)
  }

  function effacer() {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  function sauvegarder() {
    const data = canvasRef.current.toDataURL('image/png')
    onSave(data)
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: '1.5rem', width: '100%', maxWidth: 400 }}>
        <p style={{ color: '#1A3C5E', fontWeight: 700, fontSize: 16, margin: '0 0 12px' }}>Signature électronique</p>
        <p style={{ color: '#a0bcd8', fontSize: 12, margin: '0 0 12px' }}>Dessinez votre signature ci-dessous</p>

        <canvas
          ref={canvasRef}
          width={350}
          height={150}
          style={{ width: '100%', height: 150, border: '1px solid #dce8f5', borderRadius: 8, touchAction: 'none', cursor: 'crosshair' }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button
            onClick={effacer}
            style={{ flex: 1, background: '#F0F7FF', color: '#2E6DA4', border: '1px solid #dce8f5', borderRadius: 8, padding: '10px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            Effacer
          </button>
          <button
            onClick={onClose}
            style={{ flex: 1, background: '#F0F7FF', color: '#e53e3e', border: '1px solid #dce8f5', borderRadius: 8, padding: '10px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            Annuler
          </button>
          <button
            onClick={sauvegarder}
            style={{ flex: 1, background: '#2E6DA4', color: '#fff', border: 'none', borderRadius: 8, padding: '10px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  )
}