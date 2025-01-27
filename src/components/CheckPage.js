import React from 'react'
import { useNavigate } from 'react-router-dom'

function CheckPage() {

   const navigate = useNavigate();

    return (
        <div className='w-full flex flex-col justify-center items-center pt-32'>
            <h1 className='text-xl lg:text-[32px] font-adramalech text-white text-center my-3 md:mb-10'>
                What you want to check?
            </h1>
            <div className='w-full flex flex-col justify-center font-robotoCondensed items-center'>
                <div className='w-4/5 md:w-[620px] flex flex-col justify-center items-center bg-white rounded-lg my-3 p-7 drop-shadow-lg'>
                    <h2 className='text-center text-2xl font-bold'>
                        Leads generated
                    </h2>
                    <button className='bg-eduTheme text-white font-semibold text-lg mt-4 px-2.5 rounded-md' onClick={()=>navigate('/check-page/leads-generated')}>Explore &gt;</button>
                </div>
                <div className='w-4/5 md:w-[620px] flex flex-col justify-center items-center bg-white rounded-lg my-3 p-7 drop-shadow-lg'>
                    <h2 className='text-center text-2xl font-bold'>
                        Add News
                    </h2>
                    <button className='bg-eduTheme text-white font-semibold text-lg mt-4 px-2.5 rounded-md' onClick={()=>navigate('/check-page/add-news')}>Add Now &gt;</button>
                </div>
            </div>
        </div>
    )
}

export default CheckPage