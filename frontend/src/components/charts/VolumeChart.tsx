import { useEffect, useRef } from 'react';
import { createChart, ColorType, HistogramSeries } from 'lightweight-charts';
import type { IChartApi } from 'lightweight-charts';
import { Box } from '@mui/material';
import type { CandlestickData } from '../../types/chart';

interface VolumeChartProps {
  data: CandlestickData[];
  height?: number;
}

export default function VolumeChart({ data, height = 120 }: VolumeChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current || data.length === 0) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#ffffff' },
        textColor: '#333',
      },
      width: chartContainerRef.current.clientWidth,
      height,
      grid: {
        vertLines: { visible: false },
        horzLines: { color: '#f0f0f0' },
      },
      rightPriceScale: { borderColor: '#e0e0e0' },
      timeScale: { borderColor: '#e0e0e0', timeVisible: false },
    });

    const volumeData = data.map((d, i) => ({
      time: d.time,
      value: (d as any).volume || 0,
      color: i > 0 && d.close >= data[i - 1].close ? 'rgba(255, 23, 68, 0.4)' : 'rgba(41, 121, 255, 0.4)',
    }));

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' },
      priceScaleId: '',
    });

    volumeSeries.setData(volumeData);
    chart.timeScale().fitContent();
    chartRef.current = chart;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, height]);

  return <Box ref={chartContainerRef} sx={{ width: '100%' }} />;
}
