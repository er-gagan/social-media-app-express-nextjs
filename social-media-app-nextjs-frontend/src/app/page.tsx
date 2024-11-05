"use client";
import Button from '@/components/Button';
import PostList from '@/components/Post/PostList';
import fetchApi from '@/utils/fetchApi';
import React, { useEffect, useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import Textarea from '@/components/Textarea';
import toast from 'react-hot-toast';

const Home = () => {
  const [postData, setPostData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [totalPage, setTotalPage] = useState(1)
  const [flag, setFlag] = useState(false)
  const [createPostModalIsOpen, setCreatePostModalIsOpen] = useState(false)
  const [postContent, setPostContent] = useState("")

  const handleGetAllPosts = async () => {
    const response = await fetchApi({
      endpoint: `/api/posts?page=${currentPage}&limit=${perPage}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })

    if (response.status_code === 200) {
      setPostData(response.data.posts)
      setTotalPage(response.data.pagination.totalPages)
    }
  }

  useEffect(() => {
    handleGetAllPosts()
  }, [flag])

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
      setCreatePostModalIsOpen(false)
      setPostContent("")
    } else {
      toast.error(response.message)
    }
    setFlag(!flag)
  }

  return (<>
    <div className='flex justify-between flex-wrap m-4'>
      <div>
        <h1 className='text-3xl font-bold'>Posts</h1>
      </div>
      <Button
        type='button'
        label='Create Post'
        onClick={() => {
          setCreatePostModalIsOpen(true)
        }}
      />
    </div>
    {postData && postData.length > 0 ? (

      <PostList posts={postData} setFlag={setFlag} flag={flag} />
    ) : (
      <div className='text-center font-semibold text-xl mt-10'>
        No posts found. Create your first post.
      </div>
    )}

    <Modal isOpen={createPostModalIsOpen} onOpenChange={setCreatePostModalIsOpen}>
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
  </>
  )
}
export default Home
