
import { Avatar, Sidebar, SidebarItem, SidebarItemGroup } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { HiUser } from 'react-icons/hi2'
import { HiArrowRight } from 'react-icons/hi2'
import { Link, useLocation } from 'react-router-dom'

const DashSidebar = () => {
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
        <Sidebar className='w-full md:w-56'>

            <SidebarItemGroup className=''>
                <SidebarItem className='ring-2 ring-blue-500'
                    as={Link} to='/dashboard?tab=profile'
                    active={tab === 'profile'} icon={HiUser} label={'User'} labelColor='dark'   >Profile</SidebarItem>
                <SidebarItem className='ring-2 ring-blue-500 cursor-pointer' icon={HiArrowRight}  >Sign Out</SidebarItem>

            </SidebarItemGroup >

        </Sidebar >
    )
}

export default DashSidebar