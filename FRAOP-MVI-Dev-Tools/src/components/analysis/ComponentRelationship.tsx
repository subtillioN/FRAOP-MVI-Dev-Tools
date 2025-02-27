import React, { useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import { PropAnalysisResult } from '../../utils/propAnalysis';
import styles from '../../styles/base.module.css';

interface ComponentRelationshipProps {
  data: PropAnalysisResult;
}

interface Node extends d3.SimulationNodeDatum {
  id: string;
  group: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: Node | string;
  target: Node | string;
  value: number;
}

export const ComponentRelationship: React.FC<ComponentRelationshipProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown>>();

  const resetZoom = useCallback(() => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(750)
        .call(zoomRef.current.transform, d3.zoomIdentity);
    }
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous graph
    d3.select(svgRef.current).selectAll('*').remove();

    // Create graph data
    const nodes: Node[] = data.components.map(component => ({
      id: component.componentName,
      group: 1
    }));

    const links: Link[] = data.propPatterns.flatMap(pattern => {
      if (pattern.type !== 'dependent') return [];
      return pattern.components.flatMap(source =>
        pattern.components
          .filter(target => target !== source)
          .map(target => ({
            source,
            target,
            value: 1
          }))
      );
    });

    const width = 800;
    const height = 600;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        svg.selectAll('g').attr('transform', event.transform.toString());
      });

    zoomRef.current = zoom;
    svg.call(zoom);

    const simulation = d3.forceSimulation<Node>(nodes)
      .force('link', d3.forceLink<Node, Link>(links).id(d => d.id))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => Math.sqrt(d.value));

    const node = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', 5)
      .attr('fill', '#69b3a2')
      .call(d3.drag<SVGCircleElement, Node>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any
      );

    node.append('title')
      .text(d => d.id);

    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as Node).x ?? 0)
        .attr('y1', d => (d.source as Node).y ?? 0)
        .attr('x2', d => (d.target as Node).x ?? 0)
        .attr('y2', d => (d.target as Node).y ?? 0);

      node
        .attr('cx', d => d.x ?? 0)
        .attr('cy', d => d.y ?? 0);
    });

    function dragstarted(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [data]);

  return (
    <div className={styles['component-relationship']}>
      <h3>Component Relationships</h3>
      <div className={styles['relationship-controls']}>
        <button className={styles.button} onClick={resetZoom}>Reset View</button>
      </div>
      <div className={styles['relationship-legend']}>
        <div className={styles['legend-item']}>
          <span className={styles['legend-color']} style={{ backgroundColor: '#4caf50' }} />
          <span>Component</span>
        </div>
        <div className={styles['legend-item']}>
          <span className={styles['legend-color']} style={{ backgroundColor: '#2196f3' }} />
          <span>Prop</span>
        </div>
      </div>
      <svg
        ref={svgRef}
        width={800}
        height={600}
        className={styles['relationship-svg']}
      />
    </div>
  );
}; 