import React, { useContext, useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import axios from 'axios';
import { AuthContext } from '../../../Helpers/AuthContext';

function RestaurantLineChart() {
    const { url } = useContext(AuthContext)
    const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
    const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
    const xLabels = ['Page A', 'Page B', 'Page C', 'Page D', 'Page E', 'Page F', 'Page G'];

    

    return (
        <div className="w-full h-full flex justify-center items-center">
            <LineChart
                height={400} // This will be overwritten by the parent container size
                series={[
                    { data: pData, label: 'pv' },
                    { data: uData, label: 'uv' },
                ]}
                xAxis={[{ scaleType: 'point', data: xLabels }]}
                grid={{ vertical: true, horizontal: true }}
            />
        </div>
    );
}

export default RestaurantLineChart;


