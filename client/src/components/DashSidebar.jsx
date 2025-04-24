
import { Avatar, Sidebar, SidebarItem, SidebarItemGroup } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { HiDocumentText, HiUser, HiOutlineUserGroup } from 'react-icons/hi2'
import { HiArrowRight } from 'react-icons/hi2'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signOutSuccess } from '../redux/user/userSlice'
import { HiAnnotation, HiChartPie } from 'react-icons/hi'

const DashSidebar = () => {
    const location = useLocation()
    // console.log(location, "this is from the useLocation hook")
    const [tab, setTab] = useState('');
    const [click, setClick] = useState(false);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        // console.log(urlParams)
        const tabfromUrl = urlParams.get('tab'); //here tab is the name of the query parameter in the url.
        // console.log(tabfromUrl);
        if (tabfromUrl) {
            setTab(tabfromUrl);
        }
    }, [location.search])

    const dispatch = useDispatch();


    const handleSignOut = async () => {
        setClick(true);
        try {

            const response = await fetch('/api/user/signout', {
                method: 'POST',
            })
            const data = await response.json();
            if (!response.ok) {
                console.log(data.message);
            }
            else {
                dispatch(signOutSuccess());
                setClick(false);
            }

        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <Sidebar className='w-full md:w-56'>

            <SidebarItemGroup className='flex flex-col gap-1'>
                {currentUser?.isAdmin && (
                    <SidebarItem
                        as={Link}
                        to='/dashboard?tab=dash'
                        className={`${tab == 'dash' ? 'ring-2 ring-blue-500' : ''}`}
                        active={tab == 'dash' || !tab} icon={HiChartPie}>
                        DashBoard
                    </SidebarItem>
                )}
                <SidebarItem className={`${tab == 'profile' ? 'ring-2 ring-blue-500' : ''}`}
                    as={Link} to='/dashboard?tab=profile'
                    active={tab === 'profile'} icon={HiUser} label={`${currentUser?.isAdmin ? 'Admin' : 'User'}`} labelColor='dark'   >Profile</SidebarItem>

                {currentUser?.isAdmin && (
                    <SidebarItem
                        as={Link}
                        to='/dashboard?tab=posts'
                        className={`${tab == 'posts' ? 'ring-2 ring-blue-500' : ''}`}
                        active={tab == 'posts'} icon={HiDocumentText}>
                        Posts
                    </SidebarItem>
                )}
                {currentUser?.isAdmin && (
                    <SidebarItem
                        as={Link}
                        to='/dashboard?tab=comments'
                        className={`${tab == 'comments' ? 'ring-2 ring-blue-500' : ''}`}
                        active={tab == 'comments'} icon={HiAnnotation}>
                        Comments
                    </SidebarItem>
                )}
                {currentUser?.isAdmin && (
                    <SidebarItem
                        as={Link}
                        to='/dashboard?tab=users'
                        className={`${tab == 'users' ? 'ring-2 ring-blue-500' : ''}`}
                        active={tab == 'users'} icon={HiOutlineUserGroup}>
                        Users
                    </SidebarItem>
                )}

                <SidebarItem className={`${click ? 'ring-2 ring-blue-500' : ''}`} icon={HiArrowRight}
                    onClick={handleSignOut}
                >Sign Out</SidebarItem>



            </SidebarItemGroup >

        </Sidebar >
    )
}

export default DashSidebar