// src/components/CinematicBackground.jsx
// Premium Institutional Three.js Opportunity & Money Landscape
// Theme: Money & Opportunity / Career Discovery Platform
// - Abstract cinematic digital environment (high-end fintech/AI startup aesthetic)
// - Flowing kinetic financial wave mesh (market liquidity & talent topography)
// - Subtle connected network constellation nodes & live traveling data pulses
// - Floating quantum tech crystals (cryptographic/financial data markers)
// - Ascending wealth & career growth particles (upward mobility)
// - Radiant digital horizon & opportunity sonar scan rings
// - Dynamic 3D Camera Spline Journey: clearly flies forward as you scroll the homepage
// - Autonomous 60fps continuous animation + smooth inertial scroll interpolation
// - Center vignette protecting 100% UI readability for text, search & buttons

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext.jsx';

export default function CinematicBackground({ scrollProgress = 0 }) {
  const { isDark } = useTheme();
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const scrollRef = useRef(0);

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    // 1. WebGL Support Verification
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Math utilities
    const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
    const lerp = (a, b, t) => a + (b - a) * t;
    const damp = (cur, to, rate, dt) => cur + (to - cur) * (1 - Math.exp(-rate * dt));

    // Soft circular glow sprite generator
    function createGlowTexture(innerColor, outerColor) {
      const size = 128;
      const c = document.createElement('canvas');
      c.width = size;
      c.height = size;
      const ctx = c.getContext('2d');
      const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      grad.addColorStop(0, innerColor);
      grad.addColorStop(0.35, outerColor);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    }

    // Horizon dawn gradient texture
    function createHorizonGradient() {
      const w = 512;
      const h = 256;
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d');
      const grad = ctx.createRadialGradient(w / 2, h, 10, w / 2, h, w * 0.65);
      grad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');    // tech cyan
      grad.addColorStop(0.25, 'rgba(16, 185, 129, 0.35)'); // emerald
      grad.addColorStop(0.65, 'rgba(30, 58, 138, 0.12)');  // deep navy
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    }

    // Viewport dimensions
    const vpW = () => containerRef.current?.clientWidth || window.innerWidth;
    const vpH = () => containerRef.current?.clientHeight || window.innerHeight;

    // ── SCENE & RENDERER SETUP ──
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(isDark ? 0x070a12 : 0xF8FAFC, 0.007);

    const camera = new THREE.PerspectiveCamera(40, vpW() / vpH(), 0.2, 400);
    camera.position.set(0, 8.8, 28);
    camera.lookAt(0, 2.8, -18);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
      alpha: true
    });
    renderer.setSize(vpW(), vpH(), false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // ── LIGHTING (Clean, Modern, Fintech) ──
    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.3);
    scene.add(ambientLight);

    const keyCyanLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
    keyCyanLight.position.set(30, 45, 20);
    scene.add(keyCyanLight);

    const fillEmeraldLight = new THREE.DirectionalLight(0x10b981, 1.2);
    fillEmeraldLight.position.set(-30, 35, -30);
    scene.add(fillEmeraldLight);

    const cursorLight = new THREE.PointLight(0x34d399, 2.4, 55, 2);
    cursorLight.position.set(0, 5, 8);
    scene.add(cursorLight);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // ── 1. KINETIC FINANCIAL & OPPORTUNITY WAVE MESH ──
    const gridCols = 58;
    const gridRows = 68;
    const gridW = 160;
    const gridD = 220;

    const waveGeo = new THREE.PlaneGeometry(gridW, gridD, gridCols, gridRows);
    waveGeo.rotateX(-Math.PI / 2);

    const wavePos = waveGeo.attributes.position;
    const waveCount = wavePos.count;
    const waveColors = new Float32Array(waveCount * 3);
    const colNear = new THREE.Color(0x10b981);  // Vibrant Emerald
    const colMid = new THREE.Color(0x38bdf8);   // Electric Cyan
    const colFar = new THREE.Color(0x6366f1);   // Indigo Horizon

    for (let i = 0; i < waveCount; i++) {
      const z = wavePos.getZ(i);
      const normZ = clamp((z + 110) / 200, 0, 1);
      const c = normZ > 0.5 
        ? colMid.clone().lerp(colNear, (normZ - 0.5) * 2) 
        : colFar.clone().lerp(colMid, normZ * 2);
      waveColors[i * 3 + 0] = c.r;
      waveColors[i * 3 + 1] = c.g;
      waveColors[i * 3 + 2] = c.b;
    }
    waveGeo.setAttribute('color', new THREE.BufferAttribute(waveColors, 3));

    const waveWireMat = new THREE.MeshBasicMaterial({
      vertexColors: true,
      wireframe: true,
      transparent: true,
      opacity: 0.32,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const waveWireMesh = new THREE.Mesh(waveGeo, waveWireMat);
    waveWireMesh.position.set(0, -2.5, -40);
    mainGroup.add(waveWireMesh);

    // Dark reflective floor base beneath
    const floorBaseMat = new THREE.MeshStandardMaterial({
      color: 0x070c14,
      roughness: 0.22,
      metalness: 0.85,
      transparent: true,
      opacity: 0.78,
      depthWrite: false
    });
    const floorBaseMesh = new THREE.Mesh(waveGeo, floorBaseMat);
    floorBaseMesh.position.set(0, -2.6, -40);
    mainGroup.add(floorBaseMesh);

    // ── 2. GLOBAL OPPORTUNITY NETWORK CONSTELLATION ──
    const nodeCount = 42;
    const nodeData = [];
    const nodeGroup = new THREE.Group();
    mainGroup.add(nodeGroup);

    const glowTexMint = createGlowTexture('rgba(52, 211, 153, 0.95)', 'rgba(16, 185, 129, 0.35)');
    const glowTexCyan = createGlowTexture('rgba(56, 189, 248, 0.95)', 'rgba(14, 165, 233, 0.35)');
    const glowTexGold = createGlowTexture('rgba(251, 191, 36, 0.95)', 'rgba(245, 158, 11, 0.30)');

    const sphereGeo = new THREE.SphereGeometry(0.28, 16, 16);
    const ringGeo = new THREE.RingGeometry(0.5, 0.65, 24);

    for (let i = 0; i < nodeCount; i++) {
      const isGold = i % 7 === 0;
      const isCyan = i % 2 === 0;
      const colHex = isGold ? 0xf59e0b : isCyan ? 0x38bdf8 : 0x10b981;
      const glowTex = isGold ? glowTexGold : isCyan ? glowTexCyan : glowTexMint;

      // Keep center corridor clear for UI readability: bias x to left and right flanks
      const side = i % 2 === 0 ? 1 : -1;
      const posX = side * (10 + Math.random() * 32);
      const posY = 1.4 + Math.random() * 7.8;
      const posZ = 18 - Math.random() * 105;

      const sphereMat = new THREE.MeshBasicMaterial({
        color: colHex,
        blending: THREE.AdditiveBlending
      });
      const sMesh = new THREE.Mesh(sphereGeo, sphereMat);
      sMesh.position.set(posX, posY, posZ);
      nodeGroup.add(sMesh);

      const spriteMat = new THREE.SpriteMaterial({
        map: glowTex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.85
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(2.4, 2.4, 1);
      sMesh.add(sprite);

      const ringMat = new THREE.MeshBasicMaterial({
        color: colHex,
        transparent: true,
        opacity: 0.38,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      sMesh.add(ringMesh);

      nodeData.push({
        mesh: sMesh,
        ring: ringMesh,
        baseY: posY,
        phase: Math.random() * Math.PI * 2,
        speed: 0.7 + Math.random() * 1.1,
        color: colHex
      });
    }

    // ── 3. DATA LINK LINES & TRAVELING SIGNALS ──
    const linePairs = [];
    const maxLinkDist = 20;
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const p1 = nodeData[i].mesh.position;
        const p2 = nodeData[j].mesh.position;
        const dist = p1.distanceTo(p2);
        if (dist < maxLinkDist && Math.random() > 0.42) {
          linePairs.push({ i, j, dist });
        }
      }
    }

    const linePositions = new Float32Array(linePairs.length * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const networkLines = new THREE.LineSegments(lineGeo, lineMat);
    mainGroup.add(networkLines);

    // Traveling Data Packets (Pulsing transactions)
    const packetCount = 22;
    const packetGeo = new THREE.BufferGeometry();
    const packetPositions = new Float32Array(packetCount * 3);
    const packetColors = new Float32Array(packetCount * 3);
    const packets = [];

    for (let k = 0; k < packetCount; k++) {
      const pairIdx = Math.floor(Math.random() * linePairs.length);
      const pair = linePairs[pairIdx];
      const isMint = k % 2 === 0;
      const col = isMint ? new THREE.Color(0x34d399) : new THREE.Color(0x38bdf8);
      packetColors[k * 3 + 0] = col.r;
      packetColors[k * 3 + 1] = col.g;
      packetColors[k * 3 + 2] = col.b;

      packets.push({
        pair,
        progress: Math.random(),
        speed: 0.35 + Math.random() * 0.6
      });
    }

    packetGeo.setAttribute('position', new THREE.BufferAttribute(packetPositions, 3));
    packetGeo.setAttribute('color', new THREE.BufferAttribute(packetColors, 3));

    const packetMat = new THREE.PointsMaterial({
      size: 0.58,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const packetPoints = new THREE.Points(packetGeo, packetMat);
    mainGroup.add(packetPoints);

    // ── 4. FLOATING QUANTUM TECH CRYSTALS (FINANCIAL TOKENS) ──
    const crystalGroup = new THREE.Group();
    mainGroup.add(crystalGroup);

    const crystalPositions = [
      { x: -16, y: 7.0, z: -10, size: 1.4, col: 0x38bdf8 },
      { x: 17, y: 7.8, z: -22, size: 1.6, col: 0x10b981 },
      { x: -19, y: 6.2, z: -38, size: 1.8, col: 0x38bdf8 },
      { x: 19, y: 8.5, z: -55, size: 2.1, col: 0xf59e0b },
      { x: -15, y: 9.8, z: -72, size: 2.0, col: 0x10b981 },
      { x: 16, y: 11.2, z: -90, size: 2.4, col: 0x38bdf8 },
      { x: -18, y: 12.5, z: -108, size: 2.6, col: 0x10b981 },
      { x: 15, y: 13.5, z: -125, size: 2.8, col: 0x38bdf8 }
    ];

    const crystalList = [];
    crystalPositions.forEach((cp, idx) => {
      const cGeo = new THREE.OctahedronGeometry(cp.size, 0);
      const cMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.15,
        metalness: 0.85,
        transparent: true,
        opacity: 0.65
      });
      const cMesh = new THREE.Mesh(cGeo, cMat);
      cMesh.position.set(cp.x, cp.y, cp.z);
      crystalGroup.add(cMesh);

      const edgeGeo = new THREE.EdgesGeometry(cGeo);
      const edgeMat = new THREE.LineBasicMaterial({
        color: cp.col,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
      });
      const edgeLines = new THREE.LineSegments(edgeGeo, edgeMat);
      cMesh.add(edgeLines);

      crystalList.push({
        mesh: cMesh,
        baseY: cp.y,
        rotSpeedX: 0.25 + (idx % 3) * 0.12,
        rotSpeedY: 0.35 + (idx % 2) * 0.15,
        phase: idx * 1.2
      });
    });

    // ── 5. ASCENDING WEALTH & CAREER MOBILITY PARTICLES ──
    const sparkleCount = 220;
    const sparkleGeo = new THREE.BufferGeometry();
    const sparklePos = new Float32Array(sparkleCount * 3);
    const sparkleColors = new Float32Array(sparkleCount * 3);
    const sparkleSpeeds = new Float32Array(sparkleCount);

    for (let k = 0; k < sparkleCount; k++) {
      sparklePos[k * 3 + 0] = (Math.random() - 0.5) * 110;
      sparklePos[k * 3 + 1] = 0.5 + Math.random() * 25;
      sparklePos[k * 3 + 2] = 25 - Math.random() * 125;

      const isCyan = k % 2 === 0;
      const c = isCyan ? new THREE.Color(0x38bdf8) : new THREE.Color(0x34d399);
      sparkleColors[k * 3 + 0] = c.r;
      sparkleColors[k * 3 + 1] = c.g;
      sparkleColors[k * 3 + 2] = c.b;

      sparkleSpeeds[k] = 0.6 + Math.random() * 1.0;
    }
    sparkleGeo.setAttribute('position', new THREE.BufferAttribute(sparklePos, 3));
    sparkleGeo.setAttribute('color', new THREE.BufferAttribute(sparkleColors, 3));

    const sparkleMat = new THREE.PointsMaterial({
      size: 0.34,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const sparklePoints = new THREE.Points(sparkleGeo, sparkleMat);
    mainGroup.add(sparklePoints);

    // ── 6. RADIANT MODERN HORIZON & OPPORTUNITY SONAR SCAN ──
    const horizonGeo = new THREE.PlaneGeometry(260, 105);
    const horizonMat = new THREE.MeshBasicMaterial({
      map: createHorizonGradient(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: false,
      opacity: 0.85
    });
    const horizonMesh = new THREE.Mesh(horizonGeo, horizonMat);
    horizonMesh.position.set(0, 18, -135);
    mainGroup.add(horizonMesh);

    const ringCount = 3;
    const sonarRings = [];
    for (let r = 0; r < ringCount; r++) {
      const sRingGeo = new THREE.RingGeometry(2, 2.3, 64);
      const sRingMat = new THREE.MeshBasicMaterial({
        color: r % 2 === 0 ? 0x38bdf8 : 0x10b981,
        transparent: true,
        opacity: 0.38,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
      });
      const sRingMesh = new THREE.Mesh(sRingGeo, sRingMat);
      sRingMesh.position.set(0, 8.5, -120);
      mainGroup.add(sRingMesh);
      sonarRings.push({ mesh: sRingMesh, progress: r * (1 / ringCount) });
    }

    // ── 7. CINEMATIC 3D CAMERA SPLINE (DRIVEN BY SCROLLING) ──
    // Clearly sweeps through the financial space as the user scrolls
    const waypointsP = [
      new THREE.Vector3(0, 8.8, 28),     // 0.00: Hero entrance - elevated overview of digital realm
      new THREE.Vector3(-6, 7.2, 12),    // 0.20: Gliding left, entering the glowing constellation corridor
      new THREE.Vector3(7, 5.2, -6),     // 0.40: Banking right, descending low over undulating market waves
      new THREE.Vector3(-5, 5.8, -26),   // 0.60: Weaving past spinning quantum tech crystals
      new THREE.Vector3(6, 7.4, -46),    // 0.80: Climbing slightly, overlooking dense opportunity clusters
      new THREE.Vector3(0, 9.6, -65)     // 1.00: Centered majestic overlook towards radiant dawn horizon
    ];

    const waypointsT = [
      new THREE.Vector3(0, 2.8, -18),
      new THREE.Vector3(2, 3.2, -35),
      new THREE.Vector3(-3, 3.8, -50),
      new THREE.Vector3(2, 4.2, -70),
      new THREE.Vector3(-2, 5.0, -92),
      new THREE.Vector3(0, 6.2, -120)
    ];

    const curveP = new THREE.CatmullRomCurve3(waypointsP);
    curveP.curveType = 'centripetal';

    const curveT = new THREE.CatmullRomCurve3(waypointsT);
    curveT.curveType = 'centripetal';

    // ── 8. CONTINUOUS ANIMATION LOOP WITH SCROLL INTERPOLATION ──
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e) => {
      mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let rafId = null;
    let lastTime = performance.now();
    let isRunning = true;
    let simTime = 0;
    let currentScroll = 0;

    const _p = new THREE.Vector3();
    const _t = new THREE.Vector3();

    const renderLoop = (time) => {
      if (!isRunning) return;
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;
      simTime += dt;
      const t = simTime;

      // Mouse damping for subtle 3D parallax
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      // Silky smooth scroll damping (immediate responsiveness with inertial easing)
      const targetScroll = clamp(scrollRef.current, 0, 1);
      currentScroll = damp(currentScroll, targetScroll, 4.5, dt);

      // Evaluate 3D camera trajectory along CatmullRom spline
      curveP.getPoint(currentScroll, _p);
      curveT.getPoint(currentScroll, _t);

      // Dynamic cinematic FOV: expands slightly when descending into waves for dynamic speed sensation
      const targetFov = 40 + Math.sin(currentScroll * Math.PI) * 4.0;
      camera.fov += (targetFov - camera.fov) * 0.1;
      camera.updateProjectionMatrix();

      if (!REDUCE) {
        // Continuous subtle ambient breathing (does not disrupt scroll position)
        _p.y += Math.sin(t * 0.35) * 0.22;
        _p.x += Math.cos(t * 0.25) * 0.28;

        // Subtle ambient parallax (rock-solid stability, zero shaking while typing or searching)
        _p.x += mouse.x * 0.12;
        _p.y += -mouse.y * 0.08;
        _t.x += mouse.x * 0.05;

        cursorLight.position.x = _p.x + mouse.x * 1.2;
        cursorLight.position.y = _p.y - mouse.y * 1.0;
      }

      camera.position.copy(_p);
      camera.lookAt(_t);

      // 1. Update Kinetic Wave Geometry with time + scroll offset
      const posAttr = waveGeo.attributes.position;
      const scrollWaveShift = currentScroll * 30.0;
      for (let idx = 0; idx < waveCount; idx++) {
        const uX = posAttr.getX(idx);
        const uZ = posAttr.getZ(idx);
        const elevation =
          Math.sin(uX * 0.08 + t * 0.9 + scrollWaveShift * 0.25) * 1.5 +
          Math.cos((uZ - scrollWaveShift) * 0.06 + t * 0.7) * 1.8 +
          Math.sin((uX * 0.04 + (uZ - scrollWaveShift) * 0.05) + t * 0.55) * 1.0;
        posAttr.setY(idx, elevation);
      }
      posAttr.needsUpdate = true;

      // 2. Animate Opportunity Nodes (bobbing & halo rings)
      nodeData.forEach((nd) => {
        const bob = Math.sin(t * nd.speed + nd.phase) * 0.35;
        nd.mesh.position.y = nd.baseY + bob;
        nd.ring.rotation.z += 0.007;
        const ringPulse = 1.0 + Math.sin(t * 1.8 + nd.phase) * 0.15;
        nd.ring.scale.set(ringPulse, ringPulse, 1);
      });

      // 3. Update Dynamic Link Lines Positions
      const linePosAttr = lineGeo.attributes.position;
      let lineIdx = 0;
      for (let l = 0; l < linePairs.length; l++) {
        const pair = linePairs[l];
        const p1 = nodeData[pair.i].mesh.position;
        const p2 = nodeData[pair.j].mesh.position;

        linePositions[lineIdx++] = p1.x;
        linePositions[lineIdx++] = p1.y;
        linePositions[lineIdx++] = p1.z;

        linePositions[lineIdx++] = p2.x;
        linePositions[lineIdx++] = p2.y;
        linePositions[lineIdx++] = p2.z;
      }
      linePosAttr.needsUpdate = true;

      // 4. Animate Traveling Data Packets
      const packetPosAttr = packetGeo.attributes.position;
      for (let k = 0; k < packetCount; k++) {
        const pk = packets[k];
        pk.progress += pk.speed * dt;
        if (pk.progress >= 1.0) {
          pk.progress = 0;
          pk.pair = linePairs[Math.floor(Math.random() * linePairs.length)];
        }
        const p1 = nodeData[pk.pair.i].mesh.position;
        const p2 = nodeData[pk.pair.j].mesh.position;
        packetPositions[k * 3 + 0] = lerp(p1.x, p2.x, pk.progress);
        packetPositions[k * 3 + 1] = lerp(p1.y, p2.y, pk.progress);
        packetPositions[k * 3 + 2] = lerp(p1.z, p2.z, pk.progress);
      }
      packetPosAttr.needsUpdate = true;

      // 5. Animate Floating Quantum Tech Crystals
      crystalList.forEach((c) => {
        c.mesh.rotation.x += c.rotSpeedX * dt;
        c.mesh.rotation.y += c.rotSpeedY * dt;
        c.mesh.position.y = c.baseY + Math.sin(t * 0.95 + c.phase) * 0.4;
      });

      // 6. Animate Ascending Opportunity Sparkles
      const sparkPosAttr = sparkleGeo.attributes.position;
      for (let s = 0; s < sparkleCount; s++) {
        sparklePos[s * 3 + 1] += sparkleSpeeds[s] * dt * 2.2;
        sparklePos[s * 3 + 0] += Math.sin(t + s) * 0.02;
        if (sparklePos[s * 3 + 1] > 26.0) {
          sparklePos[s * 3 + 1] = 0.5;
        }
      }
      sparkPosAttr.needsUpdate = true;

      // 7. Animate Scanning Sonar Radar Rings
      sonarRings.forEach((sr) => {
        sr.progress = (sr.progress + dt * 0.28) % 1.0;
        const scale = 1.0 + sr.progress * 18.0;
        sr.mesh.scale.set(scale, scale, 1);
        sr.mesh.material.opacity = (1.0 - sr.progress) * 0.38;
      });

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(renderLoop);
    };

    rafId = requestAnimationFrame(renderLoop);

    const handleResize = () => {
      const w = vpW();
      const h = vpH();
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    window.addEventListener('resize', handleResize);

    const handleVisibility = () => {
      if (document.hidden) {
        isRunning = false;
        cancelAnimationFrame(rafId);
      } else {
        isRunning = true;
        lastTime = performance.now();
        rafId = requestAnimationFrame(renderLoop);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      isRunning = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);

      waveGeo.dispose();
      waveWireMat.dispose();
      floorBaseMat.dispose();
      sphereGeo.dispose();
      ringGeo.dispose();
      glowTexMint.dispose();
      glowTexCyan.dispose();
      glowTexGold.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      packetGeo.dispose();
      packetMat.dispose();
      sparkleGeo.dispose();
      sparkleMat.dispose();
      horizonGeo.dispose();
      horizonMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
      style={{
        background: isDark
          ? 'radial-gradient(ellipse 130% 90% at 50% -10%, #0d1629 0%, #080c14 55%, #05070a 100%)'
          : 'radial-gradient(ellipse 130% 90% at 50% -10%, #ECFDF5 0%, #F1F5F9 55%, #F8FAFC 100%)'
      }}
      aria-hidden="true"
    >
      {webglSupported ? (
        <canvas
          ref={canvasRef}
          className="w-full h-full block absolute inset-0"
        />
      ) : (
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-b from-[#080c14] via-[#0d1629] to-[#05070a]' : 'bg-gradient-to-b from-white via-slate-100 to-slate-200'} opacity-90`} />
      )}

      {/* Modern High-End Vignette & Center Clear Zone (Maximizes UI text & search readability) */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(120% 90% at 50% 30%, transparent 45%, rgba(5,7,10,0.45) 100%)'
            : 'radial-gradient(120% 90% at 50% 30%, transparent 45%, rgba(241,245,249,0.3) 100%)'
        }}
      />
    </div>
  );
}
