"use client";
import React, { useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import Textarea from '@/components/Textarea';
import toast from 'react-hot-toast';
import fetchApi from '@/utils/fetchApi';
import Button from '../Button';
import { useSelector } from 'react-redux';
const UpdatePost = ({ isOpen, setIsOpen, setFlag, flag, post }: any) => {
    const [postContent, setPostContent] = useState(post.content)
    const { userData } = useSelector((state: any) => state.Auth)
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
            setIsOpen(false)
        } else {
            toast.error(response.message)
        }
        setFlag(!flag)
    }

    return (<>
        <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
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
    </>)
}

export default UpdatePost