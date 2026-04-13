import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plant } from '@/data/plants';
import { useSeedVerse } from '@/contexts/SeedVerseContext';
import { RotateCcw } from 'lucide-react';

const GRID = 3;
const TOTAL = GRID * GRID;

const scenePalettes: Record<string, string[]> = {
  sun: ['#FDE68A', '#FBBF24', '#F59E0B', '#D97706', '#92400E'],
  leaf: ['#A7F3D0', '#34D399', '#10B981', '#059669', '#065F46'],
  petal: ['#FBCFE8', '#F9A8D4', '#F472B6', '#EC4899', '#BE185D'],
  sky: ['#BFDBFE', '#93C5FD', '#60A5FA', '#3B82F6', '#1D4ED8'],
  fruit: ['#FECACA', '#FCA5A5', '#F87171', '#EF4444', '#B91C1C'],
};

// Draw detailed plant-specific illustration
function drawPlantScene(ctx: CanvasRenderingContext2D, plant: Plant, size: number) {
  const colors = scenePalettes[plant.color] || scenePalettes.leaf;

  if (plant.id === 'sunflower') {
    // Sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, size * 0.6);
    skyGrad.addColorStop(0, '#87CEEB');
    skyGrad.addColorStop(1, '#E0F0FF');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, size, size * 0.65);
    // Sun
    ctx.beginPath(); ctx.arc(size * 0.8, size * 0.15, 30, 0, Math.PI * 2);
    ctx.fillStyle = '#FFD700'; ctx.fill();
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(size * 0.8 + Math.cos(angle) * 35, size * 0.15 + Math.sin(angle) * 35);
      ctx.lineTo(size * 0.8 + Math.cos(angle) * 50, size * 0.15 + Math.sin(angle) * 50);
      ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 3; ctx.stroke();
    }
    // Ground
    const groundGrad = ctx.createLinearGradient(0, size * 0.6, 0, size);
    groundGrad.addColorStop(0, '#8BC34A');
    groundGrad.addColorStop(1, '#558B2F');
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, size * 0.6, size, size * 0.4);
    // Sunflowers
    const drawSunflower = (cx: number, stemH: number, headR: number) => {
      // Stem
      ctx.beginPath(); ctx.moveTo(cx, size * 0.6); ctx.lineTo(cx, size * 0.6 - stemH);
      ctx.strokeStyle = '#388E3C'; ctx.lineWidth = 6; ctx.stroke();
      // Leaves on stem
      ctx.beginPath(); ctx.ellipse(cx - 18, size * 0.6 - stemH * 0.4, 20, 8, -0.5, 0, Math.PI * 2);
      ctx.fillStyle = '#4CAF50'; ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx + 18, size * 0.6 - stemH * 0.6, 18, 7, 0.5, 0, Math.PI * 2);
      ctx.fillStyle = '#66BB6A'; ctx.fill();
      // Petals
      const cy = size * 0.6 - stemH;
      for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        ctx.beginPath();
        ctx.ellipse(cx + Math.cos(angle) * headR, cy + Math.sin(angle) * headR, headR * 0.55, headR * 0.2, angle, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? '#FFD600' : '#FFAB00'; ctx.fill();
      }
      // Center disc
      ctx.beginPath(); ctx.arc(cx, cy, headR * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = '#5D4037'; ctx.fill();
      // Seeds pattern
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        ctx.beginPath(); ctx.arc(cx + Math.cos(a) * headR * 0.25, cy + Math.sin(a) * headR * 0.25, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#3E2723'; ctx.fill();
      }
    };
    drawSunflower(size * 0.25, 140, 28);
    drawSunflower(size * 0.5, 170, 35);
    drawSunflower(size * 0.75, 130, 25);
    // Small flowers in grass
    for (let i = 0; i < 5; i++) {
      ctx.beginPath(); ctx.arc(30 + i * 60, size * 0.63, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#FFEB3B'; ctx.fill();
    }
  } else if (plant.id === 'lotus') {
    // Water/sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, size * 0.4);
    skyGrad.addColorStop(0, '#B3E5FC'); skyGrad.addColorStop(1, '#E1F5FE');
    ctx.fillStyle = skyGrad; ctx.fillRect(0, 0, size, size * 0.4);
    // Water
    const waterGrad = ctx.createLinearGradient(0, size * 0.35, 0, size);
    waterGrad.addColorStop(0, '#4FC3F7'); waterGrad.addColorStop(0.5, '#0288D1'); waterGrad.addColorStop(1, '#01579B');
    ctx.fillStyle = waterGrad; ctx.fillRect(0, size * 0.35, size, size * 0.65);
    // Water ripples
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.ellipse(50 + i * 45, size * 0.7 + (i % 2) * 20, 30, 3, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1; ctx.stroke();
    }
    // Lotus leaves
    const drawLeaf = (cx: number, cy: number, r: number) => {
      ctx.beginPath(); ctx.ellipse(cx, cy, r, r * 0.6, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#2E7D32'; ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx, cy, r * 0.85, r * 0.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#388E3C'; ctx.fill();
      // Veins
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        ctx.beginPath(); ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a) * r * 0.7, cy + Math.sin(a) * r * 0.4);
        ctx.strokeStyle = '#1B5E20'; ctx.lineWidth = 1; ctx.stroke();
      }
    };
    drawLeaf(size * 0.2, size * 0.55, 40);
    drawLeaf(size * 0.65, size * 0.6, 45);
    drawLeaf(size * 0.9, size * 0.52, 35);
    // Lotus flowers
    const drawLotus = (cx: number, cy: number, petalR: number) => {
      // Stem
      ctx.beginPath(); ctx.moveTo(cx, cy + 10); ctx.lineTo(cx, size * 0.75);
      ctx.strokeStyle = '#388E3C'; ctx.lineWidth = 3; ctx.stroke();
      // Petals
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI - Math.PI * 0.5;
        ctx.beginPath();
        ctx.ellipse(cx + Math.cos(angle) * petalR * 0.5, cy + Math.sin(angle) * petalR * 0.3 - 5, petalR * 0.4, petalR * 0.15, angle * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? '#F48FB1' : '#FCE4EC'; ctx.fill();
      }
      // Center
      ctx.beginPath(); ctx.arc(cx, cy - 5, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#FFEB3B'; ctx.fill();
    };
    drawLotus(size * 0.35, size * 0.38, 30);
    drawLotus(size * 0.7, size * 0.33, 25);
    // Dragonfly
    ctx.beginPath(); ctx.ellipse(size * 0.15, size * 0.25, 8, 2, 0.3, 0, Math.PI * 2);
    ctx.fillStyle = '#42A5F5'; ctx.fill();
    ctx.beginPath(); ctx.ellipse(size * 0.15 + 5, size * 0.25 - 5, 12, 3, 0.8, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(200,230,255,0.5)'; ctx.fill();
  } else if (plant.id === 'plum') {
    // Winter sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, size);
    skyGrad.addColorStop(0, '#90A4AE'); skyGrad.addColorStop(1, '#CFD8DC');
    ctx.fillStyle = skyGrad; ctx.fillRect(0, 0, size, size);
    // Snow ground
    ctx.fillStyle = '#ECEFF1';
    ctx.beginPath(); ctx.moveTo(0, size * 0.7);
    ctx.quadraticCurveTo(size * 0.3, size * 0.65, size * 0.5, size * 0.72);
    ctx.quadraticCurveTo(size * 0.8, size * 0.68, size, size * 0.73);
    ctx.lineTo(size, size); ctx.lineTo(0, size); ctx.fill();
    // Tree trunk
    ctx.beginPath(); ctx.moveTo(size * 0.45, size * 0.7);
    ctx.quadraticCurveTo(size * 0.42, size * 0.5, size * 0.4, size * 0.35);
    ctx.quadraticCurveTo(size * 0.38, size * 0.3, size * 0.35, size * 0.25);
    ctx.lineTo(size * 0.37, size * 0.25);
    ctx.quadraticCurveTo(size * 0.44, size * 0.3, size * 0.46, size * 0.5);
    ctx.lineTo(size * 0.5, size * 0.7);
    ctx.fillStyle = '#5D4037'; ctx.fill();
    // Branches
    const drawBranch = (x1: number, y1: number, x2: number, y2: number, w: number) => {
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
      ctx.strokeStyle = '#4E342E'; ctx.lineWidth = w; ctx.stroke();
    };
    drawBranch(size * 0.4, size * 0.35, size * 0.2, size * 0.2, 3);
    drawBranch(size * 0.2, size * 0.2, size * 0.1, size * 0.15, 2);
    drawBranch(size * 0.42, size * 0.4, size * 0.65, size * 0.25, 3);
    drawBranch(size * 0.65, size * 0.25, size * 0.8, size * 0.18, 2);
    drawBranch(size * 0.38, size * 0.3, size * 0.3, size * 0.18, 2);
    drawBranch(size * 0.55, size * 0.3, size * 0.7, size * 0.35, 2);
    // Plum blossoms
    const drawBlossom = (cx: number, cy: number, r: number) => {
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
        ctx.beginPath();
        ctx.ellipse(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r, r * 0.7, r * 0.4, angle, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? '#F48FB1' : '#F8BBD0'; ctx.fill();
      }
      ctx.beginPath(); ctx.arc(cx, cy, r * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = '#FFEB3B'; ctx.fill();
    };
    drawBlossom(size * 0.18, size * 0.18, 7);
    drawBlossom(size * 0.25, size * 0.22, 6);
    drawBlossom(size * 0.12, size * 0.14, 5);
    drawBlossom(size * 0.62, size * 0.23, 8);
    drawBlossom(size * 0.72, size * 0.2, 6);
    drawBlossom(size * 0.78, size * 0.17, 7);
    drawBlossom(size * 0.32, size * 0.17, 5);
    drawBlossom(size * 0.55, size * 0.28, 6);
    drawBlossom(size * 0.68, size * 0.33, 5);
    // Snowflakes
    ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < 15; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * size, Math.random() * size * 0.7, 2 + Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (plant.id === 'pine') {
    // Mountain sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, size * 0.5);
    skyGrad.addColorStop(0, '#81D4FA'); skyGrad.addColorStop(1, '#E1F5FE');
    ctx.fillStyle = skyGrad; ctx.fillRect(0, 0, size, size);
    // Mountains
    ctx.beginPath(); ctx.moveTo(0, size * 0.5);
    ctx.lineTo(size * 0.2, size * 0.25); ctx.lineTo(size * 0.4, size * 0.45);
    ctx.lineTo(size * 0.6, size * 0.2); ctx.lineTo(size * 0.85, size * 0.4);
    ctx.lineTo(size, size * 0.35); ctx.lineTo(size, size * 0.5);
    ctx.fillStyle = '#78909C'; ctx.fill();
    // Ground
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(0, size * 0.5, size, size * 0.5);
    ctx.fillStyle = '#388E3C';
    ctx.fillRect(0, size * 0.75, size, size * 0.25);
    // Pine trees
    const drawPine = (cx: number, baseY: number, h: number) => {
      // Trunk
      ctx.fillStyle = '#5D4037';
      ctx.fillRect(cx - 4, baseY - h * 0.3, 8, h * 0.3);
      // Layers
      for (let layer = 0; layer < 3; layer++) {
        const ly = baseY - h * 0.3 - layer * h * 0.25;
        const w = (3 - layer) * h * 0.2;
        ctx.beginPath();
        ctx.moveTo(cx - w, ly); ctx.lineTo(cx, ly - h * 0.3); ctx.lineTo(cx + w, ly);
        ctx.fillStyle = layer % 2 === 0 ? '#2E7D32' : '#388E3C';
        ctx.fill();
      }
    };
    drawPine(size * 0.15, size * 0.65, 100);
    drawPine(size * 0.45, size * 0.6, 130);
    drawPine(size * 0.75, size * 0.63, 110);
    drawPine(size * 0.92, size * 0.7, 80);
    // Clouds
    const drawCloud = (cx: number, cy: number) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 15, 0, Math.PI * 2);
      ctx.arc(cx + 15, cy - 5, 12, 0, Math.PI * 2);
      ctx.arc(cx + 25, cy, 10, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.fill();
    };
    drawCloud(size * 0.15, size * 0.1);
    drawCloud(size * 0.6, size * 0.08);
  } else if (plant.id === 'rose') {
    // Garden background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, size);
    bgGrad.addColorStop(0, '#E8F5E9'); bgGrad.addColorStop(1, '#C8E6C9');
    ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, size, size);
    // Garden fence
    ctx.fillStyle = '#BCAAA4';
    for (let i = 0; i < 8; i++) {
      ctx.fillRect(i * 42, size * 0.5, 6, size * 0.5);
      ctx.beginPath(); ctx.moveTo(i * 42, size * 0.5);
      ctx.lineTo(i * 42 + 3, size * 0.45); ctx.lineTo(i * 42 + 6, size * 0.5);
      ctx.fill();
    }
    ctx.fillRect(0, size * 0.6, size, 4);
    // Rose bushes
    const drawRose = (cx: number, cy: number, r: number, color: string) => {
      // Leaves
      ctx.beginPath(); ctx.ellipse(cx - r * 1.5, cy + r, r * 0.8, r * 0.3, -0.3, 0, Math.PI * 2);
      ctx.fillStyle = '#4CAF50'; ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx + r * 1.5, cy + r * 0.5, r * 0.7, r * 0.3, 0.3, 0, Math.PI * 2);
      ctx.fillStyle = '#66BB6A'; ctx.fill();
      // Stem
      ctx.beginPath(); ctx.moveTo(cx, cy + r); ctx.lineTo(cx, cy + r * 3);
      ctx.strokeStyle = '#388E3C'; ctx.lineWidth = 2; ctx.stroke();
      // Petals (spiral rose)
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const pr = r * (0.4 + (i % 3) * 0.2);
        ctx.beginPath();
        ctx.ellipse(cx + Math.cos(angle) * pr * 0.5, cy + Math.sin(angle) * pr * 0.5, pr * 0.35, pr * 0.2, angle, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? color : color + 'CC'; ctx.fill();
      }
      ctx.beginPath(); ctx.arc(cx, cy, r * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = color; ctx.fill();
    };
    drawRose(size * 0.2, size * 0.35, 18, '#E91E63');
    drawRose(size * 0.5, size * 0.3, 22, '#F44336');
    drawRose(size * 0.8, size * 0.38, 16, '#FF9800');
    drawRose(size * 0.35, size * 0.55, 14, '#E91E63');
    drawRose(size * 0.65, size * 0.52, 15, '#FFEB3B');
    // Butterfly
    ctx.beginPath(); ctx.ellipse(size * 0.85, size * 0.15, 6, 2, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#FF9800'; ctx.fill();
    ctx.beginPath(); ctx.ellipse(size * 0.85 + 5, size * 0.15 - 5, 10, 5, 0.8, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,152,0,0.5)'; ctx.fill();
  } else if (plant.id === 'orchid') {
    // Deep valley background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, size);
    bgGrad.addColorStop(0, '#1B5E20'); bgGrad.addColorStop(0.5, '#2E7D32'); bgGrad.addColorStop(1, '#33691E');
    ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, size, size);
    // Light rays
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(size * 0.3 + i * 30, 0);
      ctx.lineTo(size * 0.2 + i * 40, size);
      ctx.lineTo(size * 0.25 + i * 40, size);
      ctx.lineTo(size * 0.35 + i * 30, 0);
      ctx.fillStyle = 'rgba(255,255,200,0.08)'; ctx.fill();
    }
    // Rocks
    ctx.beginPath(); ctx.ellipse(size * 0.2, size * 0.8, 50, 30, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#546E7A'; ctx.fill();
    ctx.beginPath(); ctx.ellipse(size * 0.7, size * 0.85, 40, 25, 0.2, 0, Math.PI * 2);
    ctx.fillStyle = '#607D8B'; ctx.fill();
    // Orchid leaves
    const drawOrchidLeaf = (cx: number, cy: number, len: number, angle: number) => {
      ctx.beginPath();
      ctx.ellipse(cx + Math.cos(angle) * len * 0.5, cy + Math.sin(angle) * len * 0.5, len * 0.5, 4, angle, 0, Math.PI * 2);
      ctx.fillStyle = '#4CAF50'; ctx.fill();
    };
    const ox = size * 0.45, oy = size * 0.55;
    drawOrchidLeaf(ox, oy, 60, -0.8);
    drawOrchidLeaf(ox, oy, 55, -0.3);
    drawOrchidLeaf(ox, oy, 50, 0.2);
    drawOrchidLeaf(ox, oy, 45, 0.7);
    // Orchid flowers
    const drawOrchid = (cx: number, cy: number, s: number) => {
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        ctx.beginPath();
        ctx.ellipse(cx + Math.cos(a) * s, cy + Math.sin(a) * s, s * 0.6, s * 0.25, a, 0, Math.PI * 2);
        ctx.fillStyle = '#C8E6C9'; ctx.fill();
      }
      // Lip petal
      ctx.beginPath(); ctx.ellipse(cx, cy + s * 0.8, s * 0.5, s * 0.3, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#E8F5E9'; ctx.fill();
      ctx.beginPath(); ctx.arc(cx, cy, s * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = '#FFEB3B'; ctx.fill();
    };
    // Flower stem
    ctx.beginPath(); ctx.moveTo(ox + 5, oy - 10);
    ctx.quadraticCurveTo(ox + 30, oy - 60, ox + 20, oy - 100);
    ctx.strokeStyle = '#388E3C'; ctx.lineWidth = 2; ctx.stroke();
    drawOrchid(ox + 20, oy - 105, 12);
    drawOrchid(ox + 28, oy - 85, 10);
    drawOrchid(ox + 15, oy - 65, 11);
    // Moss
    for (let i = 0; i < 20; i++) {
      ctx.beginPath(); ctx.arc(Math.random() * size, size * 0.75 + Math.random() * size * 0.2, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#81C784'; ctx.fill();
    }
  } else if (plant.id === 'chrysanthemum') {
    // Autumn garden
    const bgGrad = ctx.createLinearGradient(0, 0, 0, size);
    bgGrad.addColorStop(0, '#FFF8E1'); bgGrad.addColorStop(1, '#FFE0B2');
    ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, size, size);
    // Fence
    ctx.fillStyle = '#8D6E63';
    for (let i = 0; i < 6; i++) {
      const fx = 20 + i * 55;
      ctx.fillRect(fx, size * 0.45, 4, size * 0.3);
    }
    ctx.fillRect(15, size * 0.55, size - 30, 3);
    // Ground with fallen leaves
    ctx.fillStyle = '#A1887F';
    ctx.fillRect(0, size * 0.75, size, size * 0.25);
    // Chrysanthemum plants
    const drawMum = (cx: number, cy: number, r: number, color: string) => {
      // Stem + leaves
      ctx.beginPath(); ctx.moveTo(cx, cy + r); ctx.lineTo(cx, size * 0.75);
      ctx.strokeStyle = '#558B2F'; ctx.lineWidth = 3; ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx - 12, cy + r * 1.5, 12, 5, -0.3, 0, Math.PI * 2);
      ctx.fillStyle = '#689F38'; ctx.fill();
      // Many thin petals
      for (let i = 0; i < 24; i++) {
        const angle = (i / 24) * Math.PI * 2;
        const pr = r * (0.7 + (i % 3) * 0.15);
        ctx.beginPath();
        ctx.ellipse(cx + Math.cos(angle) * pr * 0.5, cy + Math.sin(angle) * pr * 0.5, pr * 0.4, 2, angle, 0, Math.PI * 2);
        ctx.fillStyle = i % 3 === 0 ? color : color + 'DD'; ctx.fill();
      }
      ctx.beginPath(); ctx.arc(cx, cy, r * 0.15, 0, Math.PI * 2);
      ctx.fillStyle = '#FF8F00'; ctx.fill();
    };
    drawMum(size * 0.2, size * 0.4, 25, '#FFC107');
    drawMum(size * 0.5, size * 0.35, 30, '#FF5722');
    drawMum(size * 0.8, size * 0.42, 22, '#FFFFFF');
    drawMum(size * 0.35, size * 0.58, 18, '#9C27B0');
    // Falling leaves
    ctx.font = '16px serif';
    ctx.fillText('🍂', size * 0.1, size * 0.2);
    ctx.fillText('🍁', size * 0.7, size * 0.15);
    ctx.fillText('🍂', size * 0.85, size * 0.3);
  } else {
    // Generic plant scene
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, colors[0]); gradient.addColorStop(0.5, colors[1]); gradient.addColorStop(1, colors[2]);
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, size, size);
    ctx.font = '80px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(plant.emoji, size / 2, size / 2 - 20);
    ctx.font = 'bold 22px sans-serif'; ctx.fillStyle = '#fff';
    ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 6;
    ctx.fillText(plant.scene.name, size / 2, size - 40);
    ctx.shadowBlur = 0;
  }
}

