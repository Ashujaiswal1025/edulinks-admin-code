import React, { useState } from 'react';

function AddNews() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [content, setContent] = useState(''); // To handle the content input

    // Handle the file selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file)); // Preview the selected image
        }
    };

    // Trigger the file input when the plus sign is clicked
    const handleSvgClick = () => {
        document.getElementById('fileInput').click(); // Simulate click on file input
    };

    // Handle form submission
    const handleSubmit = async () => {
        // Validate content and selected image before submission
        if (!content || !selectedImage) {
            alert('Please provide both content and an image.');
            return;
        }

        // Create FormData to send both image and content in a POST request
        const formData = new FormData();
        const imageFile = document.getElementById('fileInput').files[0]; // Get the selected file

        formData.append('image', imageFile); // Append image to formData
        formData.append('content', content); // Append content to formData

        try {
            const token = 'newsId'; // Replace with your actual token

            const response = await fetch('https://edulink-backend-code.vercel.app/v1/common/addNews', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`, // Include token in headers
                },
                body: formData, // Attach formData to the request body
            });

            const data = await response.json(); // Parse the response JSON

            if (data.success) {
                alert('News added successfully!');
                // Reset form fields after submission if needed
                setSelectedImage(null);
                setContent('');
            } else {
                alert('Failed to add news.');
            }
        } catch (error) {
            console.error('Error adding news:', error);
            alert('Something went wrong.');
        }
    };

    return (
        <div className="w-full flex flex-col justify-center items-center pt-32">
            <h1 className="w-full text-xl lg:text-[32px] font-adramalech text-white text-center my-3 md:mb-10">
                Add News
            </h1>
            <div className="w-full flex flex-col justify-center font-robotoCondensed items-center">
                <div className="md:w-10/12 flex flex-col rounded-md py-2">
                    <div className='flex'>
                        <div className="w-[200px] h-[200px] flex justify-center items-center bg-white rounded-md drop-shadow-xl">
                            {selectedImage ? (
                                <img
                                    src={selectedImage}
                                    alt="Selected"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div
                                    onClick={handleSvgClick} // Trigger file input click when SVG is clicked
                                    className="bg-eduTheme flex justify-center items-center text-white rounded-full w-16 h-16 cursor-pointer"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        width="28"
                                        height="28"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="7"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    >
                                        <path d="M12 5v14M5 12h14" />
                                    </svg>
                                </div>
                            )}
                            <input
                                id="fileInput"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }} // Hide the file input element
                            />
                        </div>
                        <div className='p-6'>
                            <h2 className='text-xl font-medium'>Add Image</h2>
                            <h2 className='text-xl font-medium'>(Size 200 px X 200 px)</h2>
                        </div>
                    </div>
                    <div className='w-full md:h-[286px] bg-white rounded-lg flex flex-col items-center drop-shadow-xl my-5 p-3'>
                        <textarea
                            placeholder='Type Content'
                            value={content} // Bind the content to the state
                            onChange={(e) => setContent(e.target.value)} // Update content state
                            style={{ height: '75%' }}
                            className='placeholder-black text-xl font-medium resize-none p-2 w-full focus:outline-none'
                        ></textarea>
                        <button
                            className='bg-eduTheme text-white font-medium text-lg mt-6 px-3 py-1 rounded-md'
                            onClick={handleSubmit} // Handle submit on click
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddNews;
