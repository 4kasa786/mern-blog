import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { Textarea, Button, Alert } from 'flowbite-react';
import Comment from './Comment';
import { Modal, ModalHeader, ModalBody } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';


const CommentSection = ({ postId }) => {
    // console.log(postId);
    const { currentUser } = useSelector((state) => state.user);
    const [comment, setComment] = useState('');
    const [commentError, setCommentError] = useState(null);
    const [comments, setComments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);
    // console.log(comments);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (comment.length > 200) { return; }
        try {
            const response = await fetch(`/api/comment/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: comment, postId, userId: currentUser._id })
            });
            const data = await response.json();
            if (response.ok) {
                setComment('');
                setCommentError(null);
                setComments([data, ...comments]);
            }

        }
        catch (error) {
            console.log(error.message);
            setCommentError(error.message);
        }

    }

    useEffect(() => {
        const getComments = async () => {
            try {
                const response = await fetch(`/api/comment/getPostComments/${postId}`);
                if (response.ok) {
                    const data = await response.json();
                    setComments(data);
                }

            }
            catch (error) {
                console.log(error.message);
            }
        }
        getComments();
    }, [postId]);

    const handleLike = async (commentId) => {
        try {
            if (!currentUser) {
                navigate('/sign-in');
                return;
            }
            const res = await fetch(`/api/comment/likeComment/${commentId}`, {
                method: 'PUT',
            });
            if (res.ok) {
                const data = await res.json();
                setComments(
                    comments.map((comment) =>
                        comment._id === commentId
                            ? {
                                ...comment,
                                likes: data.likes,
                                numberOfLikes: data.likes.length,
                            }
                            : comment
                    )
                );
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleEdit = async (comment, editedContent) => {
        setComments(comments.map((c) => {
            if (c._id === comment._id) {
                return {
                    ...c,
                    content: editedContent
                }
            }
            return c
        }))

    }

    const handleDelete = async (commentId) => {
        setShowModal(false);
        try {
            if (!currentUser) {
                navigate('/sign-in');
                return;
            }

            const response = await fetch(`/api/comment/deleteComment/${commentId}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                const data = await response.json();

                setComments(comments.filter((comment) => comment._id !== commentId));
            }
        } catch (error) {
            console.log(error.message);

        }
    }

    return (
        <div className='max-w-2xl mx-auto w-full p-3'>
            {currentUser ?
                (
                    <div className='flex items-center gap-2 my-5 text-gray-500 text-sm'>
                        <p>Signed in as:</p>
                        <img className='h-9  w-9 object-cover rounded-full' src={currentUser.profilePicture} alt="profile Picture" />
                        <Link to='/dashboard?tab=profile' className='text-xs text-cyan-600 hover:underline'>@{currentUser.username}</Link>
                    </div>
                ) :
                (
                    <div className='text-sm text-teal-500 my-5
                    flex gap-1'>
                        You must be logged in to comment.
                        <Link to='/sign-in' className='text-blue-500 hover:underline'>
                            Sign In
                        </Link>
                    </div>
                )}
            {currentUser && (
                <form
                    onSubmit={handleSubmit}
                    className='border border-teal-500 rounded-md p-3'>
                    <Textarea
                        placeholder='Add a comment...'
                        rows={3}
                        maxLength='200'
                        onChange={(e) => { return setComment(e.target.value) }}
                        value={comment}
                    />
                    <div className='flex justify-between items-center mt-5'>
                        <p className='text-gray-500 text-xs'>{200 - comment.length} characters remaining</p>
                        <Button
                            type='submit'
                            className="bg-gradient-to-br from-purple-600 to-blue-500 text-white hover:bg-gradient-to-bl focus:ring-blue-300 dark:focus:ring-blue-800"
                        >
                            Comment
                        </Button>
                    </div>
                    {commentError && (
                        <Alert color="failure" className='mt-5'>{commentError}</Alert>
                    )}
                </form>

            )}
            {comments.length === 0 ? (
                <p className='text-sm my-5'>No comments yet!</p>
            ) : (
                <>
                    <div className='text-sm my-5 flex items-center gap-1'>
                        <p>Comments</p>
                        <div className='border border-gray-400 py-1 px-2 rounded-sm'>
                            <p>{comments.length}</p>
                        </div>
                    </div>
                    {comments.map((comment, index) => {
                        return (
                            <Comment key={comment ? comment._id : index}
                                comment={comment}
                                onLike={handleLike}
                                onEdit={handleEdit}
                                onDelete={(commentId) => {
                                    setShowModal(true);
                                    setCommentToDelete(commentId);
                                }}
                            />
                        )
                    })}
                </>
            )}
            <Modal show={showModal} onClose={() => setShowModal(false)}
                popup
                size='md'>
                <ModalHeader />
                <ModalBody>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are You Sure You want to delete this comment?</h3>
                    </div>
                    <div className='flex justify-center gap-4'>
                        <Button className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white hover:bg-gradient-to-br focus:ring-red-300 dark:focus:ring-red-800"
                            onClick={() => handleDelete(commentToDelete)}>
                            Yes, I'm sure
                        </Button>
                        <Button
                            onClick={() => setShowModal(false)}
                        >No, cancel</Button>

                    </div>
                </ModalBody>

            </Modal>
        </div>
    )
}

export default CommentSection