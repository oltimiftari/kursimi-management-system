import React from 'react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Cell
} from 'recharts';

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="custom-tooltip">
                <p className="label">{`${data.name}`}</p>
                <p className="intro">{`Shuma: ${data.amount}€`}</p>
                <p className="intro">{`Data: ${data.paymentDate}`}</p>
            </div>
        );
    }
    return null;
};

const SubscriptionTimeline = ({ subscriptions }) => {
    const chartData = subscriptions
        .sort((a, b) => new Date(a.nextPaymentDate) - new Date(b.nextPaymentDate))
        .map((sub) => ({
            name: sub.name,
            amount: sub.amount,
            paymentDate: sub.nextPaymentDate,
            id: sub.id,
        }));

    return (
        <div className="subscription-timeline-container">
            <h2>Linja Kohore e Pagesave të Ardhshme</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="amount" fill="#8884d8">
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill="#4caf50" />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
            <div className="total-subscriptions-summary">
                Shuma Totale Mujore: {chartData.reduce((total, item) => total + item.amount, 0).toFixed(2)}€
            </div>
        </div>
    );
};

export default SubscriptionTimeline;