import React from 'react'

const AdminPage = () => {
  return (
    <div className='w-full max-w-screen-2xl mx-auto flex gap-1'>

        <div className='w-[30%] bg-white flex flex-col gap-3'>
            <img src="" alt="logo" />
            <div className='w-full flex flex-col gap-3'>
                <div className='w-full flex gap-2'>
                    <img src="" alt="dash" />
                    <h1>Dashboard</h1>
                </div>
                <div className='w-full flex gap-2'>
                    <img src="" alt="dash" />
                    <h1>Front Desk</h1>
                </div>
                <div className='w-full flex gap-2'>
                    <img src="" alt="dash" />
                    <h1>Guest</h1>
                </div><div className='w-full flex gap-2'>
                    <img src="" alt="dash" />
                    <h1>Deal</h1>
                </div><div className='w-full flex gap-2'>
                    <img src="" alt="dash" />
                    <h1>Rate</h1>
                </div>
            </div>

        </div>
    </div>
  )
}

export default AdminPage