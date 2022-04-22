import {PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer} from "recharts";
import {useContext} from "react";
import {HistoryContext} from "./History";

/**
 * Component to draw a chart showing the result of the selected form
 *
 * @param pointsByCategory who contains the final points in each category and their names
 */
export function ChartContainer({pointsByCategory}) {
    const { categories} = useContext(HistoryContext);

    // Array construction to build the radar chart
    let data = [];
    pointsByCategory.forEach(categoryPoint => {
        categories.every(category => {
            if (categoryPoint.category.id === category.id){
                data.push ({
                    subject: category.label,
                    A: categoryPoint.finalPoints,
                    fullMark: 100
                })
                return false
            }
            return true
            }
        )
    })

    return (
        <ResponsiveContainer width="100%" height={400}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data} margin={{ top: 0, left: 90, right: 90, bottom: 0 }}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" fontSize="12"/>
                <PolarRadiusAxis angle={30} domain={[0, 100]}/>
                <Radar name="Check1" dataKey="A" stroke="#0d6efd" fill="#0d6efd" fillOpacity={0.6} />
            </RadarChart>
        </ResponsiveContainer>
    )
}