import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ImpactVisualizer = ({ score }) => {
    // 1. DETERMINE TIER
    // Tier 1: Thrive (A+, A, B)
    // Tier 2: Stress (C)
    // Tier 3: Critical (D)
    // Tier 4: Collapse (E, F)
    const [tier, setTier] = useState(1);

    useEffect(() => {
        const s = (score || "").toUpperCase().trim();
        if (["C", "C+"].includes(s)) setTier(2);
        else if (["D", "D+"].includes(score)) setTier(3);
        else if (["E", "F"].includes(score)) setTier(4);
        else setTier(1);
    }, [score]);

    // 2. DEFINE COLORS
    const colors = {
        sky: { 1: "#87CEEB", 2: "#FCE6C9", 3: "#E67E22", 4: "#800000" }, // T3: Smog Orange, T4: Deep Red (Visible)
        mountain: { 1: "#5D737E", 2: "#778899", 3: "#8D6E63", 4: "#3e2723" },
        mountainHighlight: { 1: "#A9D6E5", 2: "#B0C4DE", 3: "#D7CCC8", 4: "#5D4037" }, // T4: visible highlight
        ground: { 1: "#2E8B57", 2: "#8FBC8F", 3: "#D2691E", 4: "#5D4037" }, // T4: Lighter scorched earth
        tree: { 1: "#006400", 2: "#DAA520", 3: "#8B4513", 4: "#000000" }, // T4: Black silhouette against lighter ground
        river: { 1: "#4169E1", 2: "#6495ED", 3: "#78909C", 4: "#3E2723" } // T3: Polluted Grey, T4: Dry Mud
    };

    // 3. SCENERY COMPONENTS
    const Mountain = ({ d, fill, highlight, x, y, scale = 1, delay = 0 }) => (
        <g transform={`translate(${x}, ${y}) scale(${scale})`}>
            <motion.path
                d={d}
                fill={fill}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0, fill: fill }}
                transition={{ duration: 2, delay: delay, fill: { duration: 2 } }}
            />
            {/* Snow cap / Highlight */}
            <motion.path
                d={d}
                clipPath="inset(0 0 70% 0)" // Only show top 30%
                fill={highlight}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, fill: highlight }}
                transition={{ duration: 2, delay: delay + 0.5 }}
            />
        </g>
    );

    const Deer = ({ x, delay }) => {
        if (tier >= 3) return null; // Animals leave in critical state
        return (
            <motion.g
                initial={{ x: x + 50, opacity: 0 }}
                animate={{ x: x, opacity: 1 }}
                transition={{ duration: 2, delay: delay }}
            >
                {/* Body */}
                <path d={`M${x} 380 Q${x + 10} 385 ${x + 20} 380 L${x + 25} 395 L${x + 20} 395 L${x + 18} 385 L${x + 10} 385 L${x + 5} 395 L${x} 395 Z`} fill="#5D4037" />
                {/* Antlers */}
                {tier === 1 && <path d={`M${x - 5} 368 L${x - 10} 360 M${x - 5} 368 L${x} 360`} stroke="#5D4037" strokeWidth="1.5" fill="none" />}
                {/* Neck & Head */}
                <path d={`M${x} 380 L${x - 5} 370 L${x - 15} 375 L${x - 5} 385 Z`} fill="#5D4037" />
            </motion.g>
        );
    };

    const Bear = ({ x, delay }) => {
        if (tier >= 3) return null;
        return (
            <motion.g
                initial={{ x: x - 50, opacity: 0 }}
                animate={{ x: x, opacity: 1 }}
                transition={{ duration: 4, delay: delay }}
            >
                {/* Massive Body */}
                <path d={`M${x} 380 Q${x + 20} 370 ${x + 40} 385 L${x + 40} 400 L${x + 30} 400 L${x + 30} 390 L${x + 10} 390 L${x + 10} 400 L${x} 400 Z`} fill="#3E2723" />
                {/* Head */}
                <circle cx={x} cy={385} r="8" fill="#3E2723" />
                <circle cx={x - 2} cy={380} r="2" fill="#3E2723" /> {/* Ear */}
            </motion.g>
        );
    };

    const Fox = ({ x, delay }) => {
        if (tier >= 3) return null;
        return (
            <motion.g
                initial={{ x: x, opacity: 0 }}
                animate={{ x: x, opacity: 1 }}
                transition={{ duration: 1, delay: delay }}
            >
                {/* Body */}
                <path d={`M${x} 395 L${x + 15} 395 L${x + 10} 390 L${x} 390 Z`} fill="#D2691E" />
                {/* Busy Tail */}
                <path d={`M${x + 15} 395 Q${x + 25} 390 ${x + 20} 385`} stroke="#D2691E" strokeWidth="3" fill="none" />
                {/* Head */}
                <path d={`M${x} 390 L${x - 5} 385 L${x} 385 Z`} fill="#D2691E" />
            </motion.g>
        );
    };


    const River = () => {
        return (
            <g>
                {/* Definitions moved to main SVG */}

                {/* River Base - Narrower perspective */}
                <motion.path
                    d={tier <= 2
                        ? "M390 325 Q400 325 410 325 L550 450 L250 450 Z" // Starts at horizon Y=325
                        : "M390 325 Q400 325 410 325 L450 450 L350 450 Z"
                    }
                    fill={colors.river[tier]}
                    transition={{ duration: 3 }}
                />

                {/* The flow animation is now handled directly by the pattern in <defs> */}
                {tier <= 2 && (
                    <motion.path
                        d="M390 325 Q400 325 410 325 L550 450 L250 450 Z"
                        fill="url(#waterFlow)"
                        style={{ opacity: 0.6 }}
                    />
                )}
            </g>
        );
    };

    const Tree = ({ x, size = 1, delay }) => {
        // Curve approx logic to place trees on ground:
        const t = x / 800;
        const groundY = 100 * t * t - 100 * t + 400; // Curve equation
        const y = groundY;

        const getRotation = () => {
            if (tier === 1) return [0, 3, 0, -3, 0];
            if (tier === 2) return [0, 1, 0, -1, 0];
            if (tier === 3) return 15;
            if (tier === 4) return 90;
        };

        return (
            <motion.g
                initial={{ scale: 0 }}
                animate={{
                    scale: 1,
                    fill: colors.tree[tier],
                    rotate: getRotation(),
                    y: tier === 4 ? y + 20 : y,
                    x: x
                }}
                transition={{
                    scale: { duration: 1, delay: delay },
                    fill: { duration: 2 },
                    rotate: { duration: tier <= 2 ? 4 : 2, repeat: tier <= 2 ? Infinity : 0, ease: "easeInOut" }
                }}
                style={{ transformOrigin: "bottom center" }}
            >
                {/* VISIBLE TRUNK */}
                <rect x={-4 * size} y={-30 * size} width={8 * size} height={35 * size} fill="#3E2723" rx="2" />

                {/* Foliage Layers - Shifted up */}
                <path d={`M0 ${-90 * size} L${-20 * size} ${-30 * size} L${20 * size} ${-30 * size} Z`} />
                <path d={`M0 ${-60 * size} L${-25 * size} ${-20 * size} L${25 * size} ${-20 * size} Z`} />
                <path d={`M0 ${-40 * size} L${-30 * size} ${-10 * size} L${30 * size} ${-10 * size} Z`} />
            </motion.g>
        );
    };

    // Helper for Birds (Compact)
    const Bird = ({ id, delay }) => {
        if (tier >= 3) return null;
        return (
            <motion.path
                key={id}
                d="M0 0 Q5 -5 10 0 M10 0 Q15 -5 20 0"
                stroke={tier === 1 ? "white" : "#333"}
                strokeWidth="2"
                fill="none"
                initial={{ x: -50, y: 50 + Math.random() * 50, opacity: 0 }}
                animate={{ x: 900, y: [50, 80, 40], opacity: 1 }}
                transition={{ duration: 15 + Math.random() * 5, repeat: Infinity, delay: delay, ease: "linear" }}
            />
        );
    };

    return (
        <motion.div
            className="glass-panel"
            animate={{ background: `linear-gradient(to bottom, ${colors.sky[tier]} 0%, #000 100%)` }}
            transition={{ duration: 4 }}
            style={{
                position: 'relative', height: '450px', overflow: 'hidden', padding: 0, borderRadius: '16px',
            }}
        >
            <svg viewBox="0 0 800 450" style={{ position: 'absolute', width: '100%', height: '100%' }}>
                <defs>
                    <motion.pattern
                        id="waterFlow"
                        x="0"
                        y="0"
                        width="100"
                        height="100"
                        patternUnits="userSpaceOnUse"
                        animate={{ x: [0, 100] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                        <path d="M0 50 Q25 40 50 50 T100 50" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
                    </motion.pattern>
                </defs>

                {/* Sun */}
                <motion.circle
                    cx={tier <= 2 ? 100 : 700} cy={100} r={50}
                    animate={{ fill: tier === 1 ? "#FFD700" : "#FF4500", opacity: 0.8 }}
                    transition={{ duration: 4 }}
                />

                {/* Mountains - High Peaks (Furthest) */}
                <Mountain d="M-50 450 L150 100 L350 450 Z" fill={colors.mountain[tier]} highlight={colors.mountainHighlight[tier]} x={-80} y={10} scale={1.8} delay={0} />
                <Mountain d="M450 450 L750 50 L1050 450 Z" fill={colors.mountain[tier]} highlight={colors.mountainHighlight[tier]} x={20} y={0} scale={1.8} delay={0.1} />

                {/* Mountains - Back Range (Faded) */}
                <Mountain d="M100 450 L300 250 L500 450 Z" fill={colors.mountain[tier]} highlight={colors.mountainHighlight[tier]} x={-50} y={20} scale={1.2} delay={0.1} />
                <Mountain d="M600 450 L800 200 L1000 450 Z" fill={colors.mountain[tier]} highlight={colors.mountainHighlight[tier]} x={0} y={30} scale={1.3} delay={0.3} />

                {/* Mountains - Front Range (Prominent) */}
                <Mountain d="M300 450 L500 150 L700 450 Z" fill={colors.mountain[tier]} highlight={colors.mountainHighlight[tier]} x={-100} y={0} scale={1.5} delay={0.2} />
                <Mountain d="M0 450 L200 200 L400 450 Z" fill={colors.mountain[tier]} highlight={colors.mountainHighlight[tier]} x={-50} y={50} delay={0.4} />
                <Mountain d="M500 450 L700 250 L900 450 Z" fill={colors.mountain[tier]} highlight={colors.mountainHighlight[tier]} x={50} y={20} delay={0.6} />
                <Mountain d="M-100 450 L100 250 L300 450 Z" fill={colors.mountain[tier]} highlight={colors.mountainHighlight[tier]} x={-20} y={40} delay={0.5} />

                {/* Ground Layer */}
                <path d="M0 450 L0 350 Q400 300 800 350 L800 450 Z" fill={colors.ground[tier]} />

                {/* River - Adjusted Perspective to Horizon */}
                <River />

                {/* Banks (Depth) */}
                <motion.path
                    d={tier <= 2 ? "M250 450 L280 450 L395 325 L385 325 Z" : "M0 0"}
                    fill="#3E2723" opacity="0.3"
                />
                <motion.path
                    d={tier <= 2 ? "M550 450 L520 450 L405 325 L415 325 Z" : "M0 0"}
                    fill="#3E2723" opacity="0.3"
                />
                {/* Trees - Dense Forest Generation */}
                {/* Background/Far Trees (Small) - Widen exclusion to 280-520 */}
                {[...Array(15)].map((_, i) => {
                    const x = 50 + i * 50;
                    if (x > 280 && x < 520) return null; // Skip river safely
                    return <Tree key={`deep-${i}`} x={x + Math.random() * 10} delay={0.5} size={0.5 + Math.random() * 0.2} />;
                })}

                {/* Mid-Ground Trees (Medium) - Widen exclusion to 220-580 */}
                {[...Array(10)].map((_, i) => {
                    const x = 20 + i * 85;
                    if (x > 220 && x < 580) return null; // Skip river safely
                    return <Tree key={`mid-${i}`} x={x} delay={i * 0.1} size={0.8 + Math.random() * 0.3} />;
                })}

                {/* Foreground Trees (Large) - Manual placement safe zones (<200 or >600) */}
                <Tree x={40} delay={0.1} size={1.2} />
                <Tree x={110} delay={0.2} size={1.1} />
                <Tree x={180} delay={0.3} size={1.3} />

                <Tree x={620} delay={0.4} size={1.2} />
                <Tree x={700} delay={0.5} size={1.4} />
                <Tree x={760} delay={0.6} size={1.1} />

                {/* Animals - Diverse Wildlife - Centered in clearings */}
                <Deer x={70} delay={1} /> {/* Gap between trees at 40 and 110 */}
                <Deer x={230} delay={1.2} /> {/* Near bank edge */}
                <Bear x={660} delay={2} /> {/* Gap between trees at 620 and 700 */}
                <Fox x={145} delay={3} />  {/* Gap between trees at 110 and 180 */}

                {/* Wildlife */}
                {[1, 2, 3].map(i => <Bird key={i} id={i} delay={i * 2} />)}

            </svg>

            {/* Overlay */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem', background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}>
                <h3 className="glow-text" style={{
                    margin: 0, fontSize: '1.5rem',
                    color: tier === 1 ? '#00ff9d' : (tier === 2 ? '#fbbf24' : '#ff4d4d')
                }}>
                    {tier === 1 ? "THRIVING ECOSYSTEM" : (tier === 2 ? "NATURE UNDER STRESS" : "CRITICAL WARNING")}
                </h3>
            </div>
        </motion.div>
    );
};

export default ImpactVisualizer;
