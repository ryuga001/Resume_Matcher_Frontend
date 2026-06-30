"use client";

import { useEffect } from "react";
import type { RefObject } from "react";
import * as THREE from "three";
import { drawWorkflow, clamp01 } from "@/components/home/workflow/canvasDraw";

interface Args {
  /** the visible canvas the Three.js renderer draws into (right column) */
  canvasRef: RefObject<HTMLCanvasElement | null>;
  /** called every frame with the current progress (imperative DOM updates) */
  onFrame?: (progress: number) => void;
}

/** Total play time for the five-stage demo, in ms (≈3s per stage). */
const DURATION = 15000;

/**
 * The workflow stage as a self-playing Three.js scene. The 2D illustration is
 * painted to an offscreen canvas and mapped onto a plane floating in a particle
 * field. Playback is triggered by an IntersectionObserver: every time the
 * section scrolls into view it restarts from 0 and plays through like a video;
 * when it leaves the viewport it resets so the next entry replays it.
 */
export function useWorkflowScene({ canvasRef, onFrame }: Args) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // ── offscreen 2D illustration ───────────────────────────────────────────
    const off = document.createElement("canvas");
    const offCtx = off.getContext("2d");
    if (!offCtx) return;

    // ── three.js core ───────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const FOV = 40;
    const CAM_Z = 7;
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
    camera.position.z = CAM_Z;

    const texture = new THREE.CanvasTexture(off);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    const planeMat = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), planeMat);
    const planeGroup = new THREE.Group();
    planeGroup.add(plane);
    scene.add(planeGroup);

    // depth particle field
    const COUNT = 90;
    const pPos = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      pPos[i * 3] = (Math.random() * 2 - 1) * 9;
      pPos[i * 3 + 1] = (Math.random() * 2 - 1) * 6;
      pPos[i * 3 + 2] = -1 - Math.random() * 7;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xc2652a,
      size: 0.06,
      transparent: true,
      opacity: 0.45,
      sizeAttenuation: true,
      depthWrite: false,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // ── sizing ──────────────────────────────────────────────────────────────
    let cssW = 0;
    let cssH = 0;
    const resize = () => {
      cssW = canvas.clientWidth;
      cssH = canvas.clientHeight;
      if (cssW <= 0 || cssH <= 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setSize(cssW, cssH, false);
      camera.aspect = cssW / cssH;
      camera.updateProjectionMatrix();
      const visH = 2 * CAM_Z * Math.tan((FOV * Math.PI) / 360);
      plane.scale.set(visH * camera.aspect, visH, 1);
      off.width = Math.round(cssW * dpr);
      off.height = Math.round(cssH * dpr);
      offCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // ── playback state (driven by visibility, not scroll) ─────────────────────
    let playing = false;
    let startTime = 0;     // 0 = (re)initialise on next frame
    let progress = 0;

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e.isIntersecting && e.intersectionRatio >= 0.35) {
          // (re)start the demo each time it comes into view
          playing = true;
          startTime = 0;
        } else {
          playing = false;
          startTime = 0;
          progress = 0;
        }
      },
      { threshold: [0, 0.35, 0.7] }
    );
    io.observe(canvas);

    // ── pointer parallax ──────────────────────────────────────────────────────
    const mouse = { x: 0, y: 0 };
    const tilt = { x: 0, y: 0 };
    const onMouse = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    // ── loop ────────────────────────────────────────────────────────────────
    let raf = 0;
    const t0 = typeof performance !== "undefined" ? performance.now() : 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (cssW <= 0 || cssH <= 0) return;

      if (playing) {
        if (startTime === 0) startTime = now;
        progress = clamp01((now - startTime) / DURATION);
      }
      const time = reduced ? 0 : now - t0;

      drawWorkflow(offCtx, cssW, cssH, progress, time);
      texture.needsUpdate = true;

      if (!reduced) {
        tilt.x += (-mouse.y * 0.05 - tilt.x) * 0.06;
        tilt.y += (mouse.x * 0.07 - tilt.y) * 0.06;
        planeGroup.rotation.x = tilt.x;
        planeGroup.rotation.y = tilt.y;
        planeGroup.position.y = Math.sin(time / 1800) * 0.05;
        particles.rotation.y += 0.0006;
        particles.position.x = mouse.x * 0.3;
        particles.position.y = -mouse.y * 0.2;
      }

      renderer.render(scene, camera);
      onFrame?.(progress);
    };
    raf = requestAnimationFrame(tick);

    // ── listeners ─────────────────────────────────────────────────────────────
    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    if (!reduced) window.addEventListener("mousemove", onMouse);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
      texture.dispose();
      planeMat.dispose();
      plane.geometry.dispose();
      pGeo.dispose();
      pMat.dispose();
      renderer.dispose();
    };
  }, [canvasRef, onFrame]);
}
