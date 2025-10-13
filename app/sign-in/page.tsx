import { SignIn } from '@stackframe/stack'
import Link from 'next/link'
import React from 'react'

const SignInPage = () => {
 return (
  <div className='min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-50 to-purple-100'>
   <div className="max-w-md w-full space-y-8">
    <SignIn />
    <Link href="/" className='text-purple-600 hover:underline block text-center mt-4'>Back to Home</Link>
   </div>
  </div>
 )
}

export default SignInPage