interface Props {
  plant: Plant;
  onBack: () => void;
}

const SlidingPuzzle = ({ plant, onBack }: Props) => {
  const { collectSeed, incrementGame, getSeed, addPoints } = useSeedVerse();
  const alreadyCollected = !!getSeed(plant.id);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageData, setImageData] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const size = 300;
    canvas.width = size;
    canvas.height = size;
    drawPlantScene(ctx, plant, size);
    setImageData(canvas.toDataURL());
  }, [plant]);

  const solved = useMemo(() => Array.from({ length: TOTAL }, (_, i) => i), []);
  const [tiles, setTiles] = useState<number[]>(() => {
    const arr = [...Array.from({ length: TOTAL }, (_, i) => i)];
    let inversions = 0;
    do {
      for (let i = TOTAL - 2; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      inversions = 0;
      for (let i = 0; i < TOTAL - 1; i++) {
        for (let j = i + 1; j < TOTAL - 1; j++) {
          if (arr[i] !== TOTAL - 1 && arr[j] !== TOTAL - 1 && arr[i] > arr[j]) inversions++;
        }
      }
    } while (inversions % 2 !== 0);
    return arr;
  });
  const [completed, setCompleted] = useState(false);
  const [moves, setMoves] = useState(0);

  const emptyIdx = tiles.indexOf(TOTAL - 1);

  const canMove = (idx: number) => {
    const eRow = Math.floor(emptyIdx / GRID);
    const eCol = emptyIdx % GRID;
    const tRow = Math.floor(idx / GRID);
    const tCol = idx % GRID;
    return (Math.abs(eRow - tRow) + Math.abs(eCol - tCol)) === 1;
  };

  const handleTap = useCallback((idx: number) => {
    if (completed || !canMove(idx)) return;
    setTiles(prev => {
      const next = [...prev];
      [next[idx], next[emptyIdx]] = [next[emptyIdx], next[idx]];
      const win = next.every((v, i) => v === i);
      if (win) {
        setCompleted(true);
        incrementGame();
        addPoints(3);
        if (!alreadyCollected) collectSeed(plant.id);
      }
      return next;
    });
    setMoves(m => m + 1);
  }, [completed, emptyIdx, alreadyCollected, plant.id]);

  return (
    <div className="card-nature p-4 space-y-4">
      <canvas ref={canvasRef} className="hidden" />
      <div className="text-center">
        <span className="text-4xl">{plant.emoji}</span>
        <h3 className="font-bold text-foreground mt-1">{plant.scene.name} · 滑块拼图</h3>
        <p className="text-[10px] text-muted-foreground">点击空格旁边的方块来移动，还原完整图片</p>
        <p className="text-xs text-muted-foreground mt-1">步数：{moves}</p>
      </div>

      {imageData && (
        <div className="flex justify-center">
          <div className="relative">
            <p className="text-[10px] text-muted-foreground text-center mb-1">参考图</p>
            <img src={imageData} alt="参考" className="w-24 h-24 rounded-xl border-2 border-border" />
          </div>
        </div>
      )}

      <div className="relative mx-auto rounded-2xl overflow-hidden border-2 border-border" style={{ width: 270, height: 270 }}>
        {tiles.map((tile, idx) => {
          if (tile === TOTAL - 1 && !completed) return null;
          const srcRow = Math.floor(tile / GRID);
          const srcCol = tile % GRID;
          const row = Math.floor(idx / GRID);
          const col = idx % GRID;
          const movable = canMove(idx);

          return (
            <motion.button
              key={tile}
              layout
              onClick={() => handleTap(idx)}
              className={`absolute overflow-hidden ${movable && !completed ? 'cursor-pointer ring-2 ring-primary/30' : ''}`}
              style={{ width: 90, height: 90, left: col * 90, top: row * 90 }}
              whileTap={movable ? { scale: 0.95 } : undefined}
            >
              {imageData && (
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage: `url(${imageData})`,
                    backgroundSize: '270px 270px',
                    backgroundPosition: `-${srcCol * 90}px -${srcRow * 90}px`,
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {completed && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center space-y-3">
          <p className="text-3xl">🎉</p>
          <p className="font-bold text-foreground">拼图完成！用了 {moves} 步</p>
          {!alreadyCollected && (
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-leaf font-bold">
              🌱 解锁了新种子：{plant.name}！
            </motion.p>
          )}
          <button onClick={onBack} className="btn-sun text-sm">
            <RotateCcw size={14} className="inline mr-1" /> 继续挑战
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default SlidingPuzzle;
