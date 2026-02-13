import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import '../styles/StatCard.css';

interface StatCardProps {
    title: string;
    value: string | number;
    change: number;
    icon: React.ReactNode;
    iconBg: string;
    trend?: 'up' | 'down';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, iconBg, trend }) => {
    const isPositive = trend ? trend === 'up' : change >= 0;

    return (
        <div className="stat-card card">
            <div className="stat-content">
                <div className="stat-header">
                    <div className="stat-icon" style={{ backgroundColor: iconBg }}>
                        {icon}
                    </div>
                    <div className={`stat-change ${isPositive ? 'positive' : 'negative'}`}>
                        {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        <span>{isPositive ? '+' : ''}{change}%</span>
                    </div>
                </div>
                <div className="stat-body">
                    <p className="stat-title">{title}</p>
                    <h3 className="stat-value">{value}</h3>
                </div>
            </div>
        </div>
    );
};

export default StatCard;
