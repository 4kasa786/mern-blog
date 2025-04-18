import { Table, TableHead, TableBody, TableCell, TableHeadCell, TableRow, Modal, ModalHeader, ModalBody, Button } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { FaCheck, FaTimes } from 'react-icons/fa';
import { HiOutlineExclamationCircle } from 'react-icons/hi2';
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';

const DashUsers = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [users, setUsers] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState('');

    const handleShowMore = async () => {
        const startIndex = users.length;
        console.log(startIndex);
        try {
            const response = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
            const data = await response.json();
            if (response.ok) {
                setUsers((prev) => {
                    return [...prev, ...data.users]
                })
                if (data.users.length < 9) {
                    setShowMore(false);
                }


            }
        }
        catch (error) {
            console.log(error);
        }
    }

    const handleDeleteUser = async () => {
        try {
            const response = await fetch(`/api/user/delete/${userIdToDelete}`, {
                method: 'DELETE',

            })
            const data = await response.json();
            if (response.ok) {
                setUsers((prev) => {
                    return prev.filter((user) => {
                        return user._id !== userIdToDelete;
                    })
                })
                setShowModal(false);
            }
            else {
                console.log(error.message);

            }

        }
        catch (error) {

        }

    }



    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`api/user/getusers`);
                const data = await response.json();
                // console.log(data);
                if (response.ok) {
                    setUsers(data.users);
                    if (data.users.length < 9) {
                        setShowMore(false);
                    }


                }
            }
            catch (error) {
                console.log(error);

            }

        }

        if (currentUser.isAdmin) fetchUsers();
    }, [currentUser._id])

    return (

        <div
            className='table-auto overflow-x-scroll md:mx-auto  w-full p-3 scrollbar
          scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700
          dark:scrollbar-thumb-slate-500 '
        >
            {currentUser.isAdmin && users.length > 0 ? (
                <>
                    <Table hoverable className='shadow-md'>
                        <TableHead>
                            <TableRow className=''>
                                <TableHeadCell>Date created</TableHeadCell>
                                <TableHeadCell>User Image</TableHeadCell>
                                <TableHeadCell>Username</TableHeadCell>
                                <TableHeadCell>Email</TableHeadCell>
                                <TableHeadCell>Admin</TableHeadCell>
                                <TableHeadCell>Delete</TableHeadCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className='divide-y'>
                            {users.map((user) => {
                                return (
                                    <TableRow key={user._id}
                                        className='bg-white dark:border-gray-700 dark:bg-gray-800'
                                    >
                                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell >

                                            <img src={user.profilePicture} alt={user.username}
                                                className='w-10 h-10 object-cover rounded-full  bg-gray-500'
                                            />

                                        </TableCell>
                                        <TableCell>
                                            {user.username}
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.isAdmin ? (<FaCheck className='text-green-500' />) : (<FaTimes className='text-red-500' />)}</TableCell>
                                        <TableCell>
                                            <span className='font-medium text-red-500 hover:underline
                                             cursor-pointer
                                            '
                                                onClick={() => {
                                                    setShowModal(true);
                                                    setUserIdToDelete(user._id);
                                                }}
                                            >
                                                Delete
                                            </span>
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
                <p>You have no users yet!</p>
            )
            }
            <Modal show={showModal} onClose={() => setShowModal(false)}
                popup
                size='md'>
                <ModalHeader />
                <ModalBody>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are You Sure You want to delete this user?</h3>
                    </div>
                    <div className='flex justify-center gap-4'>
                        <Button className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white hover:bg-gradient-to-br focus:ring-red-300 dark:focus:ring-red-800"
                            onClick={handleDeleteUser}>
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

export default DashUsers 