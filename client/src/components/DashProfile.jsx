import { Alert, Button, TextInput } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useForm } from 'react-hook-form'
import { updateStart, updateFailure, updateSuccess } from '../redux/user/userSlice'
import { useDispatch } from 'react-redux'


const DashProfile = () => {
    const { currentUser } = useSelector((state) => state.user)
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [imageFileUploading, setImageFileUploading] = useState(false);
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [updateUserError, setUpdateUserError] = useState(null);
    const filePickerRef = useRef();
    const dispatch = useDispatch();


    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            username: currentUser.username,
            email: currentUser.email,
            password: currentUser.password,
            profilePicture: currentUser.profilePicture
        }
    })



    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file));

        }
    }
    // console.log(imageFile, imageFileUrl);

    useEffect(() => {
        if (updateUserSuccess) {
            const timer = setTimeout(() => {
                setUpdateUserSuccess('');
            }, 5000);

            // Cleanup timer on component unmount or when updateUserSuccess changes
            return () => clearTimeout(timer);
        }
    }, [updateUserSuccess]);

    useEffect(() => {
        if (imageFile) {
            uploadImage();
        }
    }, [imageFile])

    const uploadImage = async () => {
        // console.log("uploading image");//the useEffect is calling this function whenever we are changing the image

        // service firebase.storage {
        //     match /b/{bucket}/o {
        //       match /{allPaths=**} {
        //         allow read;
        //         allow write:if
        //         request.resource.size<2*1024*1024 &&
        //         request.resource.contentType.matches('image/.*')
        //       }
        //     }
        //   }
        setImageFileUploadError(null);
        const storage = getStorage(app)
        const fileName = new Date().getTime() + imageFile.name //this is to make sure that the file name is unique
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile) //this is the function that uploads the file to firebase storage
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageFileUploadProgress(progress.toFixed(0));
            },
            (error) => {
                setImageFileUploadError("Could not upload the image (File must be less than 2MB),please try again");
                setImageFileUploadProgress(null);
                setImageFile(null);
                setImageFileUrl(null);
                setImageFileUploading(false);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL);
                    setValue('profilePicture', downloadURL);
                    setImageFileUploading(false);
                })
            }
        )
    }

    // console.log(imageFileUploadProgress, imageFileUploadError);

    const onSubmit = async (formData) => {
        // console.log(formData);
        setUpdateUserSuccess(null);
        if (!formData.password || formData.password.trim === '') {
            return;
        }


        if (imageFileUploading) { return; }
        try {
            dispatch(updateStart());
            const response = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
            const data = await response.json();
            if (!response.ok) {
                dispatch(updateFailure(data.message));
                // console.log("This is from failure");
                setUpdateUserError(data.message);

                return;
            }
            dispatch(updateSuccess(data));
            // console.log('This is the success data');
            // console.log(data);
            setUpdateUserSuccess("User profile updated Successfully");



        } catch (error) {
            // console.log("This is error");
            // console.log(error);
            dispatch(updateFailure(error.message));
        }

    }

    return (
        <div className='max-w-lg mx-auto p-3 w-full'>
            <h1 className='my-7 text-center font-semibold text-4xl'>Profile</h1>
            <form className='flex flex-col gap-4 ' onSubmit={handleSubmit(onSubmit)}>
                <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden />
                <div className=' relative w-32 h-32 self-center cursor-pointer shadow-md
                overflow-hidden rounded-full'
                    onClick={() => filePickerRef.current.click()}
                >
                    {imageFileUploadProgress && (
                        <CircularProgressbar value={imageFileUploadProgress || 0}
                            text={`${imageFileUploadProgress || 0}%`}
                            strokeWidth={5}
                            styles={{
                                root: {
                                    width: '100%', height: '100%',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0
                                },
                                path: {
                                    stroke: `rgba(62,152,199,${imageFileUploadProgress / 100})`
                                }

                            }}
                        />
                    )}
                    <img src={imageFileUrl || currentUser.profilePicture} alt='userProfile' className={`rounded-full
                     w-full h-full border-8 object-cover border-[lightgray]
                     ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'}
                     `
                    }></img>
                </div>
                {
                    imageFileUploadError &&
                    <Alert color='failure'>
                        {imageFileUploadError}
                    </Alert>
                }

                <TextInput type='text' id='username' placeholder='username'
                    {...register('username', {
                        required: true,
                        minLength: 3,
                        maxLength: 20,
                    })}
                    defaultValue={currentUser.username}
                />
                {errors.username && (<span className='text-red-500'>{errors.username.message}</span>)}
                <TextInput type='email' id='email' placeholder='email'
                    defaultValue={currentUser.email}
                    {...register('email', {
                        required: true,
                        pattern: {
                            value: /^\S+@\S+$/i,
                            message: "Invalid email address"
                        }
                    })}
                />
                {errors.email && (<span className='text-red-500'>{errors.email.message}</span>)}
                <TextInput type='password' id='password' placeholder='password'
                    {...register('password', {
                        required: true,
                        minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters long"
                        },
                        maxLength: {
                            value: 20,
                            message: "Password must be at most 20 characters long"
                        }


                    })}

                />
                {errors.password && (<span className='text-red-500'>{errors.password.message}</span>)}
                <Button type='submit' className="bg-gradient-to-br from-purple-600 to-blue-500 text-white hover:bg-gradient-to-bl focus:ring-blue-300 dark:focus:ring-blue-800">Update</Button>

            </form >
            <div className='text-red-500 flex justify-between mt-5'>
                <span className='cursor-pointer'>Delete Account</span>
                <span className='cursor pointer'>Sign Out</span>

            </div>
            {updateUserSuccess && (
                <Alert className='mt-5' color='success' >
                    {updateUserSuccess}
                </Alert>
            )}
            {updateUserError && (
                <Alert className='mt-5' color='failure'>
                    {updateUserError}
                </Alert>
            )}
        </div >
    )
}

export default DashProfile