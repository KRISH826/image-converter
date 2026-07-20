import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { SignIn } from '@clerk/nextjs'
import { Button } from '../ui/button'

const SignInComponent = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={'lg'}>Sign In</Button>
      </DialogTrigger>
      <DialogContent className='min-w-110!'>
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
        </DialogHeader>
        <div className='signUpBody'>
          <SignIn />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SignInComponent