import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { SignUp } from '@clerk/nextjs'
import { Button } from '../ui/button'

const SignUpComponent = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'outline'} size={'lg'}>Sign Up</Button>
      </DialogTrigger>
      <DialogContent className='min-w-110!'>
        <DialogHeader>
            <DialogTitle>Sign Up</DialogTitle>
        </DialogHeader>
        <div className='signUpBody'>
            <SignUp  />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SignUpComponent