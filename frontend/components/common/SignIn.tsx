import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { SignIn } from '@clerk/nextjs'
import { Button } from '../ui/button'

interface SignInProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSignUpClick?: () => void
}

const SignInComponent = ({ open, onOpenChange, onSignUpClick }: SignInProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='min-w-110! max-h-[90vh] overflow-y-auto scroll-fade scroll-smooth scrollbar-none'>
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
        </DialogHeader>
        <div className='signUpBody'>
          <SignIn routing="hash" signUpUrl="#sign-up" />
          <div className='flex justify-center items-center'>
            <p>Don&apos;t Have an Account.</p>
            <Button variant={"link"} onClick={onSignUpClick}>Sign Up</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SignInComponent