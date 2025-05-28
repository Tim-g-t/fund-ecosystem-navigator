
import React, { useRef, useEffect, useState } from 'react';
import { VCFund, Person, Connection } from '../types/vc-data';

interface NetworkGraphProps {
  funds: VCFund[];
  people: Person[];
  connections: Connection[];
  selectedNode?: string;
  onNodeSelect: (nodeId: string, nodeType: 'fund' | 'person') => void;
}

interface Node {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'fund' | 'person';
  name: string;
  influence?: number;
  size: number;
  connections: string[];
}

interface Edge {
  source: string;
  target: string;
  strength: number;
}

export const NetworkGraph: React.FC<NetworkGraphProps> = ({
  funds,
  people,
  connections,
  selectedNode,
  onNodeSelect
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Initialize nodes and edges
  useEffect(() => {
    const fundNodes: Node[] = funds.map((fund, index) => ({
      id: fund.id,
      x: 200 + (index % 5) * 120, // More structured positioning
      y: 150 + Math.floor(index / 5) * 100,
      vx: 0,
      vy: 0,
      type: 'fund',
      name: fund.name,
      influence: fund.influenceScore,
      size: Math.max(15, Math.min(30, fund.teamSize * 3)), // Limited size range
      connections: fund.currentTeam
    }));

    const personNodes: Node[] = people.map((person, index) => ({
      id: person.id,
      x: 400 + (index % 8) * 60, // More structured positioning
      y: 200 + Math.floor(index / 8) * 50,
      vx: 0,
      vy: 0,
      type: 'person',
      name: person.name,
      influence: person.influence,
      size: Math.max(6, Math.min(12, person.influence / 8)), // Limited size range
      connections: person.connections
    }));

    const networkEdges: Edge[] = connections.map(conn => ({
      source: conn.person1,
      target: conn.person2,
      strength: conn.strength
    }));

    // Add fund-person connections
    people.forEach(person => {
      const fundId = person.currentFund.toLowerCase().replace(/\s+/g, '-');
      const fund = funds.find(f => f.id === fundId);
      if (fund) {
        networkEdges.push({
          source: fund.id,
          target: person.id,
          strength: 1.0
        });
      }
    });

    setNodes([...fundNodes, ...personNodes]);
    setEdges(networkEdges);
  }, [funds, people, connections]);

  // Gentler force simulation
  useEffect(() => {
    if (nodes.length === 0) return;

    let animationId: number;
    let frameCount = 0;

    const animate = () => {
      frameCount++;
      
      // Reduce animation frequency and intensity after initial frames
      if (frameCount > 300) {
        return; // Stop animation after stabilization
      }

      setNodes(prevNodes => {
        const newNodes = [...prevNodes];
        const dampening = Math.max(0.8, 1 - frameCount / 300); // Gradual dampening
        
        newNodes.forEach(node => {
          // Much gentler center force
          const centerX = 400;
          const centerY = 300;
          const centerForce = 0.001 * dampening;
          node.vx += (centerX - node.x) * centerForce;
          node.vy += (centerY - node.y) * centerForce;

          // Gentler repulsion between nodes
          newNodes.forEach(other => {
            if (node.id !== other.id) {
              const dx = node.x - other.x;
              const dy = node.y - other.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              const minDistance = node.size + other.size + 20;
              
              if (distance < minDistance && distance > 0) {
                const force = (minDistance - distance) * 0.01 * dampening;
                const fx = (dx / distance) * force;
                const fy = (dy / distance) * force;
                node.vx += fx;
                node.vy += fy;
              }
            }
          });

          // Strong velocity damping
          node.vx *= 0.9;
          node.vy *= 0.9;
          
          // Only apply velocity if it's significant
          if (Math.abs(node.vx) > 0.1 || Math.abs(node.vy) > 0.1) {
            node.x += node.vx;
            node.y += node.vy;
          }

          // Boundary constraints
          node.x = Math.max(node.size + 10, Math.min(790 - node.size, node.x));
          node.y = Math.max(node.size + 10, Math.min(590 - node.size, node.y));
        });

        return newNodes;
      });

      if (frameCount < 300) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [nodes.length]);

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, 800, 600);

    // Draw edges
    edges.forEach(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      
      if (sourceNode && targetNode) {
        ctx.strokeStyle = `rgba(99, 102, 241, ${edge.strength * 0.4})`;
        ctx.lineWidth = edge.strength * 2;
        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);
        ctx.lineTo(targetNode.x, targetNode.y);
        ctx.stroke();
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      const isSelected = selectedNode === node.id;
      const isHovered = hoveredNode === node.id;
      
      if (node.type === 'fund') {
        // Fund nodes - hexagonal
        ctx.fillStyle = isSelected ? '#fbbf24' : '#1e40af';
        ctx.strokeStyle = isHovered ? '#fbbf24' : '#1e3a8a';
        ctx.lineWidth = isSelected ? 3 : 2;
        
        const sides = 6;
        const radius = node.size;
        ctx.beginPath();
        for (let i = 0; i < sides; i++) {
          const angle = (i * 2 * Math.PI) / sides;
          const x = node.x + radius * Math.cos(angle);
          const y = node.y + radius * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        // Person nodes - circular
        ctx.fillStyle = isSelected ? '#fbbf24' : '#6366f1';
        ctx.strokeStyle = isHovered ? '#fbbf24' : '#4f46e5';
        ctx.lineWidth = isSelected ? 2 : 1;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      }

      // Draw labels for selected/hovered or larger nodes
      if (isSelected || isHovered || node.size > 10) {
        ctx.fillStyle = '#1f2937';
        ctx.font = `${Math.max(8, node.size / 2)}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        const maxLength = 15;
        const displayName = node.name.length > maxLength ? 
          node.name.substring(0, maxLength) + '...' : node.name;
        ctx.fillText(displayName, node.x, node.y + node.size + 12);
      }
    });
  }, [nodes, edges, selectedNode, hoveredNode]);

  // Handle mouse interactions
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Find hovered node
    const hoveredNode = nodes.find(node => {
      const dx = x - node.x;
      const dy = y - node.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance <= node.size;
    });

    setHoveredNode(hoveredNode?.id || null);
    canvas.style.cursor = hoveredNode ? 'pointer' : 'default';
  };

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Find clicked node
    const clickedNode = nodes.find(node => {
      const dx = x - node.x;
      const dy = y - node.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance <= node.size;
    });

    if (clickedNode) {
      onNodeSelect(clickedNode.id, clickedNode.type);
    }
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="border border-slate-200 rounded-lg bg-slate-50 cursor-default"
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      />
      
      {hoveredNode && (
        <div className="absolute top-2 left-2 bg-white p-2 rounded-lg shadow-lg border z-10">
          <div className="text-sm font-medium">
            {nodes.find(n => n.id === hoveredNode)?.name}
          </div>
          <div className="text-xs text-slate-600">
            {nodes.find(n => n.id === hoveredNode)?.type === 'fund' ? 'VC Fund' : 'Individual'}
          </div>
        </div>
      )}
    </div>
  );
};
