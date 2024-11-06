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

const NavbarComponent = () => {

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
            }
        ])
    }, [isLoggedIn])

    const handleItemClick = async (item: { name: string }) => {
        try {

            if (item.name === "Logout") {
                localStorage.clear()
                dispatch(handleResetAuthState())
                handleNavigation({ path: '/login', router })
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message, { id: "copy" });
            } else {
                toast.error('An unknown error occurred', { id: "copy" });
            }
        }
    }
    return (<>
        <Navbar isBordered={true}>
            <NavbarBrand >
                <p className="font-bold text-inherit text-md sm:text-xl cursor-pointer " onClick={e => handleNavigation({ path: "/", router })}>Social Media App</p>
            </NavbarBrand>

            <NavbarContent justify="end" className="">

                {navbarOptions.map((item: any) => {
                    if (item.isActive) {
                        return <NavbarItem key={item.id}>
                            {
                                item.path ?
                                    item.path === pathname ?
                                        <Button color="primary" variant="flat" size="sm" label={item.name} />
                                        :
                                        <Link
                                            href={item.path}
                                            className='text-sm'
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

            </NavbarContent>
        </Navbar>
    </>)
}

export default NavbarComponent
