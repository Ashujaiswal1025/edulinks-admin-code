import React, { useState,useEffect } from 'react'
import { useLocation } from 'react-router-dom';

function PublishNews() {

    const location = useLocation();
    const { newId } = location.state || {};
    const [newsData, setNewsData] = useState(null); // State for storing fetched news data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    useEffect(()=>{
       if(newId){
         fetchNewsData(newId)
       }
    },[])

    const fetchNewsData = async (id) => {
        try {
            const token = localStorage.getItem('authToken'); // Get the auth token from localStorage

            if (!token) {
                setError('Authentication token is missing');
                setLoading(false);
                return;
            }

            const response = await fetch(`https://edulink-backend-code.vercel.app/v1/common/fetchNews?newsId=${id}`, {
                method: 'GET', // Assuming a GET request for fetching the news
                headers: {
                    Authorization: `Bearer ${token}`, // Add token to headers
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch news'); // If response is not OK, throw an error
            }

            const data = await response.json(); // Parse the response JSON

            if (data.success) {
                setNewsData(data.news); // Set the fetched news data into state
                console.log(newsData.content);
                
            } else {
                setError(data.message || 'Something went wrong');
            }
        } catch (error) {
            setError(error.message || 'An error occurred while fetching the news');
        } finally {
            setLoading(false); // Set loading to false once the request is complete
        }
    };

    return (
        <div className="w-full flex flex-col justify-center items-center pt-32">
            <h1 className="w-full text-xl lg:text-[32px] font-adramalech text-white text-center my-3 md:mb-10">
                News
            </h1>
            <div className="w-full flex flex-col justify-center font-robotoCondensed items-center">
                <div className="md:w-10/12 flex flex-col rounded-md py-2">
                    <div className="flex justify-center items-center bg-white rounded-md drop-shadow-xl">
                        <img src={newsData?.image}></img>
                    </div>
                    <div className='w-full md:h-[286px] bg-white rounded-lg flex flex-col items-center drop-shadow-xl my-5 p-3'>
                        <textarea
                            value={newsData?.content} // Bind the content to the state
                            style={{ height: '75%' }}
                            className='placeholder-black text-xl font-medium resize-none p-2 w-full focus:outline-none'
                            readOnly
                        ></textarea>
                        <div className='w-full flex justify-end px-3'>
                            <button
                                className='bg-eduTheme text-white font-medium text-lg mt-6 px-3 py-1 rounded-md'
                            //onClick={handleSubmit} // Handle submit on click
                            >
                                Publish
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PublishNews