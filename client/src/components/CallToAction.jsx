import { Button } from 'flowbite-react'
import React from 'react'

const CallToAction = () => {
    return (
        <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl 
            text-center'>
            <div className=' flex flex-1 flex-col justify-center items-center '>
                <h2 className='text-2xl '>
                    Want to learn HTML, CSS and JavaScript by building fun and engaging projects?
                </h2>
                <p className='text-gray-500 my-2'>
                    Check our 100 js projects website and start building your own projects
                </p>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:bg-gradient-to-l focus:ring-purple-200 dark:focus:ring-purple-800">
                    <a href='https://www.100jsprojects.com' target='_blank' rel='noopener noreferrer'>100 Js Projects</a>
                </Button>
            </div>
            <div className='p-7 flex-1'>
                <img src="https://media.geeksforgeeks.org/wp-content/cdn-uploads/20221114110410/Top-10-JavaScript-Project-Ideas-For-Beginners-2023.png" alt="call to action image" />

            </div>

        </div>
    )
}

export default CallToAction