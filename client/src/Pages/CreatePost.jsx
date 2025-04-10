import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import { get } from 'mongoose';
import React, { useState } from 'react'
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


const CreatePost = () => {

    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({});


    const handleUploadImage = async () => {
        try {
            if (!file) {
                setImageUploadError('Please select an image to upload');
                // console.log('File is not selected');
                return;
            }
            setImageUploadError(null); //reset the error state
            const storage = getStorage(app);
            const fileName = new Date().getTime() + '-' + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on('state_changed', (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageUploadProgress(progress.toFixed(0)); //let progress be a integer value

            },
                (error) => {
                    setImageUploadError("Image Upload Failed");
                }
                ,
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageUploadProgress(null);
                        setImageUploadError(null);
                        setFormData({ ...formData, image: downloadURL })
                    })
                }
            )


        }
        catch (error) {
            setImageUploadError("Image Upload Failed");
            setImageUploadProgress(null);
            console.log(error);
        }

    }

    return (
        <div className='p-3 max-w-3xl mx-auto min-h-screen'>
            <h1 className='text-center text-3xl my-7 font-semibold'>Create a Post</h1>

            <form className='flex flex-col gap-4'>
                <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                    <TextInput type='text' placeholder='Title' required
                        className='flex-1'
                    />
                    <Select >
                        <option value='uncategorized'>Select a Category</option>
                        <option value='javascript'>Javascript</option>
                        <option value='reactjs'>React.js</option>
                        <option value='nextjs'>Next.js</option>
                    </Select>
                </div>
                <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
                    <FileInput type='file' accept='image/*' onChange={(e) => setFile(e.target.files[0])} />
                    <Button type='button'
                        className="bg-gradient-to-br from-purple-600 to-blue-500 text-white hover:bg-gradient-to-bl focus:ring-blue-300 dark:focus:ring-blue-800
                        py-6"
                        size='sm'
                        onClick={handleUploadImage}
                        disabled={imageUploadProgress}
                    >
                        {imageUploadProgress ?
                            <div>
                                <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} className='w-16 h-16' />
                            </div> : 'Upload Image'
                        }
                    </Button>
                </div>
                {imageUploadError && (
                    <Alert color="failure" className='w-full'>
                        {imageUploadError}
                    </Alert>
                )}
                {formData.image && (
                    <div className='w-full h-72 border-4 border-teal-500 border-dotted p-3'>
                        <img
                            src={formData?.image}
                            alt='upload'
                            className='w-full h-full object-contain'
                        />
                    </div>
                )}

                <ReactQuill theme='snow' placeholder="Write Something..." className='h-72 mb-12' />
                <Button type='submit' className="bg-gradient-to-r from-purple-500 to-pink-500 text-lg text-white hover:bg-gradient-to-l focus:ring-purple-200 dark:focus:ring-purple-800">
                    Publish
                </Button>
            </form>
        </div>
    )
}

export default CreatePost