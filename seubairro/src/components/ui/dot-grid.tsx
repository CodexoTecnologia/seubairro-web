'use client';
import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import '@/styles/ui/dot-grid.css';

interface Dot {
    cx: number;
    cy: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
}

export interface DotGridProps {
    dotSize?: number;
    gap?: number;
    baseColor?: string;
    activeColor?: string;
    proximity?: number;
    shockRadius?: number;
    className?: string;
    style?: React.CSSProperties;
}

function hexToRgb(hex: string) {
    const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (!m) return { r: 0, g: 0, b: 0 };
    return {
        r: parseInt(m[1], 16),
        g: parseInt(m[2], 16),
        b: parseInt(m[3], 16)
    };
}

const DotGrid: React.FC<DotGridProps> = ({
    dotSize = 4,
    gap = 24,
    baseColor = '#5227FF',
    activeColor = '#5227FF',
    proximity = 120,
    shockRadius = 200,
    className = '',
    style
}) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const dotsRef = useRef<Dot[]>([]);
    const animationRef = useRef<number>(0);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);

    const FRICTION = 0.92;
    const SPRING = 0.05;
    const FORCE = 0.8;

    const pointerRef = useRef({
        x: -9999,
        y: -9999,
        isHovering: false
    });

    const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor]);
    const activeRgb = useMemo(() => hexToRgb(activeColor), [activeColor]);

    const buildGrid = useCallback(() => {
        const wrap = wrapperRef.current;
        const canvas = canvasRef.current;
        if (!wrap || !canvas) return;

        const { width, height } = wrap.getBoundingClientRect();
        if (width === 0 || height === 0) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `100%`;
        canvas.style.height = `100%`;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.scale(dpr, dpr);
        contextRef.current = ctx;

        const cols = Math.floor((width + gap) / (dotSize + gap));
        const rows = Math.floor((height + gap) / (dotSize + gap));
        const cell = dotSize + gap;

        const gridW = cell * cols - gap;
        const gridH = cell * rows - gap;
        const startX = (width - gridW) / 2 + dotSize / 2;
        const startY = (height - gridH) / 2 + dotSize / 2;

        const dots: Dot[] = [];
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const cx = startX + x * cell;
                const cy = startY + y * cell;
                dots.push({
                    cx,
                    cy,
                    x: cx,
                    y: cy,
                    vx: 0,
                    vy: 0
                });
            }
        }
        dotsRef.current = dots;
    }, [dotSize, gap]);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = contextRef.current;
        if (!canvas || !ctx) return;

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const dpr = window.devicePixelRatio || 1;
        ctx.scale(dpr, dpr);

        const { x: px, y: py } = pointerRef.current;
        const dotRadius = dotSize / 2;
        const proxSq = proximity * proximity;

        for (let i = 0; i < dotsRef.current.length; i++) {
            const dot = dotsRef.current[i];

            let dx = px - dot.x;
            let dy = py - dot.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < proxSq) {
                const dist = Math.sqrt(distSq);
                const angle = Math.atan2(dy, dx);
                const force = (proximity - dist) / proximity;

                const pushForce = force * FORCE;

                dot.vx -= Math.cos(angle) * pushForce;
                dot.vy -= Math.sin(angle) * pushForce;
            }

            const dxHome = dot.cx - dot.x;
            const dyHome = dot.cy - dot.y;

            dot.vx += dxHome * SPRING;
            dot.vy += dyHome * SPRING;

            dot.vx *= FRICTION;
            dot.vy *= FRICTION;

            dot.x += dot.vx;
            dot.y += dot.vy;

            const renderDx = px - dot.x;
            const renderDy = py - dot.y;
            const renderDistSq = renderDx * renderDx + renderDy * renderDy;

            let style = baseColor;

            if (renderDistSq < proxSq) {
                const dist = Math.sqrt(renderDistSq);
                let t = 1 - dist / proximity;
                t = Math.pow(t, 2);

                const r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * t);
                const g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * t);
                const b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * t);
                style = `rgb(${r},${g},${b})`;
            }

            ctx.beginPath();
            ctx.arc(dot.x, dot.y, dotRadius, 0, Math.PI * 2);
            ctx.fillStyle = style;
            ctx.fill();
        }

        animationRef.current = requestAnimationFrame(draw);
    }, [baseColor, activeColor, baseRgb, activeRgb, proximity, dotSize]);

    useEffect(() => {
        buildGrid();

        let timeout: NodeJS.Timeout;
        const onResize = () => {
            clearTimeout(timeout);
            timeout = setTimeout(buildGrid, 100);
        };

        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
            clearTimeout(timeout);
        };
    }, [buildGrid]);

    useEffect(() => {
        animationRef.current = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(animationRef.current);
    }, [draw]);

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            const canvas = canvasRef.current;
            if (canvas) {
                const rect = canvas.getBoundingClientRect();
                pointerRef.current.x = e.clientX - rect.left;
                pointerRef.current.y = e.clientY - rect.top;
                pointerRef.current.isHovering = true;
            }
        };

        const onLeave = () => {
            pointerRef.current.x = -9999;
            pointerRef.current.y = -9999;
            pointerRef.current.isHovering = false;
        };

        const onClick = (e: MouseEvent) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;

            for (let i = 0; i < dotsRef.current.length; i++) {
                const dot = dotsRef.current[i];
                const dx = clickX - dot.x;
                const dy = clickY - dot.y;
                const distSq = dx * dx + dy * dy;
                const shockSq = shockRadius * shockRadius;

                if (distSq < shockSq) {
                    const dist = Math.sqrt(distSq);
                    const angle = Math.atan2(dy, dx);
                    const force = (shockRadius - dist) / shockRadius;
                    const pushForce = force * 25;
                    dot.vx -= Math.cos(angle) * pushForce;
                    dot.vy -= Math.sin(angle) * pushForce;
                }
            }
        };

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseout', onLeave);
        window.addEventListener('click', onClick);

        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseout', onLeave);
            window.removeEventListener('click', onClick);
        };
    }, [shockRadius]);

    return (
        <section className={`dot-grid ${className}`} style={style}>
            <div ref={wrapperRef} className="dot-grid__wrap">
                <canvas ref={canvasRef} className="dot-grid__canvas" />
            </div>
        </section>
    );
};

export default DotGrid;
