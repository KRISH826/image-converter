import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { SignUp } from '@clerk/nextjs'
import { Button } from '../ui/button'

interface SignUpProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const SignUpComponent = ({ open, onOpenChange }: SignUpProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='min-w-110!'>
        <DialogHeader>
          <DialogTitle>Sign Up</DialogTitle>
        </DialogHeader>
        <div className='signUpBody'>
          <SignUp routing="hash" signInUrl="#sign-in" />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SignUpComponent