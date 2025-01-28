import React, { useState, useEffect, useRef } from 'react'
import * as echarts from 'echarts';  // Import ECharts
import bot from "../Images/bot.png";
import parse from 'html-react-parser';
// import DOMPurify from 'dompurify';
import he from 'he';


function LeadsGenerated() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUserIndex, setSelectedUserIndex] = useState(null); // Track selected user index
    const [careerData, setCareerData] = useState(null); // Store the fetched career data
    const [universityData, setUniversityData] = useState(null);
    const [visaQueryData, setVisaQueryData] = useState(null);
    const [chatData, setChatData] = useState(null);
    const [activeSection, setActiveSection] = useState(null);

    const capitalizeFirstName = (userData) => {
        if (!userData || !userData.name) return ''; // Handle null or undefined userData or name
        return userData.name.charAt(0).toUpperCase(); // Return the first character, capitalized
    };

    const customStyles = {
        link: {
            color: 'blue', // Example color for the link
            textDecoration: 'underline',
        },
    };

    const handleUserSelect = (index) => {
        setSelectedUserIndex(index);  // Update the selected user
        setCareerData(null);           // Clear career-related data
        setUniversityData(null);       // Clear university-related data
        setVisaQueryData(null);        // Clear visa query-related data
        setChatData(null);             // Clear chat data
        setActiveSection(null)
    };
    

    const TickMark = () => {
        return (
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M20,50 L40,70 L80,30"
                    stroke="#87CEEB"
                    strokeWidth="15"
                    fill="none"
                />
            </svg>
        );
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('https://edulink-backend-code.vercel.app/v1/users', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Assuming token is stored in localStorage
                    }
                });
                console.log(`${localStorage.getItem('authToken')}`);


                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }

                const data = await response.json();
                setUsers(data.users); // Assuming the response contains the user data as an array
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const showResult = async (name) => {
        if (selectedUserIndex === null) {
            setError("Please select a user first.");
            return;
        }

        setActiveSection(name);

        // Log activeSection after the state is updated (via useEffect)

        try {
            let url = '';
            if (name === 'University/Course Shortlisting') {
                url = `https://edulink-backend-code.vercel.app/v1/common/fetchUniversityAssesment?id=${users[selectedUserIndex].id}`;
            } else if (name === 'Career Pathway Test') {
                url = `https://edulink-backend-code.vercel.app/v1/common/fetchUserCarrerWay?id=${users[selectedUserIndex].id}`;
            } else if (name === 'Visa Query Solver') {
                url = `https://edulink-backend-code.vercel.app/v1/common/fetchUserVisaQuery?id=${users[selectedUserIndex].id}`;
            } else if (name === 'Chat with Me!') {
                url = `https://edulink-backend-code.vercel.app/v1/common/fetchUserChat?id=${users[selectedUserIndex].id}`;
            }

            if (!url) {
                setError('Invalid module name');
                return;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch result');
            }

            const data = await response.json();
            console.log(data); // Log the response for debugging

            // Handle different data based on the section
            if (name === 'University/Course Shortlisting') {
                setUniversityData(data.fetchUniversityAssesment[0]);
                setCareerData(null);
                setVisaQueryData(null);
                setChatData(null);
            } else if (name === 'Career Pathway Test') {
                setCareerData(data.addCarrerDetails[0]);
                setUniversityData(null);
                setVisaQueryData(null);
                setChatData(null);
            } else if (name === 'Visa Query Solver') {
                setVisaQueryData(data.fetchUserVisaQuery[0]);
                setUniversityData(null);
                setCareerData(null);
                setChatData(null);
            } else if (name === 'Chat with Me!') {
                const html = data.fetchChat[0].messages[2].text;
                function decodeHtmlEntities(encodedString) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(encodedString, "text/html");
                    return doc.documentElement.textContent;
                }
                const decodedString = decodeHtmlEntities(html);
                var strippedHtml = decodedString.replace(/<[^>]+>/g, '');

                console.log('stripedHtml', strippedHtml);
                setChatData(data.fetchChat[0]);
                setUniversityData(null);
                setCareerData(null);
                setVisaQueryData(null);
            }

        } catch (error) {
            setError(`Error fetching results: ${error.message}`);
        }
    };

    // Use useEffect to log activeSection when it changes
    useEffect(() => {
        console.log('Active Section Updated:', activeSection);
    }, [activeSection]);

    const [chart, setChart] = useState(null);
    const chartRef = useRef(null);


    useEffect(() => {
        if (visaQueryData && visaQueryData.percentageChance !== null) {
            // Initialize chart only if percentageChance is available
            const myChart = echarts.init(chartRef.current);
            setChart(myChart);

            const option = {
                series: [
                    {
                        name: 'Percentage',
                        type: 'gauge',
                        splitNumber: 5,
                        itemStyle: {
                            color: 'rgba(55,215,217,1)',
                        },
                        progress: {
                            show: true,
                            width: 15,
                        },
                        axisLine: {
                            lineStyle: {
                                width: 15,
                            }
                        },
                        axisLabel: {
                            distance: 10,
                            fontSize: 14,
                        },
                        axisTick: {
                            length: 15,
                            lineStyle: {
                                color: '#000',
                                width: 0
                            }
                        },
                        splitLine: {
                            length: 0,
                            lineStyle: {
                                color: '#000',
                                width: 0
                            }
                        },
                        detail: {
                            formatter: '{value}%',
                            offsetCenter: [0, '70%'],
                            fontSize: 30,
                            fontWeight: 'bold',
                            color: 'rgba(55,215,217,1)',
                            backgroundColor: 'transparent',
                            borderRadius: 10,
                            valueAnimation: true,
                        },
                        anchor: {
                            show: true,
                            showAbove: true,
                            size: 15,
                            itemStyle: {
                                color: 'rgba(8, 114, 116, 1)'
                            }
                        },
                        pointer: {
                            length: '70%',
                            width: 4,
                            itemStyle: {
                                color: 'rgba(55,215,217,1)'
                            }
                        },
                        data: [
                            {
                                value: visaQueryData.percentageChance,
                            }
                        ]
                    }
                ]
            };

            myChart.setOption(option);

            window.addEventListener('resize', () => {
                myChart.resize();
            });

            return () => {
                window.removeEventListener('resize', () => {
                    myChart.resize();
                });
                myChart.dispose();
            };
        }
    }, [visaQueryData?.percentageChance]); // Make sure it only runs when visaQueryData is updated




    return (
        <div className='w-full flex flex-col justify-center items-center pt-32'>
            <h1 className='w-full text-xl lg:text-[32px] font-adramalech text-white text-center my-3 md:mb-10'>
                Leads Generated
            </h1>
            <div className='w-full flex flex-col justify-center font-robotoCondensed items-center'>
                <div className='md:w-[95%] bg-white flex rounded-md drop-shadow-lg'>
                    <div className='w-[25%] py-2'>
                        <h1 className='text-xl lg:text-2xl font-robotoCondensed my-3 font-bold pl-5'>
                            Names
                        </h1>
                        {loading ? (
                            <p className="text-xl text-center font-medium">Loading...</p> // Show Loading message when loading is true
                        ) : error ? (
                            <p className="text-red-500">Error: {error}</p> // Show error message if there's an error
                        ) : users.length > 0 ? (
                            users.map((user, index) => (
                                <div
                                    key={index}
                                    className={`cursor-pointer my-1 pl-5 py-2 ${selectedUserIndex === index ? 'bg-eduTheme' : 'bg-eduThemeOPL'}`}
                                    onClick={() => handleUserSelect(index)} // Clear data when a new user is selected
                                >
                                    <p className="text-xl font-medium">{user.name}</p>
                                    <p className="text-xl">{user.phoneNumber}</p>
                                    <p className="text-lg text-wrap">{user.email}</p>
                                </div>
                            ))
                        ) : (
                            <p className="pl-8 text-xl font-medium">No users found</p> // Show message if no users are available after loading
                        )}
                    </div>
                    <div className='w-[30%] border-l-[3px] border-eduTheme py-2'>
                        <h1 className='text-xl lg:text-2xl font-robotoCondensed my-3 font-bold pl-5'>
                            Module Attempted
                        </h1>

                        {selectedUserIndex !== null && users[selectedUserIndex] && (
                            <>
                                <div className={`flex items-center justify-between flex-wrap lg:flex-nowrap mt-1 pl-5 py-0.5 ${activeSection === 'University/Course Shortlisting' ? 'bg-eduTheme' : 'bg-eduThemeOPL'}`}>
                                    <div className='flex justify-center items-center gap-4'>
                                        <div className='w-5 min-w-5 h-5 bg-white'>
                                            {users[selectedUserIndex].isUniversityAssesmentUsed ? (
                                                <TickMark />
                                            ) : ''}
                                        </div>
                                        <div className='p-1'>
                                            <h2 className='w-4/5 text-xl font-medium'>University/Course Shortlisting</h2>
                                        </div>
                                    </div>
                                    <button className='bg-white lg:text-nowrap text-eduTheme mr-5 text-sm font-bold py-1 px-2.5 rounded' disabled={!users[selectedUserIndex].isUniversityAssesmentUsed} onClick={() => showResult('University/Course Shortlisting')}>Explore &gt;</button>
                                </div>
                                <div className={`flex items-center justify-between flex-wrap mt-1 pl-5 py-0.5 ${activeSection === 'Career Pathway Test' ? 'bg-eduTheme' : 'bg-eduThemeOPL'}`}>
                                    <div className='flex justify-center items-center'>
                                        <div className='w-5 min-w-5 h-5 bg-white'>
                                            {users[selectedUserIndex].isCarrerPathwayAssesmentUsed ? (
                                                <TickMark />
                                            ) : ''}
                                        </div>
                                        <div className='w-full ml-4 p-1'>
                                            <h2 className='w-4/5 text-xl font-medium'>Career Pathway Test</h2>
                                        </div>
                                    </div>
                                    <button className='bg-white text-eduTheme mr-5 text-sm font-bold py-1 px-2.5 rounded' disabled={!users[selectedUserIndex].isCarrerPathwayAssesmentUsed} onClick={() => showResult('Career Pathway Test')}>Explore &gt;</button>
                                </div>
                                <div className={`flex items-center justify-between flex-wrap mt-1 pl-5 py-0.5 ${activeSection === 'Visa Query Solver' ? 'bg-eduTheme' : 'bg-eduThemeOPL'}`}>
                                    <div className='flex justify-center items-center'>
                                        <div className='w-5 min-w-5 h-5 bg-white'>
                                            {users[selectedUserIndex].isVisaQueryAssesmentUsed ? (
                                                <TickMark />
                                            ) : ''}
                                        </div>
                                        <div className='w-full ml-4 p-1'>
                                            <h2 className='w-4/5 text-xl font-medium'>Visa Query Solver</h2>
                                        </div>
                                    </div>
                                    <button className='bg-white text-eduTheme mr-5 text-sm font-bold py-1 px-2.5 rounded' disabled={!users[selectedUserIndex].isVisaQueryAssesmentUsed} onClick={() => showResult('Visa Query Solver')}>Explore &gt;</button>
                                </div>
                                <div className={`flex items-center justify-between flex-wrap mt-1 pl-5 py-0.5 ${activeSection === 'Chat with Me!' ? 'bg-eduTheme' : 'bg-eduThemeOPL'}`}>
                                    <div className='flex justify-center items-center'>
                                        <div className='w-5 min-w-5 h-5 bg-white'>
                                            {users[selectedUserIndex].isChatBotUsed ? (
                                                <TickMark />
                                            ) : ''}
                                        </div>
                                        <div className='w-full ml-4 p-1'>
                                            <h2 className='w-4/5 text-xl font-medium'>Chat with Me!</h2>
                                        </div>
                                    </div>
                                    <button className='bg-white text-eduTheme mr-5 text-sm font-bold py-1 px-2.5 rounded' disabled={!users[selectedUserIndex].isChatBotUsed} onClick={() => showResult('Chat with Me!')}>Explore &gt;</button>
                                </div>
                            </>
                        )}
                    </div>
                    <div className='w-[45%] border-l-[3px] border-eduTheme py-2'>
                        {(careerData && careerData.selectedQuestion && careerData.selectedQuestion.length > 0 && careerData.topCarrers && careerData.topCarrers.length > 0) ? (
                            <>
                                <div className='w-full'>
                                    <h1 className='text-xl lg:text-2xl font-robotoCondensed my-3 font-bold pl-8'>
                                        Questions
                                    </h1>
                                    <div className='px-8'>
                                        {/* Render Career Pathway Test Questions */}
                                        {careerData.selectedQuestion.map((question, index) => (
                                            <div key={index} className='mb-4'>
                                                <h2 className='text-base font-medium'>{`Q${index + 1}. ${question.question}`}</h2>
                                                <div className='flex items-center bg-eduThemeOption px-1 rounded-sm py-0.5 shadow-2xl'>
                                                    <div className='m-3 w-4 h-4 border-2 border-eduThemeOPL flex justify-center items-center rounded-full'>
                                                        <div className='w-2 h-2 rounded-full bg-eduThemeCircle'></div>
                                                    </div>
                                                    <h2 className='text-sm'>{question.selectedOption}</h2>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className='w-full bg-eduThemeOPL flex flex-col justify-center items-center py-2'>
                                    <h1 className='w-full text-center text-xl font-robotoCondensed my-3 font-bold'>
                                        Here are the Top 3 Careers for you in {careerData?.country}
                                    </h1>
                                    {careerData?.topCarrers?.map((career, index) => (
                                        <div
                                            key={career}
                                            className="w-[297px] h-[290px] m-4 flex flex-col justify-center items-center text-white bg-white font-bold rounded-md border-b-[3px] border-eduTheme shadow-lg"
                                        >
                                            {careerData.filteredImages && (
                                                <img
                                                    src={`https://edulinks.io/wp-content/uploads/2024/10/${careerData?.filteredImages.find(item => item.course === career)?.imgPath}`}
                                                    alt='img'
                                                    className='w-[297px] h-[170px] rounded-md'
                                                />
                                            )}
                                            <h1
                                                className='text-2xl h-28 flex justify-center items-center font-light font-adramalech text-wrap my-2 text-center px-1'
                                                style={{
                                                    background: 'linear-gradient(to right, #53C2C2 0%, #248182 100%)',
                                                    WebkitBackgroundClip: 'text',
                                                    color: 'transparent',
                                                }}
                                            >
                                                {career}
                                            </h1>
                                            <a href={`https://edulinks.io/${careerData.country.toLowerCase()}-${careerData?.country.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '')}/`}>
                                                <button className='px-4 py-[2px] text-eduTheme border border-eduTheme rounded-md mb-2'>
                                                    Explore <span> &gt;</span>
                                                </button>
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : universityData && universityData.selectedQuestion && universityData.selectedQuestion.length > 0 && universityData.topCourses && universityData.topUniversities ? (
                            <>
                                <div className='w-full'>
                                    <h1 className='w-full text-xl lg:text-2xl font-robotoCondensed my-3 font-bold pl-8'>
                                        Questions
                                    </h1>
                                    <div className='px-8'>
                                        {/* Render University/Course Shortlisting Questions */}
                                        {universityData.selectedQuestion.map((question, index) => (
                                            <div key={index} className='mb-4'>
                                                <h2 className='text-base font-medium'>
                                                    {`Q${index + 1}. `}
                                                    {index === 0 ? "Which country do you want to choose?" : question.question}
                                                </h2>
                                                <div className='flex items-center bg-eduThemeOption px-1 rounded-sm py-0.5 shadow-2xl'>
                                                    <div className='m-3 w-4 h-4 border-2 border-eduThemeOPL flex justify-center items-center rounded-full'>
                                                        <div className='w-2 h-2 rounded-full bg-eduThemeCircle'></div>
                                                    </div>
                                                    <h2 className='text-sm'>
                                                        {index === 0 ? universityData.country : question.answer}
                                                    </h2>
                                                </div>
                                            </div>
                                        ))}

                                    </div>
                                    {/* Render Top 3 Universities */}
                                    <div className='w-full bg-eduThemeOPL flex flex-col justify-center items-center py-2'>
                                        <h1 className='w-full text-xl text-center font-robotoCondensed mt-12 font-bold'>
                                            Here are the Top 3 Universities for you in {universityData?.country}
                                        </h1>
                                        {universityData?.topUniversities?.map((university, index) => (
                                            <div
                                                key={university}
                                                className="w-[378px] h-[290px] m-4 py-3 flex flex-col justify-center items-center text-white bg-white font-bold border-b-[3px] border-eduTheme shadow-lg"
                                            >
                                                {/* Matching image */}
                                                {universityData.filteredImages && (
                                                    <img
                                                        src={`https://edulinks.io/wp-content/uploads/2024/10/${universityData.filteredImages.find(item => item.universityName === university)?.imgPath}`}
                                                        alt={university}
                                                        className="w-[354px] h-[174px] rounded-md"
                                                    />
                                                )}
                                                <h1
                                                    className="text-xl text-black h-28 flex justify-center items-center font-robotoCondensed text-wrap my-2 text-center px-1"
                                                >
                                                    {university}
                                                </h1>
                                                <a
                                                    href={`https://edulinks.io/${universityData?.country === "New Zealand" ? "nz" : universityData?.country.toLowerCase()}-${university.normalize("NFD")
                                                        .replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '-').replace(/&/g, '')}/`}
                                                >
                                                    <button className="px-4 py-[2px] text-eduTheme border border-eduTheme rounded-md mb-2">
                                                        Explore  <span> &gt; </span>
                                                    </button>
                                                </a>
                                            </div>
                                        ))}
                                        <h1 className='text-xl text-center font-robotoCondensed my-5 font-bold pl-8'>
                                            Here are the Top 3 Courses for you in {universityData?.country}
                                        </h1>
                                        {universityData?.topCourses?.map((course, index) => (
                                            <div
                                                key={course}
                                                className="w-[378px] h-[170px] py-3 m-4 flex flex-col justify-center items-center text-white bg-white font-bold rounded-md border-b-[3px] border-eduTheme shadow-lg"
                                            >
                                                <h1
                                                    className="text-xl h-16 text-black flex justify-center items-center font-robotoCondensed text-wrap my-2 text-center px-1"
                                                >
                                                    {course}
                                                </h1>
                                                <a
                                                    href="https://cal.com/edulink-9gf5fp/30min"
                                                >
                                                    <button className="px-4 py-[2px] text-eduTheme border border-eduTheme rounded-md mb-2">
                                                        Contact
                                                        <span> &gt; </span>
                                                    </button>
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : visaQueryData && visaQueryData.selectedQuestion && visaQueryData.selectedQuestion.length > 0 && visaQueryData.percentageChance !== null ? (
                            <>
                                <div className='w-full pb-3'>
                                    <h1 className='text-xl lg:text-2xl font-robotoCondensed my-3 font-bold pl-8'>
                                        Questions
                                    </h1>
                                    <div className='px-8'>
                                        {/* Render University/Course Shortlisting Questions */}
                                        {visaQueryData.selectedQuestion.map((question, index) => (
                                            <div key={index} className='mb-4'>
                                                <h2 className='text-base font-medium'>{`Q${index + 1}. ${question.question}`}</h2>
                                                <div className='flex items-center bg-eduThemeOption px-1 rounded-sm py-0.5 shadow-lg'>
                                                    <div className='m-3 w-4 h-4 border-2 border-eduThemeOPL flex justify-center items-center rounded-full'>
                                                        <div className='w-2 h-2 rounded-full bg-eduThemeCircle'></div>
                                                    </div>
                                                    <h2 className='text-sm'>{question.selectedOption}</h2>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className='w-full flex flex-col justify-center items-center py-2'>
                                    <h1 className='w-full text-2xl text-center font-adramalech mt-12 px-3'>
                                        Based on your profile assessment, your likelihood of securing a {visaQueryData.country} Study Visa is
                                    </h1>
                                    {/* ECharts Gauge */}
                                    {visaQueryData?.percentageChance !== null ? (
                                        <div
                                            ref={chartRef}
                                            className="mt-2 md:w-4/5 w-full flex justify-center items-center"
                                            style={{ height: '300px' }}  // Set default height
                                        ></div>
                                    ) : (
                                        <p>Loading...</p>
                                    )}
                                    <h1 className='w-full text-xl text-center font-adramalech my-2 px-8'>
                                        {visaQueryData?.subject}
                                    </h1>
                                    <p className='w-full text-base text-center font-robotoCondensed font-medium px-5'>
                                        {visaQueryData?.content}
                                    </p>

                                </div>
                            </>
                        ) : chatData && chatData.messages && chatData.messages.length > 0 ? (
                            <>
                                <div className='w-full h-full'>
                                    <h1 className='text-xl lg:text-2xl font-robotoCondensed my-3 font-bold pl-8'>
                                        Chat with Edulinks
                                    </h1>
                                    <div className='px-4 py-2 bg-eduThemeOPL space-y-4'>
                                        {chatData.messages.map((message, index) => (
                                            <div
                                                key={index}
                                                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                                            >
                                                {message.role === "bot" && (
                                                    <div className="p-2">
                                                        <img src={bot} alt="bot" className="w-[51px] h-[48px]" />
                                                    </div>
                                                )}
                                                <div
                                                    className={`max-w-xs ${message.role === 'bot' ? "py-5 px-2" : "p-2"} rounded-lg bg-white`}
                                                    style={{
                                                        maxWidth: "60%", // Adjusts max width of the bubble
                                                        minWidth: "10%", // Ensures bubble doesn't shrink too small
                                                        wordBreak: "break-word", // Wraps long words properly
                                                        overflowWrap: "break-word", // Ensures text doesn't overflow
                                                        padding: "12px", // Ensure sufficient padding
                                                    }}
                                                >
                                                    {he.decode(message.text).replace(/<[^>]*>/g, '')}
                                                </div>
                                                {message.role === "user" && (
                                                    <div className="w-10 ml-3 h-10 rounded-full bg-eduTheme text-white font-bold text-lg flex justify-center items-center">
                                                        {capitalizeFirstName(users[selectedUserIndex])}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p></p> // Show this if no data for career, university, visa, or chat
                        )}
                    </div>

                </div>
            </div>
        </div>

    )
}

export default LeadsGenerated