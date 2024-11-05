
import PostCard from './PostCard';

const PostList = ({ posts, setFlag, flag }: any) => {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: any) => (
                <PostCard key={post.id} post={post} setFlag={setFlag} flag={flag} />
            ))}
        </div>
    );
};

export default PostList;
