import axios from 'axios';
import React, { useContext } from 'react';
import { AuthContext } from '../../Helpers/AuthContext';

function Tipping() {
    const { url } = useContext(AuthContext);

    const addTip = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            tip1: formData.get("tip1"),
            tip2: formData.get("tip2"),
            tip3: formData.get("tip3"),
        };
        console.log(data);
        e.target.reset();
        axios.post(`${url}/admin/addTips`, data, {
            headers: {
                adminAccessToken: localStorage.getItem("adminAccessToken"),
            },
        }).then((response) => {
            if (!response.data.error) {
                console.log(response.data);
            } else {
                console.log(response.data.error);
            }
        });
    };

    return (
        <div className='min-h-screen flex justify-center items-center p-4'>
            <div className='w-full max-w-lg bg-white rounded-2xl shadow-md'>
                <p className='bg-indigo-950 text-white px-3 py-4 text-xl rounded-r-full rounded-tl-2xl w-[40%]'>
                    Add Tips
                </p>
                <form onSubmit={addTip} action="POST" className='flex flex-col gap-4 p-4 w-full'>
                    <div className='flex flex-wrap justify-center gap-4'>
                        <div className='flex flex-col gap-1 w-full  p-2'>
                            <label htmlFor="tip1" className='font-bold text-start'>Tip 1</label>
                            <input required type="text" id="tip1" name="tip1" placeholder='Tip 1 eg 10'
                                className='px-5 py-2 rounded-full shadow-md w-full' />
                        </div>
                        <div className='flex flex-col gap-1 w-full p-2'>
                            <label htmlFor="tip2" className='font-bold'>Tip 2</label>
                            <input type="number" id="tip2" required name="tip2" placeholder='Tip 2 eg 20'
                                className='px-5 py-2 rounded-full shadow-md w-full' />
                        </div>
                    </div>
                    <div className='flex flex-wrap justify-center gap-4'>
                        <div className='flex flex-col gap-1 w-full p-2'>
                            <label htmlFor="tip3" className='font-bold text-start'>Tip 3</label>
                            <input required type="text" id="tip3" name="tip3" placeholder='Tip 3 eg 30'
                                className='px-5 py-2 rounded-full shadow-md w-full' />
                        </div>
                    </div>
                    <button type="submit" className='mx-auto w-full px-5 py-2 bg-indigo-950 text-white font-bold rounded-full'>
                        Save
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Tipping;
