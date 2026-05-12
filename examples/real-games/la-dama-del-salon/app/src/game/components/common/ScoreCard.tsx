import React from 'react';
import './ScoreCard.css';

interface ScoreCardProps {
  score: number;
  label: string;
  icon?: React.ReactNode;
  color?: string;
}

const ScoreCard: React.FC<ScoreCardProps> = ({
  score,
  label,
  icon,
  color = '#1976d2'
}) => {
  return (
    <div className="score-card" style={{ borderColor: color }}>
      <div className="score-card-content">
        <div className="score-card-header">
          {icon && (
            <span className="score-card-icon" style={{ color }}>
              {icon}
            </span>
          )}
          <span className="score-card-label">{label}</span>
        </div>
        
        <div className="score-card-score" style={{ color }}>
          {score}
        </div>
      </div>
    </div>
  );
};

export default ScoreCard; 