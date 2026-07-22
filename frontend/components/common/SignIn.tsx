import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { SignIn } from '@clerk/nextjs'
import { Button } from '../ui/button'

interface SignInProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const SignInComponent = ({ open, onOpenChange }: SignInProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='min-w-110!'>
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
        </DialogHeader>
        <div className='signUpBody'>
          <SignIn routing="hash" signUpUrl="#sign-up" />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SignInComponent