"use client";

import { useEffect } from "react";
import type { RefObject, MutableRefObject } from "react";
import * as THREE from "three";

const VERT = /* glsl */ `
  attribute float aSize;
  uniform float uScroll;
  varying float vDist;
  varying float vAlpha;

  void main() {
    vec3 pos = position;
    float dist = length(pos);
    vDist = dist;

    // scatter particles outward as user scrolls
    pos += normalize(pos) * uScroll * 3.5;
    vAlpha = 1.0 - smoothstep(0.0, 0.9, uScroll);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * (180.0 / -mv.z);
  }
`;

const FRAG = /* glsl */ `
  varying float vDist;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    float t = smoothstep(1.2, 4.0, vDist);
    vec3 inner = vec3(0.76, 0.396, 0.165);  // #c2652a
    vec3 outer = vec3(0.898, 0.863, 0.843); // #e5dcd7
    vec3 col = mix(inner, outer, t);

    float soft = 1.0 - d * 2.0;
    gl_FragColor = vec4(col, soft * vAlpha * 0.9);
  }
`;

export function useHeroCanvas(canvasRef: RefObject<HTMLCanvasElement> | MutableRefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Scene ──────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const w = canvas.clientWidth || canvas.offsetWidth;
    const h = canvas.clientHeight || canvas.offsetHeight;

    const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h, false);

    // ── Particles ──────────────────────────────────────────────────
    const COUNT = 3200;
    const positions = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      // organic sphere distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.4 + Math.pow(Math.random(), 0.6) * 2.8;
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.85; // slight vertical squeeze
      positions[i * 3 + 2] = r * Math.cos(phi);
      sizes[i] = Math.random() * 3.5 + 1.0;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSize",    new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: { uScroll: { value: 0 } },
      transparent: true,
      depthWrite: false,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // ── State ──────────────────────────────────────────────────────
    const mouse    = { nx: 0, ny: 0 };   // normalized -1..1
    const rotation = { x: 0, y: 0 };    // current lerped rotation
    let   baseY    = 0;                  // always-incrementing base rotation
    let   raf      = 0;

    // ── Handlers ───────────────────────────────────────────────────
    const onMouse = (e: MouseEvent) => {
      mouse.nx =  (e.clientX / window.innerWidth)  * 2 - 1;
      mouse.ny = -((e.clientY / window.innerHeight) * 2 - 1);
    };

    const onScroll = () => {
      mat.uniforms.uScroll.value = Math.min(window.scrollY / window.innerHeight, 1);
    };

    const onResize = () => {
      const pw = canvas.clientWidth;
      const ph = canvas.clientHeight;
      camera.aspect = pw / ph;
      camera.updateProjectionMatrix();
      renderer.setSize(pw, ph, false);
    };

    window.addEventListener("mousemove", onMouse);
    window.addEventListener("scroll",    onScroll, { passive: true });
    window.addEventListener("resize",    onResize);

    // ── Loop ───────────────────────────────────────────────────────
    const tick = () => {
      raf = requestAnimationFrame(tick);
      baseY += 0.0018;

      const targetY = baseY + mouse.nx * 0.25;
      const targetX =          mouse.ny * 0.18;

      rotation.y += (targetY - rotation.y) * 0.04;
      rotation.x += (targetX - rotation.x) * 0.04;

      points.rotation.y = rotation.y;
      points.rotation.x = rotation.x;

      renderer.render(scene, camera);
    };
    tick();

    // ── Cleanup ────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll",    onScroll);
      window.removeEventListener("resize",    onResize);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
