import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { HISTORICAL_AND_PREDICTION_SERIES } from '../data/mockData';

interface DemandChartProps {
  outpostId: string;
  category: string;
  showResupplyImpact: boolean;
  simDay?: number;
  theme?: string;
}

const THEME_ACCENTS: Record<string, { primary: string; fill: string; tooltipBorder: string }> = {
  'cyan': { primary: '#38bdf8', fill: 'rgba(56, 189, 248, 0.12)', tooltipBorder: '#38bdf8' },
  'nvg-green': { primary: '#4ade80', fill: 'rgba(74, 222, 128, 0.14)', tooltipBorder: '#4ade80' },
  'amber-flir': { primary: '#fbbf24', fill: 'rgba(251, 191, 36, 0.14)', tooltipBorder: '#fbbf24' },
  'stealth-red': { primary: '#f87171', fill: 'rgba(248, 113, 113, 0.14)', tooltipBorder: '#f87171' }
};

export const DemandChart: React.FC<DemandChartProps> = ({
  outpostId,
  category,
  showResupplyImpact,
  simDay = 0,
  theme = 'cyan'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const themeColors = THEME_ACCENTS[theme] || THEME_ACCENTS.cyan;
    const seriesData = HISTORICAL_AND_PREDICTION_SERIES[outpostId] || HISTORICAL_AND_PREDICTION_SERIES['op-dbo'];
    const catData = (seriesData as Record<string, any>)[category] || seriesData.class3_pol;
    const labels = seriesData.labels;
    const thresholdArray = new Array(labels.length).fill(catData.safeThreshold);
    
    // Dynamic depletion based on advanced simulation days
    const depletion = simDay * 350;
    const rawProjected = showResupplyImpact ? catData.predictedWithResupply : catData.predicted;
    const projectedData = rawProjected.map((val: number | null) => 
      val === null ? null : Math.max(0, val - (showResupplyImpact ? 0 : depletion))
    );

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Historical Actual Stock',
            data: catData.actual,
            borderColor: themeColors.primary,
            backgroundColor: themeColors.fill,
            borderWidth: 2.5,
            pointBackgroundColor: themeColors.primary,
            pointRadius: 4,
            tension: 0.25
          },
          {
            label: showResupplyImpact ? 'AI Forecast (With Resupply)' : 'AI Forecast (No Resupply)',
            data: projectedData,
            borderColor: showResupplyImpact ? '#10b981' : '#f59e0b',
            borderDash: [5, 5],
            backgroundColor: showResupplyImpact ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
            borderWidth: 2.5,
            pointBackgroundColor: showResupplyImpact ? '#10b981' : '#f59e0b',
            pointRadius: 3.5,
            tension: 0.25
          },
          {
            label: 'Minimum Safety Reserve',
            data: thresholdArray,
            borderColor: '#ef4444',
            borderWidth: 1.5,
            borderDash: [3, 3],
            pointRadius: 0,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: '#f8fafc',
              font: {
                family: "'Inter', sans-serif",
                size: 11,
                weight: 'bold'
              },
              boxWidth: 14,
              boxHeight: 10
            }
          },
          tooltip: {
            backgroundColor: 'rgba(13, 21, 39, 0.98)',
            borderColor: themeColors.tooltipBorder,
            borderWidth: 1.5,
            titleFont: { family: "'Inter', sans-serif", size: 12, weight: 'bold' },
            bodyFont: { family: "'JetBrains Mono', monospace", size: 11 },
            padding: 10,
            displayColors: true
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(51, 65, 85, 0.35)'
            },
            ticks: {
              color: '#cbd5e1',
              font: { family: "'JetBrains Mono', monospace", size: 10, weight: 'bold' }
            }
          },
          y: {
            grid: {
              color: 'rgba(51, 65, 85, 0.35)'
            },
            ticks: {
              color: '#cbd5e1',
              font: { family: "'JetBrains Mono', monospace", size: 10, weight: 'bold' }
            },
            title: {
              display: true,
              text: 'Stock Volume (L / kg)',
              color: themeColors.primary,
              font: { family: "'Inter', sans-serif", size: 11, weight: 'bold' }
            }
          }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [outpostId, category, showResupplyImpact, simDay, theme]);

  return (
    <div className="chart-wrapper">
      <canvas ref={canvasRef} />
    </div>
  );
};
