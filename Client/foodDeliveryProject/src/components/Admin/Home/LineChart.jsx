// import React from 'react'
// import { LineChart } from '@mui/x-charts/LineChart';

// function LineCharts() {
//     const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
//     const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
//     const xLabels = [
//         'Page A',
//         'Page B',
//         'Page C',
//         'Page D',
//         'Page E',
//         'Page F',
//         'Page G',
//     ];
//     return (
//         <div>
//             <LineChart
//                 width={600}
//                 height={400}
//                 series={[
//                     { data: pData, label: 'pv' },
//                     { data: uData, label: 'uv' },
//                 ]}
//                 xAxis={[{ scaleType: 'point', data: xLabels }]}
//                 grid={{ vertical: true, horizontal: true }}
//             />
//         </div>
//     )
// }

// export default LineCharts


import React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

function LineCharts() {
    const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
    const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
    const xLabels = ['Page A', 'Page B', 'Page C', 'Page D', 'Page E', 'Page F', 'Page G'];

    return (
        <div className="w-full h-full flex justify-center items-center">
            <LineChart
                width={600} // This will be overwritten by the parent container size
                height={400} // This will be overwritten by the parent container size
                series={[
                    { data: pData, label: 'pv' },
                    { data: uData, label: 'uv' },
                ]}
                xAxis={[{ scaleType: 'point', data: xLabels }]}
                grid={{ vertical: true, horizontal: true }}
                sx={{
                    width: '100%', // Makes the chart take the full width of its container
                    height: '100%', // Makes the chart take the full height of its container
                    maxWidth: '100%', // Prevents overflow beyond the container
                    maxHeight: '100%', // Prevents overflow beyond the container
                    minWidth: '300px', // Minimum width to ensure readability
                    minHeight: '200px', // Minimum height to ensure readability
                }}
            />
        </div>
    );
}

export default LineCharts;
