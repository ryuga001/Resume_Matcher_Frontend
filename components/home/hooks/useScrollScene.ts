"use client";

import { useEffect } from "react";
import type { MutableRefObject } from "react";
import * as THREE from "three";

export function useScrollScene(canvasRef: MutableRefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Renderer ──────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // ── Scene ─────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xf5ede4, 0.022);

    // ── Camera — centered, slight height, looks straight down path ─
    const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 150);

    // ── Path — alternates sides to match section layout:
    //   Hero (t 0→0.22):      center, arriving
    //   Features (t 0.22→0.50): ball on RIGHT, content on LEFT
    //   HowItWorks (t 0.50→0.76): ball on LEFT, content on RIGHT
    //   CTA (t 0.76→1.0):    returns to center
    const curve = new THREE.CatmullRomCurve3(
      [
        [ 0,   26,   0  ],  // 0   — hero, center
        [ 1,   22,  -1  ],  // 1   — drift right
        [ 3.8, 18,   0  ],  // 2   — RIGHT     ← ring A
        [ 4,   14,   1  ],  // 3   — right, features
        [ 4,   10,  -1  ],  // 4   — right, features   ← gate A
        [ 3.8,  6,   0  ],  // 5   — right, features end
        [ 1,    2,   0  ],  // 6   — crossing center
        [-3.8, -2,   0  ],  // 7   — LEFT      ← ring B
        [-4,   -6,   1  ],  // 8   — left, hiw
        [-4,  -10,  -1  ],  // 9   — left, hiw     ← gate B
        [-3.8,-14,   0  ],  // 10  — left, hiw end
        [-1,  -17,   1  ],  // 11  — crossing center
        [ 0,  -20,   0  ],  // 12  — CTA, center     ← ring C
        [ 0,  -23,   0  ],  // 13  — end
      ].map(([x, y, z]) => new THREE.Vector3(x, y, z)),
      false, "catmullrom", 0.5
    );

    // ── Materials ─────────────────────────────────────────────────
    const ballBodyMat = new THREE.MeshStandardMaterial({
      color:             0xc2652a,
      metalness:         0.05,
      roughness:         0.55,
      emissive:          new THREE.Color(0xc2652a),
      emissiveIntensity: 0.18,
    });
    const ballStripeMat = new THREE.MeshStandardMaterial({
      color: 0x7a2e0c, metalness: 0.0, roughness: 0.7,
    });
    const poleMat = new THREE.MeshStandardMaterial({
      color: 0x4a3828, metalness: 0.65, roughness: 0.30,
    });
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xc89060, metalness: 0.85, roughness: 0.10,
      emissive: new THREE.Color(0x3a1a08), emissiveIntensity: 0.12,
    });

    // ── Ball — radius 0.85 with two crossed stripe bands ──────────
    const BALL_R = 0.85;
    const ball   = new THREE.Mesh(new THREE.SphereGeometry(BALL_R, 40, 40), ballBodyMat);
    ball.castShadow = true;

    const bandGeo = new THREE.TorusGeometry(BALL_R + 0.01, 0.055, 8, 72);
    const bandA   = new THREE.Mesh(bandGeo, ballStripeMat);           // XY plane
    const bandB   = new THREE.Mesh(bandGeo, ballStripeMat);
    bandB.rotation.y = Math.PI / 2;                                   // YZ plane
    ball.add(bandA, bandB);

    const ballLight = new THREE.PointLight(0xc2652a, 4.5, 10, 2);
    ball.add(ballLight);
    scene.add(ball);

    // ── Rings — 3 portals: right, left, center ────────────────────
    const torusGeo = new THREE.TorusGeometry(2.2, 0.07, 20, 96);
    const Z_AXIS   = new THREE.Vector3(0, 0, 1);
    // placed at t values matching the waypoint positions above
    [0.165, 0.500, 0.840].forEach(t => {
      const ring = new THREE.Mesh(torusGeo, ringMat);
      ring.position.copy(curve.getPoint(t));
      ring.quaternion.setFromUnitVectors(Z_AXIS, curve.getTangent(t).normalize());
      ring.castShadow = true;
      scene.add(ring);
    });

    // ── Gates — 2 torii (right side, left side) ───────────────────
    const poleGeo     = new THREE.CylinderGeometry(0.055, 0.055, 18, 8);
    const crossbarGeo = new THREE.CylinderGeometry(0.04, 0.04, 6.8, 8);
    crossbarGeo.rotateZ(Math.PI / 2);

    [0.335, 0.665].forEach(t => {
      const pt      = curve.getPoint(t);
      const tangent = curve.getTangent(t).normalize();
      const flat    = new THREE.Vector3(tangent.x, 0, tangent.z);
      if (flat.length() < 0.001) flat.set(1, 0, 0);
      flat.normalize();
      const lat = new THREE.Vector3(-flat.z, 0, flat.x);

      [-1, 1].forEach(side => {
        const pole = new THREE.Mesh(poleGeo, poleMat);
        pole.position.copy(pt).addScaledVector(lat, side * 3.4);
        pole.castShadow = true;
        scene.add(pole);
      });

      const bar = new THREE.Mesh(crossbarGeo, ringMat);
      bar.position.copy(pt);
      bar.position.y += 7;
      bar.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), lat);
      scene.add(bar);
    });

    // ── Lights ────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xf5e8d8, 0.65));
    const key = new THREE.DirectionalLight(0xffe4c0, 1.1);
    key.position.set(7, 14, 9);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    scene.add(key);
    scene.add(new THREE.DirectionalLight(0xffd0a0, 0.40).position.set(-8, 5, 4) && new THREE.DirectionalLight(0xffd0a0, 0.40));
    scene.add(new THREE.HemisphereLight(0xf5ede4, 0x5a4030, 0.45));

    // ── State ─────────────────────────────────────────────────────
    let scrollProgress = 0;
    const CAM_OFFSET  = new THREE.Vector3(0, 3.5, 10);
    const ballCurrent = new THREE.Vector3().copy(curve.getPoint(0));
    const camCurrent  = new THREE.Vector3().copy(curve.getPoint(0)).add(CAM_OFFSET);
    const lookCurrent = new THREE.Vector3().copy(curve.getPoint(0));
    const _tgt  = new THREE.Vector3();
    const _look = new THREE.Vector3();
    const WORLD_UP = new THREE.Vector3(0, 1, 0);

    camera.position.copy(camCurrent);
    camera.lookAt(lookCurrent);

    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      scrollProgress = max > 0 ? Math.min(window.scrollY / max, 0.995) : 0;
    };
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight, false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    // ── Loop ──────────────────────────────────────────────────────
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);

      const pt      = curve.getPoint(scrollProgress);
      const tangent = curve.getTangent(scrollProgress).normalize();

      // Weighted lerp — ball has inertia / feels heavy
      ballCurrent.lerp(pt, 0.065);
      ball.position.copy(ballCurrent);

      // Rolling stripe rotation
      const moved    = ballCurrent.distanceTo(pt);
      const rollAxis = new THREE.Vector3().crossVectors(tangent, WORLD_UP).normalize();
      if (rollAxis.length() > 0.1) ball.rotateOnWorldAxis(rollAxis, moved / BALL_R);

      // Camera trails ball smoothly
      _tgt.copy(ballCurrent).add(CAM_OFFSET);
      camCurrent.lerp(_tgt, 0.04);
      camera.position.copy(camCurrent);

      _look.copy(ballCurrent).addScaledVector(WORLD_UP, 0.6);
      lookCurrent.lerp(_look, 0.04);
      camera.lookAt(lookCurrent);

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
