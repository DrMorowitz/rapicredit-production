'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { Camera, Upload, X, CheckCircle, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface CameraUploadProps {
  onImageCapture: (file: File, imageUrl: string, source: 'camera' | 'gallery') => void
  onRemoveImage?: () => void
  onError?: (error: string) => void
  accept?: string
  maxSize?: number // in MB
  label?: string
  required?: boolean
  helpText?: string
  side?: 'frontal' | 'trasera'
  currentImage?: string | null
}

export default function CameraUpload({
  onImageCapture,
  onRemoveImage,
  onError,
  accept = 'image/jpeg,image/png',
  maxSize = 5,
  label = 'Cédula',
  required = false,
  helpText,
  side = 'frontal',
  currentImage = null
}: CameraUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(currentImage)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setPreview(currentImage ?? null)
  }, [currentImage])

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `El archivo es demasiado grande. Máximo ${maxSize}MB permitido.`
    }

    // Check file type
    const acceptedTypes = accept.split(',').map(type => type.trim())
    if (!acceptedTypes.some(type => file.type.match(type.replace('*', '.*')))) {
      return 'Formato de archivo no válido. Solo JPG y PNG permitidos.'
    }

    return null
  }

  const processFile = useCallback(async (file: File, source: 'camera' | 'gallery') => {
    setIsUploading(true)
    setError(null)

    try {
      // Validate file
      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        onError?.(validationError)
        return
      }

      // Create preview
      const imageUrl = URL.createObjectURL(file)
      setPreview(imageUrl)

      // Compress image if needed (basic client-side compression)
      const compressedFile = await compressImage(file)
      
      // Call parent callback
      onImageCapture(compressedFile, imageUrl, source)

    } catch (err) {
      const errorMsg = 'Error al procesar la imagen. Inténtalo de nuevo.'
      setError(errorMsg)
      onError?.(errorMsg)
    } finally {
      setIsUploading(false)
    }
  }, [onImageCapture, onError, accept, maxSize])

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>, source: 'camera' | 'gallery') => {
    const file = event.target.files?.[0]
    if (file) {
      processFile(file, source)
    }
  }

  const handleCameraCapture = () => {
    cameraInputRef.current?.click()
  }

  const handleGallerySelect = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveImage = () => {
    setPreview(null)
    setError(null)
    // Reset file inputs
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
    onRemoveImage?.()
  }

  // Simple client-side image compression
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        // Calculate new dimensions (max 1200px width/height)
        const maxDimension = 1200
        let { width, height } = img
        
        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width
          width = maxDimension
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height
          height = maxDimension
        }

        canvas.width = width
        canvas.height = height

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height)
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            })
            resolve(compressedFile)
          } else {
            resolve(file) // Fallback to original file
          }
        }, 'image/jpeg', 0.8) // 80% quality
      }

      img.src = URL.createObjectURL(file)
    })
  }

  return (
    <div className="space-y-4">
      {/* Label */}
      <div className="flex items-center space-x-2">
        <label className="block text-sm font-semibold text-gray-900">
          {label} {side === 'trasera' ? '(Reverso)' : '(Frontal)'}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>

      {/* Upload Area */}
      <div className="relative">
        <AnimatePresence>
          {!preview ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-rapicredit-primary transition-colors"
            >
              <div className="space-y-4">
                <div className="flex justify-center space-x-4">
                  {/* Camera Button */}
                  <button
                    type="button"
                    onClick={handleCameraCapture}
                    disabled={isUploading}
                    className="flex flex-col items-center justify-center w-24 h-24 bg-rapicredit-primary text-white rounded-xl hover:bg-rapicredit-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Camera className="w-6 h-6 mb-2" />
                    <span className="text-xs font-medium">Cámara</span>
                  </button>

                  {/* Gallery Button */}
                  <button
                    type="button"
                    onClick={handleGallerySelect}
                    disabled={isUploading}
                    className="flex flex-col items-center justify-center w-24 h-24 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Upload className="w-6 h-6 mb-2" />
                    <span className="text-xs font-medium">Galería</span>
                  </button>
                </div>

                <div className="text-sm text-gray-600">
                  <p className="font-medium">Toma una foto o sube desde tu galería</p>
                  <p className="text-xs mt-1">
                    Formatos: JPG, PNG • Máximo: {maxSize}MB
                  </p>
                </div>

                {isUploading && (
                  <div className="flex items-center justify-center space-x-2 text-rapicredit-primary">
                    <div className="w-4 h-4 border-2 border-rapicredit-primary border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">Procesando imagen...</span>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative border-2 border-green-200 rounded-xl overflow-hidden"
            >
              <img
                src={preview}
                alt={`${label} ${side}`}
                className="w-full h-48 object-cover"
              />
              
              {/* Success Overlay */}
              <div className="absolute top-3 left-3 bg-green-500 text-white rounded-full p-1">
                <CheckCircle className="w-4 h-4" />
              </div>

              {/* Remove Button */}
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Image Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                <div className="flex items-center space-x-2 text-white text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>Imagen cargada exitosamente</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hidden File Inputs */}
        <input
          ref={cameraInputRef}
          type="file"
          accept={accept}
          capture="environment" // Rear camera for documents
          className="hidden"
          onChange={(e) => handleFileSelect(e, 'camera')}
        />
        
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => handleFileSelect(e, 'gallery')}
        />
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 rounded-lg p-3"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Text */}
      {helpText && !error && (
        <p className="text-sm text-gray-600">
          💡 <strong>Consejos:</strong> {helpText}
        </p>
      )}

      {/* Default Help Text */}
      {!helpText && !error && (
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Asegúrate que la imagen sea clara y legible</p>
          <p>• Evita reflejos y sombras</p>
          <p>• La cédula debe estar completamente visible</p>
        </div>
      )}
    </div>
  )
}