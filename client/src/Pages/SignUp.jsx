import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

const SignUp = () => {

    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    })

    const onSubmit = async (formData) => {
        setLoading(true);
        setErrorMessage('');
        // await new Promise((resolve, reject) => { setTimeout(resolve, 4000) });//this is just for testing purpose to show the loading state
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            const data = await response.json();
            if (data.success === false) {
                setErrorMessage(data.message);
                setLoading(false);
                return;
            }
            setLoading(false);
            if (response.ok) {
                navigate('/sign-in');
            }

        } catch (error) {
            setErrorMessage(error.message);
            setLoading(false);

        }

    }

    return (
        <div className='min-h-screen mt-20' >
            <div className='flex p-3 gap-5 max-w-3xl mx-auto flex-col md:flex-row md:items-center'>
                {/* left side */}
                <div className='flex-1'>
                    <Link to='/' className='font-bold
         dark:text-white text-5xl'>
                        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500
                via-purple-500 to-pink-500 rounded-lg text-white'>Kasa's</span>
                        Blog
                    </Link>
                    <p className='text-lg font-normal mt-5'>This is a demo Project. You can signup with your email and password or with Google </p>
                </div>
                {/* right side */}
                <div className='flex-1'>
                    <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
                        <div className=''>
                            <Label className='text-sm md:text-lg font-normal'> Username</Label>
                            <TextInput type='text' placeholder='Username'
                                {...register('username', {
                                    required: "Username is required",
                                    setValueAs: (v) => v.trim(),
                                })}
                            />
                            {errors.username && <span className='text-red-500'>{errors.username.message}</span>}

                        </div>
                        <div>
                            <Label className=' text-sm md:text-lg font-normal' > Email</Label>
                            <TextInput type='email' placeholder='Email'
                                {...register('email', {
                                    required: "Email is required",
                                })}
                            />
                            {errors.email && <span className='text-red-500'>{errors.email.message}</span>}

                        </div>
                        <div>
                            <Label className=' text-sm md:text-lg font-normal' > Password</Label>
                            <TextInput type='password' placeholder='Password'
                                {...register('password', {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters"
                                    }
                                })}
                            />
                            {errors.password && <span className='text-red-500' >{errors.password.message}</span>}

                        </div>
                        <Button type='submit' className="bg-gradient-to-r from-purple-500 to-pink-500 text-lg text-white hover:bg-gradient-to-l focus:ring-purple-200 dark:focus:ring-purple-800"
                            disabled={loading}>
                            {loading ? (
                                <>
                                    <Spinner size='sm' />
                                    <span className='pl-3'>Loading...</span>
                                </>
                            ) : 'Sign Up'}
                        </Button>
                    </form>
                    <div className='text-sm gap-2 mt-5'>
                        <span>Have an account?</span>
                        <Link to='/sign-in' className='text-blue-500'>Sign In</Link>
                    </div>
                    {errorMessage && (
                        <Alert className='mt-5' color='failure'>
                            {errorMessage}
                        </Alert>
                    )}
                </div>
            </div>


        </div >
    )
}

export default SignUp