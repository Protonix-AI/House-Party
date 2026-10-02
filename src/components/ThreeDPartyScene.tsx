import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeDPartyScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Setup scene
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      50
    );
    camera.position.z = 6.0;
    camera.position.y = 0.2;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
      });
      renderer.setSize(container.clientWidth, container.clientHeight);
      // Cap pixel ratio to 1.25 for buttery smooth rendering on high-DPI displays
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn('WebGL not available or disabled:', e);
      return;
    }

    const partyGroup = new THREE.Group();
    scene.add(partyGroup);

    // Optimized Disco Ball Geometry: subdivision 2 = 320 crisp reflective mirror tiles
    const ballGeometry = new THREE.IcosahedronGeometry(1.6, 2);
    const ballMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8,
      metalness: 0.95,
      roughness: 0.14,
      flatShading: true,
    });
    const discoBall = new THREE.Mesh(ballGeometry, ballMaterial);
    partyGroup.add(discoBall);

    // Hanging string
    const stringGeo = new THREE.CylinderGeometry(0.015, 0.015, 4, 6);
    const stringMat = new THREE.MeshBasicMaterial({ color: 0x71717a });
    const discoString = new THREE.Mesh(stringGeo, stringMat);
    discoString.position.y = 3.6;
    partyGroup.add(discoString);

    // Optimized Orbiting Neon Rings
    const ringGeo1 = new THREE.TorusGeometry(2.35, 0.02, 8, 48);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0xec4899 });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 2.5;
    partyGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(2.65, 0.018, 8, 48);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = -Math.PI / 3;
    ring2.rotation.y = Math.PI / 5;
    partyGroup.add(ring2);

    // Floating Sparkle Particles / Confetti (optimized count: 90)
    const particleCount = 90;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const neonColors = [
      new THREE.Color(0xec4899),
      new THREE.Color(0xa855f7),
      new THREE.Color(0x06b6d4),
      new THREE.Color(0xf59e0b),
      new THREE.Color(0xffffff),
    ];

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.4 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      particlePositions[i * 3] = radius * Math.cos(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi) * Math.sin(theta);

      const color = neonColors[i % neonColors.length];
      particleColors[i * 3] = color.r;
      particleColors[i * 3 + 1] = color.g;
      particleColors[i * 3 + 2] = color.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.09,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    partyGroup.add(particles);

    // Optimized Lighting
    const ambientLight = new THREE.AmbientLight(0x221c35, 1.5);
    scene.add(ambientLight);

    const magentaLight = new THREE.PointLight(0xec4899, 25, 10);
    magentaLight.position.set(-3.5, 2.5, 3);
    scene.add(magentaLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, 25, 10);
    cyanLight.position.set(3.5, -2, 3);
    scene.add(cyanLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
    keyLight.position.set(0, 5, 4);
    scene.add(keyLight);

    // Throttled mouse tracking
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let ticking = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = container.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
          targetMouseX = x * 0.35;
          targetMouseY = y * 0.25;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle Window Resize
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Visibility observer: Pause animation when scrolled away!
    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Animation Loop
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Skip GPU render when hero is scrolled out of view!
      if (!isVisible) return;

      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      currentMouseX += (targetMouseX - currentMouseX) * 0.06;
      currentMouseY += (targetMouseY - currentMouseY) * 0.06;

      if (!prefersReducedMotion) {
        discoBall.rotation.y += delta * 0.35;
        discoBall.rotation.x = currentMouseY * 0.4;
        discoBall.rotation.z = currentMouseX * 0.4;

        ring1.rotation.z += delta * 0.25;
        ring2.rotation.z -= delta * 0.2;

        particles.rotation.y += delta * 0.06;
        partyGroup.position.y = Math.sin(now * 0.0015) * 0.06;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      ballGeometry.dispose();
      ballMaterial.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden will-change-transform"
      aria-hidden="true"
    />
  );
};

