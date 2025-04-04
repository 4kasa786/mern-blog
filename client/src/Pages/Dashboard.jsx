import React, { useState } from 'react'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import DashProfile from '../components/DashProfile'
import DashSidebar from '../components/DashSidebar'

const Dashboard = () => {
    const location = useLocation()
    // console.log(location, "this is from the useLocation hook")
    const [tab, setTab] = useState('');
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        // console.log(urlParams)
        const tabfromUrl = urlParams.get('tab'); //here tab is the name of the query parameter in the url.
        // console.log(tabfromUrl);
        if (tabfromUrl) {
            setTab(tabfromUrl);
        }
    }, [location.search])

    return (
        <div className='min-h-screen flex flex-col md:flex-row '>
            <div className='md:w-56'>
                {/* {sidebar} */}
                <DashSidebar />
            </div>
            {/* {profile} */}
            {tab === 'profile' && <DashProfile />}

        </div>
    )
}

export default Dashboard