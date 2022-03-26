import React, {useEffect, useState} from 'react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis, ResponsiveContainer
} from "recharts";

export function Chart({pointsByCategory}) {

    //Construction du tableau requis pour construire le chart
    let data = [];
    pointsByCategory.forEach(category => {
        data.push ({
            subject: category.categoryLabel,
            A: category.finalPoints,
            fullMark: 100
        })
    })

    return (

        <ResponsiveContainer width="50%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Check1" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            </RadarChart>

        </ResponsiveContainer>
    )
}