import { Button, Label, TextInput } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'

const SignUp = () => {
    return (
        <div className='min-h-screen mt-20'>
            <div className='flex p-3 gap-5 max-w-3xl mx-auto flex-col md:flex-row md:items-center'>
                {/* left side */}
                <div className='flex-1'>
                    <Link to='/' className='font-bold
         dark:text-white text-4xl'>
                        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500
                via-purple-500 to-pink-500 rounded-lg text-white'>Kasa's</span>
                        Blog
                    </Link>
                    <p className='text-sm  mt-5'>This is a demo Project. You can signup with your email and password or with Google </p>
                </div>
                {/* right side */}
                <div className='flex-1'>
                    <form className='flex flex-col gap-4'>
                        <div className=''>
                            <Label >Your Username</Label>
                            <TextInput type='text' placeholder='Username' id='username' />

                        </div>
                        <div>
                            <Label >Your Email</Label>
                            <TextInput type='email' placeholder='Email' id='email' />

                        </div>
                        <div>
                            <Label >Your Password</Label>
                            <TextInput type='password' placeholder='Password' id='password' />

                        </div>
                        <Button type='submit' className="bg-gradient-to-r from-purple-500 to-pink-500 text-lg text-white hover:bg-gradient-to-l focus:ring-purple-200 dark:focus:ring-purple-800">
                            Sign Up
                        </Button>
                    </form>
                    <div className='text-sm gap-2 mt-5'>
                        <span>Have an account?</span>
                        <Link to='/sign-in' className='text-blue-500'>Sign In</Link>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default SignUp