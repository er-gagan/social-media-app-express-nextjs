"use client";
import PostCard from './PostCard';
import InfiniteScroll from 'react-infinite-scroll-component';

const PostList = ({ posts, setFlag, flag, setCurrentPage, totalPage, currentPage }: any) => {
    return (
        <div id="scrollableDiv" style={{ height: "700px", overflow: "auto" }}>

            <InfiniteScroll
                dataLength={posts?.length}
                next={() => {
                    setCurrentPage(currentPage + 1);
                }}
                scrollThreshold={1}
                height={700}
                hasMore={currentPage < totalPage}
                loader={<h4>Loading...</h4>}
                scrollableTarget="scrollableDiv"
                endMessage={
                    <p style={{ textAlign: "center" }}>
                        <b>Thats all for now. Do visit us again to see more.</b>
                    </p>
                }
            >
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post: any) => (
                        <PostCard key={post.id} post={post} setFlag={setFlag} flag={flag} />
                    ))}
                </div>
            </InfiniteScroll>
        </div>
    );
};

export default PostList;
