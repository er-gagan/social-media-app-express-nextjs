"use client";
import Button from '@/components/Button';
import PostList from '@/components/Post/PostList';
import fetchApi from '@/utils/fetchApi';
import React, { useEffect, useState } from 'react'
import CreatePost from '@/components/Post/CreatePost';

const Home = () => {
  const [postData, setPostData] = useState<any>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [totalPage, setTotalPage] = useState(1)
  const [flag, setFlag] = useState(false)
  const [createPostModalIsOpen, setCreatePostModalIsOpen] = useState(false)

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
      const data = response.data
      setPostData([...postData, ...data.posts])
      setTotalPage(data.pagination.totalPages)
    }
  }

  useEffect(() => {
    handleGetAllPosts()
  }, [flag, currentPage, perPage])

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
      <PostList posts={postData} setFlag={setFlag} flag={flag} setCurrentPage={setCurrentPage} totalPage={totalPage} currentPage={currentPage} />
    ) : (
      <div className='text-center font-semibold text-xl mt-10'>
        No posts found. Create your first post.
      </div>
    )}

    <CreatePost
      isOpen={createPostModalIsOpen}
      setIsOpen={setCreatePostModalIsOpen}
      setFlag={setFlag}
      flag={flag}
    />
  </>
  )
}
export default Home
