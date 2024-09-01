import React, { useContext } from 'react'
import { AuthContext } from '../../../Helpers/AuthContext'
import BillingMenuCard from '../../User/Restaurant/BillingMenuCard'

function RiderBillList() {
    const { bill, order } = useContext(AuthContext)

    return (
        <div className='w-full max-w-4xl mx-auto px-4 py-6'>
            <div className='flex flex-col gap-5'>
                {/* Bill List */}
                <div className='bg-white rounded-2xl overflow-y-auto max-h-[40vh] p-4 flex flex-col gap-3'>
                    {bill && bill.length > 0 ? (
                        bill.map((b, i) => (
                            <BillingMenuCard key={i} billing={b} />
                        ))
                    ) : (
                        <div className='text-indigo-950 font-bold text-xl text-center'>Please add item..</div>
                    )}
                </div>
                {/* Order Details */}
                <div className='bg-white p-4 rounded-2xl'>
                    {order && (
                        <>
                            {order.couponName && order.couponDiscount && (
                                <div className='border-b-2 border-black flex justify-between items-center py-2'>
                                    <p className='font-bold'>Coupon Name:</p>
                                    <p>{order.couponName || "N.A"}</p>
                                    <p className='font-bold'>Coupon Discount:</p>
                                    <p>{order.couponDiscount} %</p>
                                </div>
                            )}
                            <div className='border-b-2 border-black flex justify-between items-center py-2'>
                                <p className='font-bold'>Payment Mode:</p>
                                <p>{order.paymentMode}</p>
                            </div>
                            <div className='border-b-2 border-black flex justify-between items-center py-2'>
                                <p className='font-bold'>Tip:</p>
                                <p>Rs {order.tip}</p>
                            </div>
                            <div className='border-b-2 border-black flex justify-between items-center py-2'>
                                <p className='font-bold'>Tax Charges:</p>
                                <p>Rs {order.tax}</p>
                            </div>
                            <div className='border-b-2 border-black flex justify-between items-center py-2'>
                                <p className='font-bold'>Total Amount:</p>
                                <p>Rs {order.totalAmount}</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default RiderBillList;
