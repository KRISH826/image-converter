import React from 'react'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'
import { UserProfile } from '@clerk/nextjs'
import { Button } from '../ui/button'

const UserProfileComponent = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'outline'} size={'lg'}>Profile</Button>
      </DialogTrigger>
      <DialogContent className='border-none p-0 bg-transparent shadow-none w-auto max-w-none flex justify-center'>
        <UserProfile />
      </DialogContent>
    </Dialog>
  )
}

export default UserProfileComponent
