'use client';

import React, { useRef, useEffect, useState } from 'react';

type MaskEditorProps = {
  imageUrl: string;
  maskUrl: string;
  onSaveMask: (dataUrl: string) => void;
};

export default function MaskEditor({ imageUrl, maskUrl, onSaveMask }: MaskEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [brushSize, setBrushSize] = useState(20);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawMode, setDrawMode] = useState<'keep' | 'replace'>('keep'); // keep = black (0), replace = white (255)
  const [isLoading, setIsLoading] = useState(true);

  // Hidden off-screen canvas to maintain the actual mask image in black and white
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Ref to hold current draw mode to access it in event handlers
  const drawModeRef = useRef(drawMode);
  useEffect(() => {
    drawModeRef.current = drawMode;
  }, [drawMode]);

  // Ref to hold brush size to access it in event handlers
  const brushSizeRef = useRef(brushSize);
  useEffect(() => {
    brushSizeRef.current = brushSize;
  }, [brushSize]);

  // Refs for display rendering
  const renderRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);

    const baseImg = new Image();
    const maskImg = new Image();

    baseImg.crossOrigin = 'anonymous';
    maskImg.crossOrigin = 'anonymous';

    let baseLoaded = false;
    let maskLoaded = false;

    const initCanvas = () => {
      if (!baseLoaded || !maskLoaded || !active) return;

      const canvas = canvasRef.current;
      const maskCanvas = maskCanvasRef.current;
      if (!canvas || !maskCanvas) return;

      const ctx = canvas.getContext('2d');
      const maskCtx = maskCanvas.getContext('2d');
      if (!ctx || !maskCtx) return;

      const width = baseImg.naturalWidth;
      const height = baseImg.naturalHeight;

      canvas.width = width;
      canvas.height = height;
      maskCanvas.width = width;
      maskCanvas.height = height;

      // Draw initial mask to off-screen canvas
      maskCtx.drawImage(maskImg, 0, 0, width, height);

      // Render display
      renderDisplay();
      setIsLoading(false);
    };

    baseImg.onload = () => {
      baseLoaded = true;
      initCanvas();
    };

    maskImg.onload = () => {
      maskLoaded = true;
      initCanvas();
    };

    baseImg.src = imageUrl;
    maskImg.src = maskUrl;

    const renderDisplay = () => {
      const canvas = canvasRef.current;
      const maskCanvas = maskCanvasRef.current;
      if (!canvas || !maskCanvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { width, height } = canvas;

      // Clear display
      ctx.clearRect(0, 0, width, height);

      // 1. Draw base image
      ctx.drawImage(baseImg, 0, 0, width, height);

      // 2. Draw mask overlay
      const maskCtx = maskCanvas.getContext('2d');
      if (!maskCtx) return;

      const maskData = maskCtx.getImageData(0, 0, width, height);
      const displayData = ctx.getImageData(0, 0, width, height);

      // Loop through and overlay red transparency for "replaced" areas (white in mask)
      for (let i = 0; i < maskData.data.length; i += 4) {
        const r = maskData.data[i];
        if (r > 127) {
          displayData.data[i] = Math.min(255, displayData.data[i] * 0.4 + 180); // Red
          displayData.data[i + 1] = displayData.data[i + 1] * 0.4;             // Green
          displayData.data[i + 2] = displayData.data[i + 2] * 0.4;             // Blue
        }
      }

      ctx.putImageData(displayData, 0, 0);
    };

    renderRef.current = renderDisplay;

    return () => {
      active = false;
    };
  }, [imageUrl, maskUrl]);

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    draw(e);
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      exportMask();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;

    const maskCtx = maskCanvas.getContext('2d');
    if (!maskCtx) return;

    const coords = getCanvasCoords(e);

    maskCtx.beginPath();
    maskCtx.arc(coords.x, coords.y, brushSizeRef.current, 0, Math.PI * 2);
    
    if (drawModeRef.current === 'keep') {
      maskCtx.fillStyle = 'rgb(0, 0, 0)';
    } else {
      maskCtx.fillStyle = 'rgb(255, 255, 255)';
    }
    maskCtx.fill();

    if (renderRef.current) {
      renderRef.current();
    }
  };

  const exportMask = () => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;
    const dataUrl = maskCanvas.toDataURL('image/png');
    onSaveMask(dataUrl);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full bg-cream rounded-card p-6 border border-gold/20 shadow-soft">
      <div className="flex items-center justify-between w-full border-b border-gold/10 pb-4 mb-2">
        <h3 className="font-display text-lg text-maroon font-semibold">Mask Studio</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDrawMode('keep')}
            className={`px-3 py-1.5 rounded-pill text-xs font-body transition-all duration-300 border cursor-pointer ${
              drawMode === 'keep'
                ? 'bg-maroon text-ivory border-maroon shadow-sm'
                : 'bg-ivory text-ink border-gold/30 hover:border-gold'
            }`}
          >
            ✦ Keep Garment
          </button>
          <button
            onClick={() => setDrawMode('replace')}
            className={`px-3 py-1.5 rounded-pill text-xs font-body transition-all duration-300 border cursor-pointer ${
              drawMode === 'replace'
                ? 'bg-gold text-cream border-gold shadow-sm'
                : 'bg-ivory text-ink border-gold/30 hover:border-gold'
            }`}
          >
            ✉ Replace Area
          </button>
        </div>
      </div>

      <div className="relative border border-gold/35 rounded-tag overflow-hidden bg-ivory flex items-center justify-center max-h-[500px] w-full aspect-auto shadow-inner">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-ivory/80 z-10 gap-2">
            <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
            <p className="font-body text-xs text-muted animate-pulse">Preparing canvas...</p>
          </div>
        )}
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="max-h-[480px] object-contain max-w-full cursor-crosshair"
        />
      </div>

      {/* Hidden off-screen canvas for the actual mask */}
      <canvas ref={maskCanvasRef} className="hidden" />

      <div className="flex items-center justify-between w-full mt-2 gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="font-body text-xs text-muted w-28">Brush Size: {brushSize}px</span>
          <input
            type="range"
            min="5"
            max="100"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="accent-gold h-1 w-32 bg-gold/20 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <p className="font-body text-[10px] text-muted max-w-[320px] text-right italic leading-relaxed">
          Tip: Color in white ("Replace Area") over hangers, mannequins, or background shadows. Anything white will be re-drawn by the AI.
        </p>
      </div>
    </div>
  );
}
