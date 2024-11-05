import { FC, useState } from 'react';
import { Card, CardBody, Button as NextUIButton, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import { format } from 'date-fns';
import { Post } from './types';
import { HeartIcon, TrashIcon } from '@heroicons/react/16/solid';
import fetchApi from '@/utils/fetchApi';
import toast from 'react-hot-toast';
import Textarea from '../Textarea';
import Button from '../Button';
import { useSelector } from 'react-redux';

const PostCard = ({ post, setFlag, flag }: any) => {
    const [postModalIsOpen, setPostModalIsOpen] = useState(false)
    const [postContent, setPostContent] = useState(post.content)
    const { userData } = useSelector((state: any) => state.Auth)
    const toggleLike = async () => {
        if (post.isLikedByCurrentUser) {
            const response: any = await fetchApi({
                endpoint: `/api/posts/${post.id}/unlike`,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            })

            if (response.status_code === 200) {
                toast.success(response.message)
            } else {
                toast.error(response.message)
            }

        } else {
            const response: any = await fetchApi({
                endpoint: `/api/posts/${post.id}/like`,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            })

            if (response.status_code === 200) {
                toast.success(response.message)
            } else {
                toast.error(response.message)
            }
        }
        setFlag(!flag);
    };

    const textTruncate = (text: string) => {
        if (text.length > 100) {
            return text.substring(0, 100) + '...';
        }
        return text;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const response = await fetchApi({
            endpoint: "/api/posts",
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            payload: {
                content: postContent,
                postId: post.id
            }
        })
        if (response.status_code === 200) {
            toast.success(response.message)
            setPostModalIsOpen(false)
        } else {
            toast.error(response.message)
        }
        setFlag(!flag)
    }

    const handleDeletePost = async () => {
        const response = await fetchApi({
            endpoint: `/api/posts`,
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            payload: {
                id: post.id
            }
        })

        if (response.status_code === 200) {
            toast.success(response.message)
        } else {
            toast.error(response.message)
        }
        setFlag(!flag)
    }

    return (<>
        <Card
            isHoverable
            isPressable={true}
            onClick={() => {
                setPostModalIsOpen(true);
            }}
            className="w-full max-w-md mx-auto p-4 mb-4 shadow-md rounded-lg bg-white dark:bg-gray-800"
        >
            <CardBody>
                <div className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100 max-h-[200px] overflow-auto">
                    {textTruncate(post.content)}
                </div>
                <div className="flex justify-between flex-wrap">
                    <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            Author: {post.username}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Posted on: {format(new Date(post.created_at), 'dd MMM yyyy')}
                        </div>
                    </div>
                    <div className='self-end'>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            Likes: {post.totalLikes}
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap w-full gap-2">

                    <NextUIButton
                        variant='flat'
                        color='primary'
                        onPress={() => toggleLike()}
                        className="mt-4 flex items-center text-sm font-semibold text-gray-900 dark:text-gray-100 w-full "
                    >
                        <HeartIcon
                            className={`h-6 w-6 ${post.isLikedByCurrentUser ? 'text-red-500' : 'text-gray-400'}`}
                        />
                        <span className="ml-2">{post.isLikedByCurrentUser ? 'Unlike' : 'Like'}</span>
                    </NextUIButton>
                    {userData.id === post.user_id ? (
                        <NextUIButton
                            variant='flat'
                            color='primary'
                            onPress={() => handleDeletePost()}
                            className="mt-4 flex items-center text-sm font-semibold text-gray-900 dark:text-gray-100 w-full"
                        >
                            <TrashIcon
                                className={`h-6 w-6 ${'text-red-500'}`}
                            />
                            <span className="ml-2">{"Delete"}</span>
                        </NextUIButton>
                    ) : null}
                </div>
            </CardBody>
        </Card>

        <Modal isOpen={postModalIsOpen} onOpenChange={setPostModalIsOpen}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <form onSubmit={handleSubmit}>
                            <ModalHeader className="flex flex-col gap-1">
                                {userData.id === post.user_id ? "Update Post" : "View Post"}
                            </ModalHeader>
                            <ModalBody>
                                {userData.id === post.user_id ? (

                                    <Textarea
                                        label="Post Content"
                                        placeholder='Post Content'
                                        required={true}
                                        isRequired={true}
                                        onChange={(e) => setPostContent(e.target.value)}
                                        value={postContent}
                                        minRows={15}
                                    />
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400">
                                        {post.content}
                                    </p>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button type='button' label="Close" color="danger" variant="light" onPress={onClose} />
                                {userData.id === post.user_id ? (
                                    <Button type='submit' color="primary" label="Update" />
                                ) : null}
                            </ModalFooter>
                        </form>
                    </>
                )}
            </ModalContent>
        </Modal>
    </>);
};

export default PostCard;
