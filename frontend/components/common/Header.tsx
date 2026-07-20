"use client"
import { useUser, useClerk, UserProfile } from '@clerk/nextjs'
import SignUpComponent from './SignUp'
import SignInComponent from './SignIn'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'

const Header = () => {
    const { user } = useUser();
    const { signOut } = useClerk();

    return (
        <header className='header bg-stone-950 border-gray-700/50 border-b py-4'>
            <div className="container">
                <nav className="flex items-center justify-between gap-5">
                    <div className="logo">
                        <span>Image Converter</span>
                    </div>
                    <div className='button_grp flex items-center gap-2.5'>
                        {user ? (
                            <Dialog>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="outline-none">
                                        <Avatar>
                                            <AvatarImage src={user.imageUrl} />
                                            <AvatarFallback className="uppercase bg-primary text-primary-foreground">
                                                {user.firstName?.charAt(0) || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-40">
                                        <DialogTrigger asChild>
                                            <DropdownMenuItem className="cursor-pointer">
                                                Profile
                                            </DropdownMenuItem>
                                        </DialogTrigger>
                                        <DropdownMenuItem className="cursor-pointer" onClick={() => signOut({ redirectUrl: '/' })}>
                                            Sign Out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <DialogContent className='border-none p-0 bg-transparent shadow-none w-fit max-w-fit flex justify-center'>
                                    <UserProfile routing="hash" />
                                </DialogContent>
                            </Dialog>
                        ) : (
                            <>
                                <SignInComponent />
                                <SignUpComponent />
                            </>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    )
}

export default Header