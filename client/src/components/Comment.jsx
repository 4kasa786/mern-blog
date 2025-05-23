import React, { useState } from 'react'
import { useEffect } from 'react'
import moment from 'moment'
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Button, Textarea } from 'flowbite-react';


const Comment = ({ comment, onLike, onEdit, onDelete }) => {

    const [user, setUser] = useState({});
    const { currentUser } = useSelector((state) => state.user);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);

    // console.log(currentUser);
    useEffect(() => {

        const getUser = async () => {
            try {
                if (!comment) return;
                const response = await fetch(`/api/user/${comment.userId}`);
                const data = await response.json();
                if (response.ok) {
                    setUser(data);

                }
                // console.log(data);
            }
            catch (error) {
                console.log(error);
            }
        }

        getUser();



    }, [comment])


    const handleEdit = () => {
        setIsEditing(true);
        setEditedContent(comment.content);
    }

    const handleSave = async () => {
        try {

            const response = await fetch(`/api/comment/editComment/${comment._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: editedContent
                })
            })

            const data = await response.json();

            if (response.ok) {
                // console.log(data);
                setIsEditing(false);
                onEdit(comment, editedContent);
            }
        } catch (error) {

            console.log(error.message);
        }
    }

    const handleDelete = async () => {
        onDelete(comment._id);
    }

    return (
        <div className='flex p-4 border-b dark:border-gray-600 text-sm '>
            <div className='flex-shrink-0 mr-3'>
                <img className='w-10 h-10 rounded-full bg-gray-200' src={user.profilePicture} alt={user.username} />
            </div>
            <div className='flex-1'>
                <div className='flex items-center mb-1'>
                    <span className='font-bold mr-1 text-xs truncate'>
                        {user ? `@${user.username}` : "Anonymous"}
                    </span>
                    <span className='text-gray-500 text-xs'>
                        {moment(comment?.createdAt).fromNow()}
                    </span>
                </div>

                {isEditing ? (
                    <>
                        <Textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className='mb-2'
                        />
                        <div className='flex justify-end gap-2 text-xs'>
                            <Button
                                type='button'
                                size='sm'
                                className="bg-gradient-to-br from-purple-600 to-blue-500 text-white hover:bg-gradient-to-bl focus:ring-blue-300 dark:focus:ring-blue-800"
                                onClick={handleSave}
                            >
                                Save
                            </Button>

                            <Button
                                type='button'
                                size='sm'
                                className="bg-gradient-to-br from-purple-600 to-blue-500 text-white hover:bg-gradient-to-bl focus:ring-blue-300 dark:focus:ring-blue-800"
                                onClick={() => setIsEditing(false)}

                            >
                                Cancel
                            </Button>
                        </div>
                    </>

                ) : (
                    <>
                        <p className='text-gray-500 pb-2' >{comment?.content}</p>
                        <div className='flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2'>
                            <button
                                type='button'
                                onClick={() => {
                                    onLike(comment?._id);

                                }}
                                className={`text-gray-400 hover:text-blue-500 ${currentUser && comment.likes.includes(currentUser._id) && '!text-blue-500'}`}>
                                <FaThumbsUp className='text-sm' />
                            </button>
                            <p className='text-gray-400'>
                                {comment.numberOfLikes > 0 && comment.numberOfLikes + " " + (comment.numberOfLikes === 1 ? "Like" : "Likes")}
                            </p>
                            {currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                                <>
                                    <button
                                        type='button'
                                        className='text-gray-500 hover:text-blue-500'
                                        onClick={handleEdit}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type='button'
                                        className='text-gray-500 hover:text-blue-500'
                                        onClick={handleDelete}
                                    >
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    </>

                )
                }


            </div>

        </div>
    )
}

export default Comment