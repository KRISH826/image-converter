import UploadFile from '@/components/component/UploadFile'
import React from 'react'

const HomePage = () => {
  return (
    <div className='Home min-h-full'>
        <div className="container">
            <div className="home_section w-full">
                <h1 className='2xl:text-4xl xl:text-3xl sm:text-2xl text-xl font-medium flex items-center justify-center text-center'>PNG OR JPEG TO WEBP CONVERTER</h1>
                <div className="upload flex items-baseline justify-center gap-5 mt-10 max-w-3xl p-5 mx-auto">
                    <UploadFile />
                </div>
            </div>
        </div>
    </div>
  )
}

export default HomePage