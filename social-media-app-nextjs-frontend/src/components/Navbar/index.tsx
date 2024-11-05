"use client"
import React, { useEffect, useState } from 'react'
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@nextui-org/react";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { handleNavigation } from '@/utils/utility';
import logo from "@/assets/image/logo.png"
import { useDispatch, useSelector } from 'react-redux';
import { AuthStateType } from '@/redux/actions-reducers/auth/initializeAuthState';
import path from 'path';
import Button from '../Button';
import toast from 'react-hot-toast';
import { handleResetAuthState } from '@/redux/actions-reducers/auth/auth';
import fetchApi from '@/utils/fetchApi';

interface NavbarComponentProps {
    showNavbar: boolean;
}
const NavbarComponent = ({ showNavbar, ...rest }: NavbarComponentProps) => {

    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const { isLoggedIn } = useSelector((state: { Auth: AuthStateType }) => state.Auth)
    const router = useRouter()
    const pathname = usePathname()
    const dispatch = useDispatch()
    const [navbarOptions, setNavbarOptions] = useState<any>([])
    useEffect(() => {
        setNavbarOptions([
            {
                id: 2,
                name: "Login",
                path: "/login",
                isActive: isLoggedIn === true ? false : true
            },
            {
                id: 3,
                name: "Sign Up",
                path: "/signup",
                isActive: isLoggedIn === true ? false : true
            },
            {
                id: 4,
                name: "Logout",
                isActive: isLoggedIn === true ? true : false
            },
            {
                id: 5,
                name: "Profile",
                path: "/profile",
                isActive: isLoggedIn === true ? true : false
            }
        ])
    }, [isLoggedIn])

    const menuItems = [
        "Profile",
        "Dashboard",
        "Activity",
        "Analytics",
        "System",
        "Deployments",
        "My Settings",
        "Team Settings",
        "Help & Feedback",
        "Log Out",
    ];

    const handleItemClick = async (item: { name: string }) => {
        try {

            if (item.name === "Logout") {
                localStorage.clear()
                dispatch(handleResetAuthState())
                handleNavigation({ path: '/login', router })
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('An unknown error occurred');
            }
        }
    }
    // return (<></>)
    return (<>
        <Navbar onMenuOpenChange={setIsMenuOpen} isBordered={true} className={`${showNavbar === false && 'hidden'}`}>
            <NavbarBrand >
                <p className="font-bold text-inherit text-xl cursor-pointer" onClick={e => handleNavigation({ path: "/", router })}>Social Media App</p>
            </NavbarBrand>

            <NavbarContent justify="end" className="hidden sm:flex">

                {navbarOptions.map((item: any) => {
                    if (item.isActive) {
                        return <NavbarItem key={item.id}>
                            {
                                item.path ?
                                    item.path === pathname ?
                                        <Button color="primary" variant="flat" label={item.name} />
                                        :
                                        <Link
                                            href={item.path}
                                            onClick={e => {
                                                e.preventDefault()
                                                handleNavigation({ path: item.path, router })
                                            }}
                                        >
                                            {item.name}
                                        </Link>
                                    :
                                    <p className='cursor-pointer' onClick={() => handleItemClick(item)}>{item.name}</p>
                            }
                        </NavbarItem>
                    }
                })}
                {/* <NavbarItem >

                    {pathname === "/login" ? (
                        <Button color="primary" variant="flat">
                            Login
                        </Button>
                    ) : <Link href="/login"
                        onClick={e => {
                            e.preventDefault()
                            handleNavigation({ path: "/login", router })
                        }}
                    >Login</Link>}

                </NavbarItem>
                <NavbarItem >
                    {pathname === "/signup" ? (
                        <Button color="primary" variant="flat">
                            Sign Up
                        </Button>
                    ) : <Link href="/signup"

                        onClick={e => {
                            e.preventDefault()
                            handleNavigation({ path: "/signup", router })
                        }}
                    >Sign Up</Link>}

                </NavbarItem> */}
            </NavbarContent >
            <NavbarMenuToggle
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                className="sm:hidden"
            />
            <NavbarMenu>
                {menuItems.map((item, index) => (
                    <NavbarMenuItem key={`${item}-${index}`}>
                        <Link
                            color={
                                index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"
                            }
                            className="w-full"
                            href="#"
                        >
                            {item}
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </Navbar>
    </>)
}

export default NavbarComponent
