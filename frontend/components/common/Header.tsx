import { Button } from '../ui/button'
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'

const Header = () => {
    return (
        <header className='header bg-stone-950 border-gray-700/50 border-b py-4'>
            <div className="container">
                <nav className="flex items-center justify-between gap-5">
                    <div className="logo">
                        <span>Image Converter</span>
                    </div>
                    <div className='button_grp flex items-center gap-2.5'>
                        <Show when="signed-out">
                            <SignInButton>
                                <Button size={'lg'}>Sign In</Button>
                            </SignInButton>
                            <SignUpButton>
                                <Button variant={'outline'} size={'lg'}>Sign Up</Button>
                            </SignUpButton>
                        </Show>
                        <Show when="signed-in">
                             <UserButton />
                        </Show>
                    </div>
                </nav>
            </div>
        </header>
    )
}

export default Header