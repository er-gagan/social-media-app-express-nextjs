"use client";
import React, { useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import Textarea from '@/components/Textarea';
import toast from 'react-hot-toast';
import fetchApi from '@/utils/fetchApi';
import Button from '../Button';
const CreatePost = ({ isOpen, setIsOpen, setFlag, flag }: any) => {
    const [postContent, setPostContent] = useState("")
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const response = await fetchApi({
            endpoint: "/api/posts",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            payload: {
                content: postContent
            }
        })
        if (response.status_code === 201) {
            toast.success(response.message)
            setIsOpen(false)
            setPostContent("")
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
                                Create Post
                            </ModalHeader>
                            <ModalBody>
                                <Textarea
                                    label="Post Content"
                                    placeholder='Post Content'
                                    required={true}
                                    isRequired={true}
                                    onChange={(e) => setPostContent(e.target.value)}
                                    value={postContent}
                                    minRows={15}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button type='button' label="Close" color="danger" variant="light" onPress={onClose} />
                                <Button type='submit' color="primary" label="Save" />
                            </ModalFooter>
                        </form>
                    </>
                )}
            </ModalContent>
        </Modal>
    </>)
}

export default CreatePost