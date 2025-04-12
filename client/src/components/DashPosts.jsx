import { Table, TableHead, TableBody, TableCell, TableHeadCell, TableRow } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';

const DashPosts = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [userPosts, setUserPosts] = useState([]);

    useEffect(() => {


        const fetchPosts = async () => {
            try {
                const response = await fetch(`api/post/getposts?userId=${currentUser._id}`);
                const data = await response.json();
                // console.log(data);
                if (response.ok) {
                    setUserPosts(data.posts);


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
                                <TableHeadCell >Post Title</TableHeadCell>
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
                                        <TableCell>
                                            <Link to={`/post/${post.slug}`}>
                                                <img src={post.image} alt={post.title}
                                                    className='w-20 h-10 object-cover bg-gray-500'
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
                                            '>
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
                </>
            ) : (
                <p>You have no Post yet!</p>
            )
            }
        </div >

    )

}

export default DashPosts 