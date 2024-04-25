import React, { useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import data from './dummygraph'
// import { map, some, range, forEach, debounce } from 'lodash';
// import { getWikipediaPageUrl } from '../utils';

// import {
//   GraphSvg,
//   GraphWrapper,
//   Instructions,
//   Legend,
//   LegendCircle,
//   LegendItem,
//   LegendLabel,
//   ResetButton,
// } from './ResultsGraph.styles';

// const DEFAULT_CHART_HEIGHT = 600;

// const Graph = ({ paths }) => {
//   const graphRef = useRef(null);
//   const graphWidthRef = useRef(null);
//   const nodesRef = useRef(null);
//   const linksRef = useRef(null);
//   const nodeLabelsRef = useRef(null);
//   const simulationRef = useRef(null);
//   const ticksPerRenderRef = useRef(null);

//   const color = d3.scaleOrdinal(d3.schemeCategory10);
//   const zoom = d3.zoom().on('zoom', () => zoomed());

//   const debouncedResetGraph = useRef(debounce(resetGraph.bind(null, false), 350));

//   useEffect(() => {
//     const targetPageTitle = paths[0][paths[0].length - 1].title;

//     const { nodesData, linksData } = getGraphData();

//     ticksPerRenderRef.current = 3 + Math.floor(nodesData.length / 20);
//     graphWidthRef.current = getGraphWidth();

//     const zoomable = d3
//       .select(graphRef.current)
//       .attr('width', '100%')
//       .attr('height', '100%')
//       .call(zoom);

//     const graph = zoomable.append('g');

//     const defs = graph.append('defs');

//     const markers = {
//       arrow: 18,
//       'arrow-end': 22,
//     };

//     forEach(markers, (refX, id) => {
//       defs
//         .append('marker')
//         .attr('id', id)
//         .attr('viewBox', '0 -5 10 10')
//         .attr('refX', refX)
//         .attr('refY', 0)
//         .attr('markerWidth', 8)
//         .attr('markerHeight', 8)
//         .attr('orient', 'auto')
//         .append('svg:path')
//         .attr('d', 'M0,-5L10,0L0,5');
//     });

//     linksRef.current = graph
//       .append('g')
//       .attr('class', 'links')
//       .selectAll('line')
//       .data(linksData)
//       .enter()
//       .append('line')
//       .attr('fill', 'none')
//       .attr('marker-end', (d) => (d.target === targetPageTitle ? 'url(#arrow-end)' : 'url(#arrow)'));

//     nodesRef.current = graph
//       .append('g')
//       .attr('class', 'nodes')
//       .selectAll('circle')
//       .data(nodesData)
//       .enter()
//       .append('circle')
//       .attr('r', (d) => (d.degree === 0 || d.degree === paths[0].length - 1 ? 10 : 6))
//       .attr('fill', (d) => color(d.degree))
//       .attr('stroke', (d) => d3.rgb(color(d.degree)).darker(2))
//       .call(d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended));

//     nodeLabelsRef.current = graph
//       .append('g')
//       .attr('class', 'node-labels')
//       .selectAll('text')
//       .data(nodesData)
//       .enter()
//       .append('text')
//       .attr('x', (d) => (d.degree === 0 || d.degree === paths[0].length - 1 ? 14 : 10))
//       .attr('y', 4)
//       .text((d) => d.title);

//     nodesRef.current.on('click', (d) => window.open(getWikipediaPageUrl(d.id), '_blank'));

//     simulationRef.current = d3
//       .forceSimulation()
//       .force('link', d3.forceLink().id((d) => d.id))
//       .force('charge', d3.forceManyBody().strength(-300).distanceMax(500))
//       .force('center', d3.forceCenter(graphWidthRef.current / 2, DEFAULT_CHART_HEIGHT / 2));

//     simulationRef.current.nodes(nodesData);
//     simulationRef.current.force('link').links(linksData);

//     requestAnimationFrame(updateElementLocations);

//     window.addEventListener('resize', debouncedResetGraph.current);

//     return () => window.removeEventListener('resize', debouncedResetGraph.current);
//   }, []);

//   const getGraphWidth = () => document.querySelector('.graph-wrapper').getBoundingClientRect().width;

//   const getGraphData = () => {
//     const nodesData = [];
//     const linksData = [];

//     paths.forEach((path) => {
//       path.forEach((node, i) => {
//         const currentNodeId = node.title;

//         if (!some(nodesData, ['id', currentNodeId])) {
//           nodesData.push({
//             id: currentNodeId,
//             title: node.title,
//             degree: i,
//           });
//         }

//         if (i !== 0) {
//           linksData.push({
//             source: path[i - 1].title,
//             target: currentNodeId,
//           });
//         }
//       });
//     });

//     return {
//       nodesData,
//       linksData,
//     };
//   };

//   const getLegendLabels = () => {
//     const pathsLength = paths[0].length;

//     return map(range(0, pathsLength), (i) => {
//       if (i === 0 && pathsLength === 1) {
//         return 'Start / end page';
//       } else if (i === 0) {
//         return 'Start page';
//       } else if (i === pathsLength - 1) {
//         return 'End page';
//       } else {
//         const degreeOrDegrees = i === 1 ? 'degree' : 'degrees';
//         return `${i} ${degreeOrDegrees} away`;
//       }
//     });
//   };

//   const updateElementLocations = () => {
//     for (let i = 0; i < ticksPerRenderRef.current; i++) {
//       simulationRef.current.tick();
//     }

//     linksRef.current
//       .attr('x1', (d) => d.source.x)
//       .attr('y1', (d) => d.source.y)
//       .attr('x2', (d) => d.target.x)
//       .attr('y2', (d) => d.target.y);

//     nodesRef.current.attr('cx', (d) => d.x).attr('cy', (d) => d.y);

//     nodeLabelsRef.current.attr('transform', (d) => `translate(${d.x}, ${d.y})`);

//     if (simulationRef.current.alpha() > 0.001) {
//       requestAnimationFrame(updateElementLocations);
//     }
//   };

//   const zoomed = () => {
//     graphRef.current.attr(
//       `transform`,
//       `translate(${d3.event.transform.x}, ${d3.event.transform.y}) scale(${d3.event.transform.k})`
//     );
//   };

//   const dragstarted = (d) => {
//     if (!d3.event.active) {
//       simulationRef.current.alphaTarget(0.3).restart();
//       requestAnimationFrame(updateElementLocations);
//     }
//     d.fx = d.x;
//     d.fy = d.y;
//   };

//   const dragged = (d) => {
//     d.fx = d3.event.x;
//     d.fy = d3.event.y;
//   };

//   const dragended = (d) => {
//     if (!d3.event.active) {
//       simulationRef.current.alphaTarget(0);
//     }
//     d.fx = null;
//     d.fy = null;
//   };

//   const resetGraph = (forceReset) => {
//     const priorGraphWidth = graphWidthRef.current;
//     graphWidthRef.current = getGraphWidth();

//     if (forceReset || priorGraphWidth !== graphWidthRef.current) {
//       simulationRef.current.force('center', d3.forceCenter(graphWidthRef.current / 2, DEFAULT_CHART_HEIGHT / 2));
//       simulationRef.current.alpha(0.3).restart();

//       zoomable.attr('width', graphWidthRef.current);
//       zoomable.transition().duration(750).call(zoom.transform, d3.zoomIdentity);

//       requestAnimationFrame(updateElementLocations);
//     }
//   };

//   const renderLegend = () => {
//     const legendContent = getLegendLabels().map((label, i) => {
//       return (
//         <LegendItem key={i}>
//           <LegendCircle fill={color(i)} stroke={d3.rgb(color(i)).darker(2)} />
//           <LegendLabel>{label}</LegendLabel>
//         </LegendItem>
//       );
//     });
//     return <Legend>{legendContent}</Legend>;
//   };

//   return (
//     <GraphWrapper className="graph-wrapper">
//       {renderLegend()}

//       <Instructions>
//         <p>Drag to pan. Scroll to zoom.</p>
//         <p>Click node to open Wikipedia page.</p>
//       </Instructions>

//       <ResetButton onClick={() => resetGraph(true)}>
//         <svg viewBox="0 0 100 100">
//           <path d="m49.528 87h-0.06c-18.563 0-34.132-13.316-37.017-31.588-0.172-1.091-1.197-1.839-2.288-1.667s-1.836 1.201-1.664 2.292c3.195 20.225 20.422 34.963 40.963 34.963h0.066c11.585 0 22.714-4.672 30.542-12.814 7.451-7.751 11.311-17.963 10.869-28.751-0.952-23.211-19.169-41.394-41.474-41.394-15.237 0-29.288 8.546-36.465 21.722v-18.763c0-1.104-0.896-2-2-2s-2 0.896-2 2v25c0 1.104 0.896 2 2 2h25c1.104 0 2-0.896 2-2s-0.896-2-2-2h-20.635c6.034-13.216 19.456-21.961 34.101-21.961 20.152 0 36.613 16.497 37.476 37.557 0.397 9.688-3.067 18.861-9.755 25.818-7.078 7.361-17.156 11.586-27.659 11.586z" />
//         </svg>
//       </ResetButton>

//       <GraphSvg ref={graphRef} />
//     </GraphWrapper>
//   );
// };

// export default Graph;

export function runForceGraph(
  container,
  linksData,
  nodesData,
  nodeHoverTooltip
) {
  const links = linksData.map(data => Object.assign({},data)) // {source: , target: }
  const nodes = nodesData.map(data => Object.assign({},data)) // {id: ,name: ,gender: }
  const containerRect = container.getBoundingClientRect()
  
  //helper functions
  const getClass = (d) => {
    return d.gender === "male" ? 'fill-black' : 'fill-blue';
  };

  // option to drag function
}

export default function Graph() {
  const linksData = data.links // array of {source: , target: }
  const nodesData = data.nodes // array of {id: ,name: ,gender: }
  const nodeHoverTooltip = React.useCallback((node) => {
    return `<div>${node.name}</div>`;
  }, [])

  const containerRef = useRef(null)
  useEffect(()=>{
    let destroyFn;

    if (containerRef.current) {
      const { destroy } = runForceGraph(containerRef.current, linksData, nodesData, nodeHoverTooltip);
      destroyFn = destroy;
    }
    return destroyFn;
  },[])

  return (<>
  </>)
}
