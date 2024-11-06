import { FC, useState } from 'react';
import { Card, CardBody, Chip, Button as NextUIButton } from '@nextui-org/react';
import { SlUserFollow, SlUserFollowing } from "react-icons/sl";

import { format } from 'date-fns';
import { HeartIcon, TrashIcon } from '@heroicons/react/16/solid';
import fetchApi from '@/utils/fetchApi';
import toast from 'react-hot-toast';
import Textarea from '../Textarea';
import Button from '../Button';
import { useSelector } from 'react-redux';
import UpdatePost from './UpdatePost';

const PostCard = ({ post, setFlag, flag }: any) => {
    const [postModalIsOpen, setPostModalIsOpen] = useState(false)
    const { userData } = useSelector((state: any) => state.Auth)
    const toggleLike = async () => {
        try {
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
                    toast.success(response.message, { id: "copy" })
                } else {
                    toast.error(response.message, { id: "copy" })
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
                    toast.success(response.message, { id: "copy" })
                } else {
                    toast.error(response.message, { id: "copy" })
                }
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message, { id: "copy" })
            } else {
                toast.error("An unknown error occurred", { id: "copy" })
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

    const handleDeletePost = async () => {
        try {
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
                toast.success(response.message, { id: "copy" })
            } else {
                toast.error(response.message, { id: "copy" })
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message, { id: "copy" })
            } else {
                toast.error("An unknown error occurred", { id: "copy" })
            }
        }
        setFlag(!flag)
    }

    const handleFollowUser = async () => {
        try {
            const response = await fetchApi({
                endpoint: `/api/users/${post.user_id}/follow`,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            })

            if (response.status_code === 200) {
                if (post.isFollowedByCurrentUser === 1) {
                    toast.success("You have unfollowed this user")
                } else {
                    toast.success(response.message, { id: "copy" })
                }
            } else {
                toast.error(response.message, { id: "copy" })
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message, { id: "copy" })
            } else {
                toast.error("An unknown error occurred", { id: "copy" })
            }
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
                        <div className="text-ms text-gray-500 dark:text-gray-400 mt-2 " onClick={() => setPostModalIsOpen(true)}>
                            <b>Author:</b> {post.username} {userData.id === post.user_id ? '(You)' : <Chip
                                startContent={post.isFollowedByCurrentUser ? <SlUserFollowing size={16} /> : <SlUserFollow size={16} />}
                                variant="flat"
                                size='sm'
                                color="primary"
                                className='px-4 cursor-pointer hover:underline'
                                onClick={e => {
                                    e.stopPropagation()
                                    handleFollowUser()
                                }}
                            >
                                &nbsp;{post.isFollowedByCurrentUser ? 'Unfollow' : 'Follow'}
                            </Chip>}
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
                <div className="flex flex-wrap sm:flex-nowrap w-full gap-2">

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
        <UpdatePost
            isOpen={postModalIsOpen}
            setIsOpen={setPostModalIsOpen}
            post={post}
            setFlag={setFlag}
            flag={flag}
        />
    </>);
};

export default PostCard;
