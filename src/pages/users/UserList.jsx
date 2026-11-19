import React, { useContext, useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  ChevronsLeft, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsRight 
} from 'lucide-react';
import api from '@/service/api';
import { Loader2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { GlobleContext } from '@/globleContext/GlobleContext';
import { IoSearchOutline } from "react-icons/io5";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdDelete, MdEditDocument, MdVpnKey } from "react-icons/md";

import HasPermission from '@/components/HasPermission';

const UserList = () => {
    const {isDarkMode} = useContext(GlobleContext)
    const [userData,setUserData] = useState([]);
    const [Loading,setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate();
    const [search,setSearch] = useState('');

    const [perPage,setPerPage] = useState(10);
    const [pagination,setPagination] = useState({
        currenPage :1,
        lastPage :1,
        from :0,
        to :0,
        total:0
    });

    useEffect(() =>{
        const delay = setTimeout(() => {
            getData(1,perPage,search)
        },500);
        return () => clearTimeout(delay)
    },[perPage,search]);

    const getData = async(page=pagination.currenPage, limit = perPage, searchTem = search ) =>{
        try{
            setLoading(true)
            const res = await api.get(`users?page=${page}&per_page=${limit}&search=${searchTem}`)
            const result = res.data.data;
            setUserData(result.data)
            setPagination({
                currenPage: result.current_page,
                lastPage: result.last_page,
                from: result.from,
                to: result.to,
                total: result.total
            })
        }
        catch(error){
            console.log(error);
            setLoading(false);
        }
        finally{
            setLoading(false);
        }
    };

    const handleDlete = async(id) => {
        const isConfirm = window.confirm("Do you want to delete this record !!");
        if(isConfirm){
            try{
                setLoading(true)
                const res = await api.delete(`users/${id}`)
                getData();
            }
            catch(error){
                console.log(error)
            }
            finally{
                setLoading(false)
            }
        }
    }

    // A small helper to construct image URL if needed
    const getProfileUrl = (path) => {
        if (!path) return "https://ui-avatars.com/api/?name=User&background=random";
        if (path.startsWith('http')) return path;
        // Adjust the base URL as per your project configuration
        return `http://127.0.0.1:8000/storage/${path}`;
    };

    return (
        <div>
            <div>
                <div className={`flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 bg-blend-darken p-4 mb-3 ${isDarkMode ? "bg-blue-500/20" : "bg-blue-500/80"}  rounded-sm`}>
                    <div className={`text-2xl text-white text-center sm:text-left w-full sm:w-auto ${isDarkMode ? " text-white/60" : "text-white"}`}>
                        Manage Users
                    </div>
                    
                    <div className='flex flex-wrap justify-center sm:justify-end gap-3 sm:gap-5 items-center w-full sm:w-auto'>
                        <div className='relative'>
                            <div className="relative w-full">
                                <input 
                                    type="text"
                                    value={search}
                                    onChange={(e)=>setSearch(e.target.value)}
                                    placeholder="search name or email ..." 
                                    className={`peer w-full rounded-sm border-2 ${isDarkMode ? "bg-black/30 text-white" : "bg-white"} py-1 pl-2 pr-10 text-black/70 outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-400`}
                                />
                                <div className={`pointer-events-none absolute inset-y-0 right-2 flex items-center text-lg ${isDarkMode ? " text-white/60 font-bold" : "text-black/30"} peer-focus:text-blue-500`}>
                                    <IoSearchOutline />
                                </div>
                            </div>
                        </div>
                        <div >
                            <select name="" id=""
                                value={perPage} 
                                onChange={(e)=>{
                                    const newPage = Number(e.target.value);
                                    setPerPage(newPage);
                                }}
                                className={`${isDarkMode ? "bg-black/30 text-white/60" : "bg-white"} px-4 md:px-2 py-1.5 md:py-1 rounded-xs cursor-pointer`}
                            >
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="30">30</option>
                                <option value="40">40</option>
                                <option value="50">50</option>
                            </select>
                        </div>
                        <HasPermission permission="users.create">
                            <button 
                                onClick={()=>navigate('/user/create')}
                                className={`flex items-center gap-2 ${isDarkMode ? "bg-black/30 text-white/60" : "bg-white"} rounded-xs hover:bg-pink-300 cursor-pointer hover:text-white text-blue-500/80 px-10 md:px-2 py-1.5 md:py-1 transition-all`}
                            >
                                <span className='text-xl font-bold'><IoMdAddCircleOutline /></span>
                                <span>Add New</span>
                            </button>
                        </HasPermission>
                    </div>
                </div>
                
                <div className="relative">
                    <Table className={`${isDarkMode ? "bg-black/30 text-white/60" : "bg-white"} ${Loading ? "opacity-60 pointer-events-none" : "opacity-100"} transition-opacity duration-300`}>
                        <TableHeader  className="text-lg text-white border-2 border-blue-500/80 ">
                            <TableRow className={`${isDarkMode ? "bg-pink-500/20" : "bg-blue-500/80 hover:bg-blue-500/80 text-white"} w-full`}>
                                <TableHead className={`${isDarkMode ? "text-white/70" : "text-white"} w-[100px]`}>No</TableHead>
                                <TableHead className={`${isDarkMode ? "text-white/70" : "text-white"}`}>Name</TableHead>
                                <TableHead className={`${isDarkMode ? "text-white/70" : "text-white"}`}>Email</TableHead>
                                <TableHead className={`${isDarkMode ? "text-white/70" : "text-white"}`}>Password</TableHead>
                                <TableHead className={`${isDarkMode ? "text-white/70" : "text-white"}`}>Role</TableHead>
                                <TableHead className={`${isDarkMode ? "text-white/70" : "text-white"}`}>Status</TableHead>
                                <TableHead className={`${isDarkMode ? "text-white/70" : "text-white"}`}>Permission</TableHead>
                                <TableHead className={`${isDarkMode ? "text-white/70" : "text-white"}  text-center w-30`}>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className='border-2'>
                            {userData.map((item,index) => (
                                <TableRow key={index} className="border-1">
                                    <TableCell>{(pagination.currenPage - 1) * perPage + index + 1}</TableCell>
                                    <TableCell className="font-medium text-slate-700 dark:text-slate-300">{item.name}</TableCell>
                                    <TableCell className="text-slate-400">{item.email}</TableCell>
                                    <TableCell>
                                        <div className="bg-slate-50 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-sm text-xs truncate w-24">
                                            $2y$12$M0lkWo1xQ...
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="bg-indigo-100 text-indigo-500 font-medium px-2 py-1 rounded-sm text-xs">
                                            {item.role || 'Casheir'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {item.status ? (
                                            <span className="bg-green-100 text-green-500 font-medium px-2 py-1 rounded-sm text-xs">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="bg-red-100 text-red-500 font-medium px-2 py-1 rounded-sm text-xs">
                                                Inactive
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <button
                                            onClick={() => navigate(`/user/permission/${item.id}`)}
                                            type="button"
                                            aria-label="Permissions"
                                            className="group cursor-pointer text-center flex h-8 w-12 items-center justify-center rounded-sm border border-transparent bg-green-100 text-green-500 transition-all duration-200 hover:border-green-200 hover:bg-green-50 active:scale-95"
                                        >
                                            <MdVpnKey className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                                        </button>
                                    </TableCell>
                                    <TableCell className=" flex justify-center ">
                                        <div className="flex items-center gap-1 ">
                                            <HasPermission permission="users.edit">
                                                <button
                                                    onClick={()=>navigate(`/user/edite/${item.id}`)}
                                                    type="button"
                                                    aria-label="Edit"
                                                    className="group cursor-pointer flex h-8 w-8 items-center justify-center rounded-full border border-transparent bg-green-100 text-green-500 transition-all duration-200 hover:border-green-200 hover:bg-green-200 active:scale-95 dark:hover:border-green-500/30 dark:bg-green-500/10 dark:hover:bg-green-500/20"
                                                >
                                                    <MdEditDocument className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                                                </button>
                                            </HasPermission>
                                            <HasPermission permission="users.delete">
                                                <button
                                                    onClick={()=>handleDlete(item.id)}
                                                    type="button"
                                                    aria-label="Delete"
                                                    className="group cursor-pointer flex h-8 w-8 items-center justify-center rounded-full border border-transparent bg-red-100 text-red-500 transition-all duration-200 hover:border-red-200 hover:bg-red-200 active:scale-95 dark:hover:border-red-500/30 dark:bg-red-500/10 dark:hover:bg-red-500/20"
                                                >
                                                    <MdDelete className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                                                </button>
                                            </HasPermission>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {Loading && (
                        <div className="absolute inset-0 flex justify-center items-center bg-black/5 dark:bg-white/5 z-10 mt-30">
                            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                        </div>
                    )}
                </div>

                <div className='flex justify-end'>
                    <div className="flex items-center mt-2  gap-1.5 p-1 bg-white border border-slate-200 rounded-sm shadow-xs select-none w-fit">
                        <button
                            type="button"
                            title="First page"
                            disabled={Loading || pagination.currenPage <= 1}
                            onClick={() => getData(1)}
                            className="inline-flex cursor-pointer items-center justify-center h-8 w-8 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 active:scale-95 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronsLeft className="w-4 h-4" />
                        </button>
                        
                        <button
                            type="button"
                            title="Previous page"
                            disabled={Loading || pagination.currenPage <= 1}
                            onClick={() => getData(pagination.currenPage - 1)}
                            className="inline-flex cursor-pointer items-center justify-center h-8 w-8 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 active:scale-95 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        
                        <div className="flex items-center px-3 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 font-semibold text-xs tracking-wide">
                            {pagination.currenPage} / {pagination.lastPage}
                        </div>
                        
                        <button
                            type="button"
                            title="Next page"
                            disabled={Loading || pagination.currenPage >= pagination.lastPage}
                            onClick={() => getData(pagination.currenPage + 1)}
                            className="inline-flex cursor-pointer items-center justify-center h-8 w-8 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 active:scale-95 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                        
                        <button
                            type="button"
                            title="Last page"
                            disabled={Loading || pagination.currenPage >= pagination.lastPage}
                            onClick={() => getData(pagination.lastPage)}
                            className="inline-flex cursor-pointer items-center justify-center h-8 w-8 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 active:scale-95 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronsRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default UserList