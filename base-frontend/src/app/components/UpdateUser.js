"use client"


import React from 'react'
import { useState } from "react";
import codepics from '../code.jpg'
import Image from 'next/image';

const UpdateUser = () => {
    const [isloading, setIsLoading] = useState(false)
    const [fullname, setFullname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [role, setRole] = useState('')
    const [bio, setBio] = useState('')

    const [location, setLocation] = useState('')
    const [gender, setGedner] = useState('choose an option')
    const [wallet_address, setWallet_Address] = useState('fyud675')

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
          const response = await
            fetch(`http://localhost:8000/update_user/${wallet_address}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',   
              },
              body: JSON.stringify({
                fullname,
                username,
                email,
                password,
                location,
                bio,
                gender,
                role
              }),
            });
    
          if (!response.ok) {
          setIsLoading(false)
            throw new Error(`Error updating user: ${response}`);
          }
          const data = await response.json();
          setIsLoading(false)
          console.log('User updated:', data);
        } catch (error) {
          setIsLoading(false)
          console.error('Error updating user:', error);
        }
      };

    const handleRevert = (e) => {
      e.preventDefault();
      setFullname(fullname)
    }

  return (
    <div className="p-5">
      <Image src={codepics} alt='img' className="h-24 w-full  bg-cover mb-10"/>
        <form onSubmit={handleSubmit} className="update">
           <div>
           <p className="font-semibold">Name *</p>
           <input 
            type='text'
            value={fullname}
            required
            onChange={(e)=> setFullname(e.target.value)}
            className="border border-gray-300 focus:outline-gray-400 p-2 w-full md:w-5/12 rounded-lg"
           />  
           </div>
           <div>
           <p className="pt-5 font-semibold">Username *</p>
           <input 
            type='text'
            value={username}
            required
            onChange={(e)=> setUsername(e.target.value)}
            className="border border-gray-300 focus:outline-gray-400 p-2 w-full md:w-5/12 rounded-lg"
           />  
           </div>
           <div>
           <p className="pt-5 font-semibold">Email *</p>
           <input 
            type='email'
            value={email}
            required
            onChange={(e)=> setEmail(e.target.value)}
            className="border border-gray-300 focus:outline-gray-400 p-2 w-full md:w-5/12 rounded-lg"
           />  
           </div>
           <div>
           <p className="pt-5 font-semibold">Password *</p>
           <input 
            type='password'
            value={password}
            required
            onChange={(e)=> setPassword(e.target.value)}
            className="border border-gray-300 focus:outline-gray-400 p-2 w-full md:w-5/12 rounded-lg"
           />  
           </div>
           <div>
           <p className="pt-5 font-semibold">Bio</p>
           <input 
            type='text'
            value={bio}
            onChange={(e)=> setBio(e.target.value)}
            className="border border-gray-300 focus:outline-gray-400 p-2 w-full md:w-5/12 rounded-lg"
           />  
           </div>
           <div>
           <p className="pt-5 font-semibold">Location *</p>
           <input 
            type='text'
            value={location}
            required
            onChange={(e)=> setLocation(e.target.value)}
            className="border border-gray-300 focus:outline-gray-400 p-2 w-full md:w-5/12 rounded-lg"
           />  
           </div>
           <div>
           <p className="pt-5 font-semibold">Gender</p>
           <select value={gender} onChange={(e)=> setGedner(e.target.value)} className="border border-gray-300 focus:outline-gray-400 p-4 w-full md:w-5/12 rounded-md">
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>

           </select>
           </div>
           <div>
           <p className="pt-5 font-semibold">Role</p>
           <select value={role} onChange={(e)=> setRole(e.target.value)} className="border border-gray-300 focus:outline-gray-400 p-4 w-full md:w-5/12 rounded-md">
            <option value="">Select Role</option>
            <option value="employer">Employer</option>
            <option value="employee">Employee</option>
           </select>
           </div>
           
           <br />
           <div className="flex justify-between mt-10">
            <button onClick={handleRevert} className="border border-blue-700 text-blue-600 py-2 px-8 text-md rounded-md">Revert</button>
            <button onClick={handleSubmit} className="bg-blue-700 text-white py-2 px-4 text-md rounded-md">{
              !isloading ? "Save Changes" : "Submitting"}</button>
           </div>
        </form>

       {/* <form  onSubmit={handleSubmit}>
       <h1 className="text-purple-600">Update Account</h1>
           <p>Name</p>
           <input 
             type='text'            
             value={fullname}
             onChange={(e)=> setFullname(e.target.value)}
             className="border border-gray-300 text-red-900 focus:outline-gray-400 p-2 w-3/12"
            />  
          <p>Username</p>           
          <input 
           type='text'
          value={username}
           onChange={(e)=> setUsername(e.target.value)}
           className="border border-gray-300 text-red-900 focus:outline-gray-400 p-2 w-3/12"
           />
             <p>email</p>
           <input 
            required='true'
           type='email'
          value={email}
          onChange={(e)=> setEmail(e.target.value)}
           className="border border-gray-300 text-red-900 focus:outline-gray-400 p-2 w-3/12"
           /><br />
           <div className="flex justify-between mt-10">
            <submit className="border border-blue-600 text-blue-600 py-2 px-4 text-md rounded-md">Revert</submit>
            <button onChange={handleSubmit} className="bg-blue-600 text-white py-2 px-4 text-md rounded-md">save changes</button>
           </div>
           </form> */}
    </div>
  )
}

export default UpdateUser