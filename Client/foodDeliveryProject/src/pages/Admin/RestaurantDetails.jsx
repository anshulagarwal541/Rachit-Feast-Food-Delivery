import React from 'react'
import RestaurantGraph from '../../components/Admin/Restaurant/RestaurantGraph'
import RestaurantGraphFilter from '../../components/Admin/Restaurant/RestaurantGraphFilter'

function RestaurantDetails() {
    return (
        <div className='flex flex-col gap-4 justify-center items-center h-[130vh] py-5'>
            <RestaurantGraphFilter />
            <RestaurantGraph />
        </div>
    )
}

export default RestaurantDetails