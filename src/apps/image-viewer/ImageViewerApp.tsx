import React, { useState, useRef, useCallback, useEffect } from 'react'

interface ImageFile { path: string; dataUrl: string; name: string; size: number }

const api = () => (window as any).cryogram?.imageViewer

function fmtSize(n: number) {
  if (n < 1024) return `${n} B`
  if (n < 1048576) return `${(n/1024).toFixed(1)} KB`
  return `${(n/1048576).toFixed(1)} MB`
}

export default function ImageViewerApp() {
  const [image, setImage] = useState<ImageFile | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0, px: 0, py: 0 })
  const [fitMode, setFitMode] = useState<'fit'|'actual'>('fit')

  async function openFile() {
    const result = await api()?.open()
    if (result) { setImage(result); setZoom(1); setPan({ x: 0, y: 0 }) }
  }

  function onWheel(e: React.WheelEvent) {
    e.preventDefault()
    setZoom(z => Math.max(0.1, Math.min(10, z - e.deltaY * 0.001)))
  }

  function onMouseDown(e: React.MouseEvent) {
    setDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y }
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!dragging) return
    setPan({ x: dragStart.current.px + e.clientX - dragStart.current.x, y: dragStart.current.py + e.clientY - dragStart.current.y })
  }

  function onDragOver(e: React.DragEvent) { e.preventDefault() }
  async function onDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (!file) return
    const result = await api()?.readFile(file.path || (file as any).name)
    if (result) { setImage(result); setZoom(1); setPan({ x: 0, y: 0 }) }
  }

  return (
    <div className="h-full flex flex-col bg-gray-950 text-gray-100 font-mono select-none"
      onDragOver={onDragOver} onDrop={onDrop}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-800">
        <span className="text-lg">🖼️</span>
        <span className="font-bold text-emerald-400">Image Viewer</span>
        <button onClick={openFile} className="ml-2 text-xs px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded">Open</button>
        {image && (
          <>
            <span className="text-xs text-gray-400 ml-2 truncate max-w-xs">{image.name}</span>
            <span className="text-xs text-gray-600">{fmtSize(image.size)}</span>
            <div className="ml-auto flex items-center gap-2">
              <button onClick={() => setZoom(z => Math.max(0.1, z - 0.1))} className="text-sm px-2 py-0.5 bg-gray-800 hover:bg-gray-700 rounded">−</button>
              <span className="text-xs text-gray-400 w-12 text-center">{Math.round(zoom*100)}%</span>
              <button onClick={() => setZoom(z => Math.min(10, z + 0.1))} className="text-sm px-2 py-0.5 bg-gray-800 hover:bg-gray-700 rounded">+</button>
              <button onClick={() => { setZoom(1); setPan({x:0,y:0}) }} className="text-xs px-2 py-0.5 bg-gray-800 hover:bg-gray-700 rounded text-gray-400">1:1</button>
              <button onClick={() => { setZoom(1); setPan({x:0,y:0}); setFitMode('fit') }} className="text-xs px-2 py-0.5 bg-gray-800 hover:bg-gray-700 rounded text-gray-400">Fit</button>
            </div>
          </>
        )}
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-hidden relative bg-[#111] flex items-center justify-center"
        style={{ backgroundImage: 'repeating-conic-gradient(#1a1a1a 0% 25%, #0e0e0e 0% 50%)', backgroundSize: '20px 20px', cursor: dragging ? 'grabbing' : image ? 'grab' : 'default' }}
        onWheel={onWheel} onMouseDown={onMouseDown} onMouseMove={onMouseMove}
        onMouseUp={() => setDragging(false)} onMouseLeave={() => setDragging(false)}>
        {!image ? (
          <div className="text-center text-gray-600">
            <div className="text-5xl mb-4">🖼️</div>
            <p className="text-sm">Click Open or drag & drop an image</p>
            <p className="text-xs mt-1">PNG · JPG · GIF · WebP · SVG · BMP</p>
          </div>
        ) : (
          <div style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center',
            transition: dragging ? 'none' : 'transform 0.05s',
            cursor: dragging ? 'grabbing' : 'grab',
          }}>
            <img src={image.dataUrl} alt={image.name}
              style={{ maxWidth: fitMode === 'fit' ? '80vw' : 'none', maxHeight: fitMode === 'fit' ? '70vh' : 'none', display: 'block', imageRendering: zoom > 3 ? 'pixelated' : 'auto' }}
              draggable={false} />
          </div>
        )}
      </div>

      {/* Status bar */}
      {image && (
        <div className="flex items-center gap-4 px-4 py-1.5 border-t border-gray-800 text-xs text-gray-500">
          <span>{image.path}</span>
          <span className="ml-auto">Scroll to zoom · Drag to pan</span>
        </div>
      )}
    </div>
  )
}
