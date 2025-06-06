import React, { useEffect, useState } from 'react'
import { Button, Select, TextInput } from 'flowbite-react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import PostCard from '../components/PostCard'


const Search = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const [sideBarData, setSideBarData] = useState({
        searchTerm: '',
        sort: 'desc',
        category: 'uncategorized',

    })



    console.log(sideBarData);

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(false);


    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const sortFromUrl = urlParams.get('sort');
        const categoryFromUrl = urlParams.get('category');

        if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
            setSideBarData({
                searchTerm: searchTermFromUrl,
                sort: sortFromUrl,
                category: categoryFromUrl
            })

        }

        const fetchPosts = async () => {
            setLoading(true);
            const searchQuery = urlParams.toString();
            const response = await fetch(`/api/post/getPosts?${searchQuery}`)
            if (!response.ok) {
                setLoading(false);
                return;

            }

            if (response.ok) {
                const data = await response.json();
                setPosts(data.posts);
                setLoading(false);
                if (data.posts.length === 9) {
                    setShowMore(true);
                }
                else {
                    setShowMore(false);
                }
            }


        }

        fetchPosts();


    }, [location.search])

    const handleChange = (e) => {
        if (e.target.id === 'searchTerm') {
            setSideBarData({ ...sideBarData, searchTerm: e.target.value })
        }

        if (e.target.id === 'sort') {
            const sort = e.target.value || 'desc';
            setSideBarData({ ...sideBarData, sort: sort })

        }

        if (e.target.id === 'category') {
            const category = e.target.value || 'uncategorized';
            setSideBarData({ ...sideBarData, category: category });
        }
    }


    const handleShowMore = async () => {
        const numberOfPosts = posts.length;
        const startIndex = numberOfPosts;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const response = await fetch(`/api/post/getPosts?${searchQuery}`)
        if (!response.ok) {
            return;
        }
        if (response.ok) {
            const data = await response.json();
            setPosts((prevPosts) => {
                [...prevPosts, ...data.posts]
            })
            if (data.posts.length >= 9) {
                setShowMore(true);
            }
            else {
                setShowMore(false);

            }
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', sideBarData.searchTerm);
        urlParams.set('sort', sideBarData.sort);
        urlParams.set('category', sideBarData.category);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);

    }

    return (
        <div className='flex flex-col md:flex-row'>
            <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
                <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
                    <div className='flex items-center gap-2'>
                        <label>Search Term:</label>
                        <TextInput placeholder='Search...'
                            id='searchTerm'
                            type='text'
                            value={sideBarData.searchTerm}
                            onChange={handleChange}
                        ></TextInput>
                    </div>
                    <div className='flex items-center gap-2'>
                        <label className='font-semibold'>Sort:</label>
                        <Select className='w-full' onChange={handleChange} value={sideBarData.sort || 'desc'} id='sort'>
                            <option value="desc">Latest</option>
                            <option value="asc">Oldest</option>
                        </Select>
                    </div>
                    <div className='flex items-center gap-2'>
                        <label className='font-semibold'>Category:</label>
                        <Select className='w-full' onChange={handleChange} value={sideBarData.category || 'uncategorized'} id='category'>
                            <option value="uncategorized">Uncategorized</option>
                            <option value="reactjs">React.js</option>
                            <option value="nextjs">Next.js</option>
                            <option value="javascript">Javascript</option>


                        </Select>
                    </div>
                    <Button type='submit' className=" w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:bg-gradient-to-l focus:ring-purple-200 dark:focus:ring-purple-800">
                        Apply Filters
                    </Button>
                </form>
            </div>
            <div className='w-full'>
                <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5'>Posts Results:</h1>
                <div className='p-7 flex flex-wrap gap-4 '>
                    {
                        !loading && posts.length === 0 && (<p className='text-xl text-gray-500'>No posts found.</p>)
                    }
                    {
                        loading && (<p className='text-xl text-gray-500'>Loading...</p>)
                    }
                    <div className='flex flex-wrap justify-center gap-8'>
                        {!loading && posts.length > 0 && posts.map((post) => {
                            return (
                                <PostCard key={post._id} post={post} />
                            )
                        })}
                        {

                            showMore && <button
                                onClick={handleShowMore}
                                className='text-teal-500 text-lg hover:underline p-7 w-full'>Show More</button>

                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Search