import React from 'react'
import { Button } from '../ui/button'

const Header = () => {
    return (
        <header className='header bg-stone-950 border-gray-700/50 border-b py-4'>
            <div className="container">
                <nav className="flex items-center justify-between gap-5">
                    <div className="logo">
                        <span>Image Converter</span>
                    </div>
                    <div className='button_grp flex items-center gap-2.5'>
                        <Button size={'lg'}>Sign In</Button>
                        <Button variant={'outline'} size={'lg'}>Sign Up</Button>
                    </div>
                </nav>
            </div>
        </header>
    )
}

export default Header