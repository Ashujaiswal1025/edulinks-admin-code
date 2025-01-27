import React from 'react'



function PublishNews() {

    return (
        <div className="w-full flex flex-col justify-center items-center pt-32">
            <h1 className="w-full text-xl lg:text-[32px] font-adramalech text-white text-center my-3 md:mb-10">
                News
            </h1>
            <div className="w-full flex flex-col justify-center font-robotoCondensed items-center">
                <div className="md:w-10/12 flex flex-col rounded-md py-2">
                    <div className="flex justify-center items-center bg-white rounded-md drop-shadow-xl">
                        <img src=''></img>
                    </div>
                    <div className='w-full md:h-[286px] bg-white rounded-lg flex flex-col items-center drop-shadow-xl my-5 p-3'>
                        <textarea
                            //value={content} // Bind the content to the state
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