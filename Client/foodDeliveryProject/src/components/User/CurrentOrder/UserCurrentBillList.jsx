import React, { useContext } from 'react'
import { AuthContext } from '../../../Helpers/AuthContext'
import UserCurrentBillMenuCard from './UserCurrentBillMenuCard'

function UserCurrentBillList() {
    const {
        bill, setBill,
        restaurant,
        url,
        isTipSelected, setIsTipSelected,
        tip, setTip,
        finalOrderForDelivery, setFinalOrderForDelivery,
        currentDate,
        order
    } = useContext(AuthContext)

    return (
        <AuthContext.Provider value={{ bill, setBill, url }}>
            <div className='w-full md:w-1/2 px-4'>
                <div className='flex flex-col gap-5'>
                    <div className='rounded-2xl bg-white overflow-y-auto h-40 md:h-64 flex flex-col gap-3 items-center py-3 px-5'>
                        {bill && bill.length > 0 ?
                            (bill.map((b, i) => {
                                return <UserCurrentBillMenuCard key={i} billing={b} />
                            }))
                            :
                            (
                                <div className='text-indigo-950 font-bold text-lg md:text-2xl'>Please add item...</div>
                            )
                        }
                    </div>
                    <div className='bg-white p-5 rounded-2xl'>
                        <div className='border-b-2 border-black flex justify-between px-3 items-center py-2 w-full' />

                        {order && (
                            <div className='border-b-2 border-black flex flex-col gap-3 px-3 py-2 w-full'>
                                <div className='flex justify-between text-sm md:text-base'>
                                    <p className='font-bold'>Coupon Name:</p>
                                    <p>{order.couponName ? order.couponName : "N.A"}</p>
                                </div>
                                <div className='flex justify-between text-sm md:text-base'>
                                    <p className='font-bold'>Coupon Discount:</p>
                                    <p>{order.couponDiscount} %</p>
                                </div>
                            </div>
                        )}

                        <div className='border-b-2 border-black flex justify-between px-3 items-center py-2 w-full text-sm md:text-base'>
                            <p>Payment Mode:</p>
                            <p className='font-bold'>{order && order.paymentMode}</p>
                        </div>

                        <div className='border-b-2 border-black flex justify-between px-3 items-center py-2 w-full text-sm md:text-base'>
                            <p>Tip:</p>
                            <p className='font-bold'>Rs {order && order.tip}</p>
                        </div>

                        <div className='border-b-2 border-black flex justify-between px-3 items-center py-2 w-full text-sm md:text-base'>
                            <p>Tax Charges:</p>
                            <p className='font-bold'>Rs {order && order.tax}</p>
                        </div>

                        <div className='flex justify-between px-3 items-center py-2 w-full text-sm md:text-base'>
                            <p>Total Amount:</p>
                            <p className='font-bold'>Rs {order && order.totalAmount}</p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthContext.Provider>
    )
}

export default UserCurrentBillList
