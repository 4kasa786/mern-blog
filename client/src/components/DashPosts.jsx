import { Table, TableHead, TableBody, TableCell, TableHeadCell, TableRow, Modal, ModalHeader, ModalBody, Button } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { HiOutlineExclamationCircle } from 'react-icons/hi2';
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';

const DashPosts = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [userPosts, setUserPosts] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState('');

    const handleShowMore = async () => {
        const startIndex = userPosts.length;
        console.log(startIndex);
        try {
            const response = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`);
            const data = await response.json();
            if (response.ok) {
                setUserPosts((prev) => {
                    return [...prev, ...data.posts]
                })
                if (data.posts.length < 9) {
                    setShowMore(false);
                }


            }
        }
        catch (error) {
            console.log(error);
        }
    }

    const handleDeletePost = async () => {
        setShowModal(false);
        try {
            const response = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`, {
                method: 'DELETE',
            })
            const data = await response.json();
            if (!response.ok) {
                console.log(data.message);
            }
            else {
                setUserPosts((prev) => {
                    return prev.filter((post) => post._id !== postIdToDelete); //filter out the post form the userPosts array
                    //so that the rerender of the component is triggered.
                })
            }
        }
        catch (error) {
            console.log(error.message);
        }

    }

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`api/post/getposts?userId=${currentUser._id}`);
                const data = await response.json();
                // console.log(data);
                if (response.ok) {
                    setUserPosts(data.posts);
                    if (data.posts.length < 9) {
                        setShowMore(false);
                    }



                }
            }
            catch (error) {
                console.log(error);

            }

        }

        if (currentUser.isAdmin) fetchPosts();
    }, [currentUser._id])

    return (

        <div
            className='table-auto overflow-x-scroll md:mx-auto  w-full p-3 scrollbar
          scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700
          dark:scrollbar-thumb-slate-500'
        >
            {currentUser.isAdmin && userPosts.length > 0 ? (
                <>
                    <Table hoverable className='shadow-md'>
                        <TableHead>
                            <TableRow>
                                <TableHeadCell>Date Updated</TableHeadCell>
                                <TableHeadCell>Post Image</TableHeadCell>
                                <TableHeadCell>Post Title</TableHeadCell>
                                <TableHeadCell>Category</TableHeadCell>
                                <TableHeadCell>Delete</TableHeadCell>
                                <TableHeadCell>
                                    <span>Edit</span>
                                </TableHeadCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className='divide-y'>
                            {userPosts.map((post) => {
                                return (
                                    <TableRow key={post._id}
                                        className='bg-white dark:border-gray-700 dark:bg-gray-800'
                                    >
                                        <TableCell>{new Date(post.updatedAt).toLocaleDateString()}</TableCell>
                                        <TableCell >
                                            <Link to={`/post/${post.slug}`}
                                            >
                                                <img src={post.image} alt={post.title}
                                                    className='w-20 h-20 object-cover  bg-gray-500'
                                                />
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Link
                                                className='font-medium text-gray-900 dark:text-white'
                                                to={`/post/${post.slug}`}>{post.title}</Link>
                                        </TableCell>
                                        <TableCell>{post.category}</TableCell>
                                        <TableCell>
                                            <span className='font-medium text-red-500 hover:underline
                                             cursor-pointer
                                            '
                                                onClick={() => {
                                                    setShowModal(true);
                                                    setPostIdToDelete(post._id);
                                                }}
                                            >
                                                Delete
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Link
                                                className='text-teal-500 
                                                hover:underline'
                                                to={`/update-post/${post._id}`}>
                                                <span>
                                                    Edit
                                                </span>
                                            </Link>

                                        </TableCell>

                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                    {showMore && (
                        <div className='w-full flex justify-center mt-4'>
                            <button
                                onClick={handleShowMore}
                                className={` px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 
                            text-blue-600 bg-white border border-blue-200 hover:bg-blue-50 shadow-sm
                            dark:text-blue-400 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700
                          `}
                            >
                                Show More
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <p>You have no Post yet!</p>
            )
            }
            <Modal show={showModal} onClose={() => setShowModal(false)}
                popup
                size='md'>
                <ModalHeader />
                <ModalBody>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are You Sure You want to delete this Post?</h3>
                    </div>
                    <div className='flex justify-center gap-4'>
                        <Button className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white hover:bg-gradient-to-br focus:ring-red-300 dark:focus:ring-red-800"
                            onClick={handleDeletePost}>
                            Yes, I'm sure
                        </Button>
                        <Button
                            onClick={() => setShowModal(false)}
                        >No, cancel</Button>

                    </div>
                </ModalBody>

            </Modal>
        </div >

    )

}

export default DashPosts 