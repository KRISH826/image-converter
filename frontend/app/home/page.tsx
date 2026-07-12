import HomePageTab from '@/components/component/HomePageTab'
import React from 'react'

const HomePage = () => {
    return (
        <div className='Home min-h-full'>
            <div className="container">
                <div className="home_section w-full">
                    <h1 className='2xl:text-4xl xl:text-3xl sm:text-2xl text-xl font-medium flex items-center justify-center text-center'>PNG OR JPEG TO WEBP CONVERTER</h1>
                    <HomePageTab />
                </div>
            </div>
        </div>
    )
}

export default HomePage