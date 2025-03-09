import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';

const Dashboard = () => {
    const [data, setData] = useState({
        requestsToday: 120,
        returnsAccepted: 85,
        topProducts: [
            { id: 1, name: "B-Series Laptop", percentage: "40%", sales: "320" },
            { id: 2, name: "Cybermobile Type S", percentage: "25%", sales: "200" },
            { id: 3, name: "T-Phone Adapter Port", percentage: "20%", sales: "150" },
            { id: 4, name: "Headphones Classic", percentage: "15%", sales: "100" },
        ],
        totalSaved: "$5,600",
        emissionsReduced: "12 kg of CO₂",
        landfillReduction: "85% reduced from last month",
    });

    const returnReasons = [
        { name: "Wrong Size or Fit", value: 10 },
        { name: "Defective", value: 50 },
        { name: "Not as Described", value: 15 },
        { name: "Don’t Want Anymore", value: 25 },
    ];

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold">Requests Today</h3>
                    <p className="text-3xl font-bold">{data.requestsToday}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold">Returns Accepted Today</h3>
                    <p className="text-3xl font-bold">{data.returnsAccepted}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold">Total Saved This Month</h3>
                    <p className="text-3xl font-bold">{data.totalSaved}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Reasons for Returns</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={returnReasons} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value">
                                {returnReasons.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Top Products Returned</h3>
                    <table className="w-full text-left">
                        <thead>
                            <tr>
                                <th className="py-2">#</th>
                                <th className="py-2">Name</th>
                                <th className="py-2">% Returned</th>
                                <th className="py-2">Sales</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.topProducts.map((product) => (
                                <tr key={product.id} className="border-t border-gray-700">
                                    <td className="py-2">{product.id}</td>
                                    <td className="py-2">{product.name}</td>
                                    <td className="py-2">{product.percentage}</td>
                                    <td className="py-2">{product.sales}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-lg mx-auto">
                <h3 className="text-xl font-semibold">Total Emissions Reduced</h3>
                <p className="text-3xl font-bold">{data.emissionsReduced}</p>
                <p className="text-sm text-gray-400">{data.landfillReduction}</p>
            </div>
        </div>
    );
};

export default Dashboard;
