import React, { useState, useEffect } from 'react';

const EnhancedRiskPanel = ({ tokenAddress }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!tokenAddress) return;

    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_API_URL}/moralis/token/${tokenAddress}/analysis`);
        if (response.ok) {
          const data = await response.json();
          setAnalysis(data);
        }
      } catch (error) {
        console.error('Enhanced analysis fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [tokenAddress]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Enhanced Risk Analysis</h3>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  const getRiskColor = (score) => {
    if (score < 0.3) return 'text-green-600';
    if (score < 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskLabel = (score) => {
    if (score < 0.3) return 'Low Risk';
    if (score < 0.7) return 'Medium Risk';
    return 'High Risk';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Enhanced Risk Analysis</h3>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Risk Score</span>
          <span className={`font-bold ${getRiskColor(analysis.riskScore)}`}>
            {getRiskLabel(analysis.riskScore)} ({(analysis.riskScore * 100).toFixed(0)}%)
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${
              analysis.riskScore < 0.3 ? 'bg-green-500' : 
              analysis.riskScore < 0.7 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${analysis.riskScore * 100}%` }}
          ></div>
        </div>
      </div>

      {analysis.liquidity && (
        <div className="mb-4">
          <h4 className="font-medium mb-2">Liquidity Analysis</h4>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Total Liquidity:</span>
              <span>${analysis.liquidity.totalLiquidity?.toLocaleString() || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span>LP Burned:</span>
              <span className={analysis.liquidity.lpBurned ? 'text-green-600' : 'text-red-600'}>
                {analysis.liquidity.lpBurned ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>
      )}

      {analysis.riskFactors && analysis.riskFactors.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Risk Factors</h4>
          <div className="space-y-2">
            {analysis.riskFactors.map((factor, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className={`w-2 h-2 rounded-full mt-1.5 ${
                  factor.severity === 'high' ? 'bg-red-500' :
                  factor.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`}></div>
                <span className="text-sm">{factor.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedRiskPanel;