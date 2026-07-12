import { Loader2 } from 'lucide-react'
import React from 'react'

const ProcessLoading = () => {
  return (
    <div className='min-h-40 w-full bg-background/40 backdrop-blur-lg flex items-center gap-3 rounded-md border p-2'>
        <div className="flex w-full items-center justify-center flex-col gap-3">
            <Loader2 className='sm:w-16 w-12 animate-spin text-white' />
            <span className='xl:text-lg sm:text-base text-sm'>Processing Your Files....</span>
        </div>
    </div>
  )
}

export default ProcessLoading