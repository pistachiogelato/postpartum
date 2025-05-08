import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidSequenceDiagramProps {
  chart: string;
}

const MermaidSequenceDiagram: React.FC<MermaidSequenceDiagramProps> = ({ chart }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderMermaid = async () => {
      mermaid.initialize({ startOnLoad: false });
      const { svg } = await mermaid.render('mermaid-chart', chart);
      if (chartRef.current) {
        chartRef.current.innerHTML = svg;
      }
    };
    renderMermaid();
  }, [chart]);

  return (
    <div>
      <div ref={chartRef} />
    </div>
  );
};

export default MermaidSequenceDiagram;
