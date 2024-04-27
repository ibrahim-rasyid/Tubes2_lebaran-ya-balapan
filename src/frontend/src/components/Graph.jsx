import React, { useRef, useEffect } from "react";
import ForceGraph2D from "react-force-graph-2d";
import some from 'lodash.some'

export default function Graph({paths, resultCount}) {
    const forceRef = useRef(null);
    const getGraphData = () => {
      const nodes = [];
      const links = [];

      for (let index = 0; index < resultCount; index++) {
        paths[index].forEach((node, i) => {
          const currentNodeID = node.Title;
  
          if (!some(nodes, ['id', currentNodeID])) {
            nodes.push({
              id: currentNodeID,
              title: node.Title,
              degree: i,
            });
          }
  
          if (i !== 0) {
            links.push({
              source: paths[index][i - 1].Title,
              target: currentNodeID,
            });
          }
        });
      }
      return {
          nodes,
          links,
      };
    }
    
    useEffect(() => {
      forceRef.current.d3Force("charge").strength(-400);
    });

    const data = getGraphData()
    console.log(data)
    return (
        <div className="justify-center overflow-hidden top-10 flex flex-row  max-w-[900px] max-h-[500px] mx-auto mb-40 relative bg-white rounded-md border-2 border-black">
            <ForceGraph2D
              width={900}
              height={500}
              minZoom={1.9}
              graphData={data}
              nodeLabel="id"
              nodeAutoColorBy="degree"
              nodeCanvasObject={(node, ctx, globalScale) => {
                    const label = node.id;
                    const fontSize = 12/globalScale;
                    ctx.font = `${fontSize}px Sans-Serif`;
                    const textWidth = ctx.measureText(label).width;
                    const radius = textWidth / 2 + 5;

                    ctx.beginPath();
                    ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
                    ctx.fillStyle = node.color;
                    ctx.fill();
                    ctx.strokeStyle = 'black';
                    ctx.stroke();
                    ctx.closePath();

                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = "black";
                    ctx.fillText(label, node.x, node.y);
                }}
              linkDirectionalArrowLength={6}
              linkDirectionalArrowRelPos={0.6}
              onNodeClick={node => {
                forceRef.current.centerAt(node.x, node.y, 1000)
                forceRef.current.zoom(8, 2000)}}
              enablePointerInteraction={true}
              ref={forceRef}
            />
        </div>
    );
}
