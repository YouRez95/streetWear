import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { getImageUrl } from '@renderer/utils'
import { Download, X } from 'lucide-react'
import { useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'

interface ImagePreviewProps {
  src: string | null | undefined
  fallback: string
  alt?: string
  className?: string
  stopPropagation?: boolean
}

export default function ImagePreview({
  src,
  fallback,
  alt,
  className,
  stopPropagation = true
}: ImagePreviewProps) {
  const [open, setOpen] = useState(false)

  const imageSrc = src ? getImageUrl(src, 'product') : fallback

  function handleClick(e: React.MouseEvent) {
    if (stopPropagation) e.stopPropagation()
    setOpen(true)
  }

  function downloadImage() {
    window.context.downloadImage(imageSrc)
  }

  return (
    <>
      {/* Thumbnail */}
      <LazyLoadImage
        src={imageSrc}
        alt={alt}
        effect="opacity"
        className={cn('cursor-pointer rounded-lg', className)}
        onClick={handleClick}
        onError={(e: any) => (e.target.src = fallback)}
      />
      {/* 

      {/* Full Screen Preview */}
      <Dialog open={open} onOpenChange={setOpen}>
        {/* <DialogContent className="p-0 max-w-full w-full h-full bg-black/90 flex items-center justify-center border-none"> */}
        <DialogContent className="p-0 max-w-full h-screen bg-black/90 flex items-center justify-center border-none">
          <DialogTitle className="sr-only">Image Preview</DialogTitle>
          <DialogDescription className="sr-only">
            Full screen image preview dialog
          </DialogDescription>
          {/* Close button */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 p-2 rounded-full"
          >
            <X className="text-white h-5 w-5" />
          </button>

          {/* Download button */}
          <button
            onClick={downloadImage}
            className="absolute top-4 left-4 bg-white/20 hover:bg-white/40 p-2 rounded-full"
          >
            <Download className="text-white h-5 w-5" />
          </button>

          {/* Fullscreen image */}
          <img src={imageSrc} alt={alt} className="h-full w-full object-contain select-none" />
        </DialogContent>
      </Dialog>
    </>
  )
}
