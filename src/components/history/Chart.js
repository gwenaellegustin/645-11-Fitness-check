import React from 'react';
import {Link} from "react-router-dom";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis, ResponsiveContainer
} from "recharts";

function Chart({pointsByCategory}) {
    console.log(pointsByCategory)

    return (
        <div>
            <h1>This is the chart!</h1>
            <div style={{height:"340px", width: "100%" }}>
                <DrawChart/>
            </div>
            <p>
                <Link to="/">Home</Link>
            </p>
        </div>
    )
}


const data = [
    {
        subject: "Activité Physique",
        A: 120,
        B: 110,
        fullMark: 150
    },
    {
        subject: "Marcher sans aides",
        A: 98,
        B: 130,
        fullMark: 150
    },
    {
        subject: "Vitesse marche",
        A: 86,
        B: 130,
        fullMark: 150
    },
    {
        subject: "Temps marche",
        A: 99,
        B: 100,
        fullMark: 150
    },
    {
        subject: "Capacité monter",
        A: 85,
        B: 90,
        fullMark: 150
    },
    {
        subject: "Sécurité marche",
        A: 65,
        B: 85,
        fullMark: 150
    },
    {
        subject: "Pas peur du vide",
        A: 65,
        B: 50,
        fullMark: 150
    },
    {
        subject: "Equilibre",
        A: 65,
        B: 30,
        fullMark: 150
    },
    {
        subject: "Sans douleurs",
        A: 80,
        B: 85,
        fullMark: 150
    },
    {
        subject: "Mobilité",
        A: 60,
        B: 85,
        fullMark: 150
    }
];

function DrawChart() {
    return (
        <ResponsiveContainer width="50%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 150]} />
                <Radar name="Check1" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Radar name="Check2" dataKey="B" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            </RadarChart>
        </ResponsiveContainer>
    );
}

export default Chart;