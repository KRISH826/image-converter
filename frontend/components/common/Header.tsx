"use client"
import { useState, useEffect } from 'react'
import { useUser, useClerk, UserProfile } from '@clerk/nextjs'
import SignUpComponent from './SignUp'
import SignInComponent from './SignIn'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '../ui/dropdown-menu'
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { User, LogOut, ChevronDown } from 'lucide-react'

const Header = () => {
    const { user } = useUser();
    const { signOut } = useClerk();

    const [isSignInOpen, setIsSignInOpen] = useState(false);
    const [isSignUpOpen, setIsSignUpOpen] = useState(false);

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            if (hash.startsWith('#sign-up')) {
                setIsSignInOpen(false);
                setIsSignUpOpen(true);
            } else if (hash.startsWith('#sign-in')) {
                setIsSignUpOpen(false);
                setIsSignInOpen(true);
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        handleHashChange();

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    const handleSignInOpenChange = (open: boolean) => {
        setIsSignInOpen(open);
        if (!open && window.location.hash.startsWith('#sign-in')) {
            window.history.replaceState(null, '', window.location.pathname);
        }
    };

    const handleSignUpOpenChange = (open: boolean) => {
        setIsSignUpOpen(open);
        if (!open && window.location.hash.startsWith('#sign-up')) {
            window.history.replaceState(null, '', window.location.pathname);
        }
    };

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
                                    <DropdownMenuTrigger className="outline-none flex items-center gap-2 hover:opacity-85 transition-opacity cursor-pointer">
                                        <Avatar>
                                            <AvatarImage src={user.imageUrl} />
                                            <AvatarFallback className="uppercase bg-primary text-primary-foreground">
                                                {user.firstName?.charAt(0) || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm font-medium text-zinc-300">
                                            {user.firstName}
                                        </span>
                                        <ChevronDown className="h-4 w-4 text-zinc-500" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-40">
                                        <DialogTrigger asChild>
                                            <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                                                <User className="h-4 w-4" />
                                                <span>Profile</span>
                                            </DropdownMenuItem>
                                        </DialogTrigger>
                                        <DropdownMenuSeparator className="bg-zinc-800" />
                                        <DropdownMenuItem className="cursor-pointer flex items-center gap-2" onClick={() => signOut({ redirectUrl: '/' })}>
                                            <LogOut className="h-4 w-4" />
                                            <span>Sign Out</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <DialogContent className='min-w-fit'>
                                    <DialogHeader>
                                        <DialogTitle>Profile</DialogTitle>
                                    </DialogHeader>
                                    <div className='signUpBody'>
                                        <UserProfile routing="hash" />
                                    </div>
                                </DialogContent>
                            </Dialog>
                        ) : (
                            <>
                                <Button size={'lg'} onClick={() => setIsSignInOpen(true)}>Sign In</Button>
                                <Button variant={'outline'} size={'lg'} onClick={() => setIsSignUpOpen(true)}>Sign Up</Button>

                                <SignInComponent
                                    open={isSignInOpen}
                                    onOpenChange={handleSignInOpenChange}
                                    onSignUpClick={() => {
                                        setIsSignInOpen(false);
                                        setIsSignUpOpen(true);
                                    }}
                                />
                                <SignUpComponent
                                    open={isSignUpOpen}
                                    onOpenChange={handleSignUpOpenChange}
                                    onSignInClick={() => {
                                        setIsSignUpOpen(false);
                                        setIsSignInOpen(true);
                                    }}
                                />
                            </>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    )
}

export default Header