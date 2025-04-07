import { Avatar, Button, Dropdown, DropdownDivider, DropdownHeader, DropdownItem, Navbar, NavbarCollapse, NavbarLink, NavbarToggle, TextInput } from 'flowbite-react'
import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai'
import { FaMoon, FaSun } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { toggleTheme } from '../redux/theme/themeSlice'



const Header = () => {

    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch()
    const profilePicture = currentUser?.profilePicture || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
    // console.log(currentUser);
    const { theme } = useSelector((state) => state.theme);
    return (
        <Navbar className='border-b-2  '>
            <Link to='/' className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold
         dark:text-white'>
                <span className='px-2 py-1 bg-gradient-to-r from-indigo-500
                via-purple-500 to-pink-500 rounded-lg text-white '>Kasa's</span>
                Blog
            </Link>
            <form >
                <TextInput
                    type='text'
                    placeholder='Search...'
                    rightIcon={AiOutlineSearch}
                    className='hidden lg:inline'
                />
            </form>
            <Button className='w-12 h-10 p-0 lg:hidden rounded-full' color='light'>
                <AiOutlineSearch />
            </Button>
            <div className='flex gap-2 md:order-2'>
                <Button
                    className="w-12 h-10 rounded-3xl flex items-center justify-center border border-1 border-black-100 bg-gray-400 dark:bg-gray-700"
                    onClick={() => dispatch(toggleTheme())}
                >
                    <div className="flex items-center justify-center">
                        {theme === 'light' ? <FaMoon className="text-center" /> : <FaSun className="text-center" />}
                    </div>
                </Button>
                {currentUser ? (
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label={
                            <Avatar alt='user' img={profilePicture} rounded />
                        }
                        className='ml-2'
                    >
                        <DropdownHeader >
                            <span className="block text-sm font-bold">@{currentUser.username}</span>
                            <span className="block text-sm font-medium">{currentUser.email}</span>
                        </DropdownHeader>
                        <DropdownDivider />
                        <Link to='/dashboard?tab=profile'>
                            <DropdownItem>Profile</DropdownItem>
                        </Link>
                        <DropdownDivider />
                        <DropdownItem>Sign Out</DropdownItem>
                    </Dropdown>
                ) : (
                    <Link to='/sign-in'>
                        <Button className='bg-gradient-to-br from-purple-600 to-blue-500 text-white hover:bg-gradient-to-bl focus:ring-blue-300 dark:focus:ring-blue-800'>
                            SignIn
                        </Button>
                    </Link>
                )
                }

                <NavbarToggle></NavbarToggle>
            </div >


            <NavbarCollapse >
                <NavLink to='/' className={({ isActive }) => isActive ? "text-blue-500 font-normal text-sm md:text-lg" : " font-normal text-sm md:text-lg"} >Home</NavLink>
                <NavLink to='/about' className={({ isActive }) => isActive ? "text-blue-500 font-normal text-sm md:text-lg" : " font-normal text-sm md:text-lg"} >About</NavLink>
                <NavLink to='/projects' className={({ isActive }) => isActive ? "text-blue-500 font-normal text-sm md:text-lg" : " font-normal text-sm md:text-lg"}>Projects</NavLink>
            </NavbarCollapse>
        </Navbar >

    )
}

export default Header