import React, { useRef, useEffect } from "react";
// import ReactDOM from "react-dom";
import ForceGraph2D from "react-force-graph-2d";
// import "./styles.css";

var data = {
  nodes: [{ id: "A" }, { id: "B" }, { id: "C" }, { id: "D" }],
  links: [
    { source: "B", target: "C", value: 8 },
    { source: "C", target: "D", value: 10 },
    { source: "D", target: "A", value: 6 },
    { source: "B", target: "A", value: 6 },
    { source: "B", target: "D", value: 6 },
    { source: "D", target: "D", value: 6}
  ]
};

export default function Graph2() {
    const forceRef = useRef(null);
    
    useEffect(() => {
      forceRef.current.d3Force("charge").strength(-400);
    });
    return (
        <div className=" justify-center m-auto flex flex-row py-5 my-5">
            {/* <div className=" bg-slate-500 w-10 h-10"></div> */}
            <ForceGraph2D
              backgroundColor="white"
              width={700}
              height={500}
              graphData={data}
              nodeLabel="id"
              nodeAutoColorBy="id"
              nodeCanvasObject={(node, ctx, globalScale) => {
                    const label = node.id;
                    const fontSize = 12/globalScale;
                    ctx.font = `${fontSize}px Sans-Serif`;
                    const textWidth = ctx.measureText(label).width;
                    const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

                    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = node.color;
                    ctx.fillText(label, node.x, node.y);

                    node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
                }}
              linkDirectionalArrowLength={6}
              enablePointerInteraction={true}
              linkDirectionalParticleWidth={1}
              ref={forceRef}
            />
        </div>
    );
}
