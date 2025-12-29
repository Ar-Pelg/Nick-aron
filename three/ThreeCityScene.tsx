import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { MotionValue } from 'framer-motion';

interface ThreeCitySceneProps {
  scrollProgress: MotionValue<number>;
}

export const ThreeCityScene = React.memo<ThreeCitySceneProps>(({ scrollProgress }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, animationId: number;
    let boatGroup: THREE.Group;
    let isVisible = false;
    let currentScroll = 0;

    // Clock for smooth delta-time based animation
    const clock = new THREE.Clock();

    // Subscribe to scroll value
    const unsubscribe = scrollProgress.on("change", (latest) => {
      currentScroll = latest;
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(mountRef.current);

    // 1. Setup Scene
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    scene = new THREE.Scene();
    const skyColor = 0x171717;
    scene.background = new THREE.Color(skyColor);
    scene.fog = new THREE.FogExp2(skyColor, 0.025);

    camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 120);
    camera.position.set(0, 2, 0);

    renderer = new THREE.WebGLRenderer({
      antialias: false, // Keeping false for performance
      alpha: false,
      powerPreference: "high-performance",
      precision: "mediump", // Mediump is usually enough and faster
      stencil: false,
      depth: true
    });
    renderer.setSize(width, height);
    // Cap pixel ratio to 1.25 to prevent lag on high-DPI screens while maintaining decent quality
    // Dynamic Resolution Setup
    const maxPixelRatio = Math.min(window.devicePixelRatio, 1.25);
    renderer.setPixelRatio(maxPixelRatio);

    renderer.shadowMap.enabled = true;
    // OPTIMIZATION: Switched to PCFShadowMap (faster than PCFSoftShadowMap)
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.shadowMap.autoUpdate = true;

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    mountRef.current.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xaaccff, 0.5);
    dirLight.position.set(-30, 60, -30);
    dirLight.castShadow = true;

    // Shadow optimization: Smaller map is often sufficient for this art style
    dirLight.shadow.mapSize.width = 512;
    dirLight.shadow.mapSize.height = 512;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 150;
    dirLight.shadow.camera.left = -15;
    dirLight.shadow.camera.right = 15;
    dirLight.shadow.camera.top = 20;
    dirLight.shadow.camera.bottom = -20;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    const streetGlow = new THREE.DirectionalLight(0xffaa00, 0.3);
    streetGlow.position.set(20, 10, 10);
    scene.add(streetGlow);

    // 5. Materials
    const waterMaterial = new THREE.MeshStandardMaterial({
      color: 0x0055aa,
      roughness: 0.02,
      metalness: 0.8,
      transparent: true,
      opacity: 0.9
    });

    waterMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };
      shader.vertexShader = `
        uniform float uTime;
        ${shader.vertexShader}
      `;
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>
        float wave = sin(position.y * 0.2 + uTime * 0.8) * 0.1 + 
                     cos(position.x * 0.3 + uTime * 0.5) * 0.05;
        transformed.z += wave;
        `
      );
      waterMaterial.userData.shader = shader;
    };

    const materials = {
      klinkers: new THREE.MeshStandardMaterial({ color: 0x5D4037, roughness: 0.9 }),
      hardsteen: new THREE.MeshStandardMaterial({ color: 0x3E2723, roughness: 0.8 }),
      water: waterMaterial,
      woodDark: new THREE.MeshStandardMaterial({ color: 0x261612 }),
      woodWarm: new THREE.MeshStandardMaterial({ color: 0x4E342E }),
      boatHull: new THREE.MeshStandardMaterial({ color: 0x3E2723, roughness: 0.2, metalness: 0.3 }),
      boatWood: new THREE.MeshStandardMaterial({ color: 0x8D6E63, roughness: 0.2, metalness: 0.1 }),
      boatInside: new THREE.MeshStandardMaterial({ color: 0x5D4037, roughness: 0.8 }),
      woodCream: new THREE.MeshStandardMaterial({ color: 0xfff3e0 }),
      gableTrim: new THREE.MeshStandardMaterial({ color: 0xffecb3 }),
      glass: new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.0, metalness: 0.9 }),
      glassLit: new THREE.MeshStandardMaterial({ color: 0xffb74d, emissive: 0xff8f00, emissiveIntensity: 2.0 }),
      glassRoof: new THREE.MeshStandardMaterial({ color: 0x81D4FA, roughness: 0.1, metalness: 0.8 }),
      iron: new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.6, roughness: 0.4 }),
      chrome: new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.2 }),
      pole: new THREE.MeshStandardMaterial({ color: 0x1f120d }),
      amsterdammertje: new THREE.MeshStandardMaterial({ color: 0x4a1212, roughness: 0.4, metalness: 0.3 }),
      leaves: new THREE.MeshStandardMaterial({ color: 0x1b3310 }),
      glow: new THREE.MeshBasicMaterial({ color: 0xffd54f }),
      stringLight: new THREE.MeshBasicMaterial({ color: 0xffca28 }),
      brickBase: new THREE.MeshStandardMaterial({ color: 0xffffff }),
      cushion: new THREE.MeshStandardMaterial({ color: 0x37474F, roughness: 1.0 }),
      saddle: new THREE.MeshStandardMaterial({ color: 0x3E2723, roughness: 0.9 }),
      flagRed: new THREE.MeshBasicMaterial({ color: 0xD32F2F }),
      flagWhite: new THREE.MeshBasicMaterial({ color: 0xFFFFFF }),
      flagBlack: new THREE.MeshBasicMaterial({ color: 0x111111 }),
      touristOrange: new THREE.MeshStandardMaterial({ color: 0x4E342E }),
      bikeFrame: new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.5, metalness: 0.5 })
    };

    const brickColors = [
      new THREE.Color(0x8d3b2d),
      new THREE.Color(0x5d2820),
      new THREE.Color(0x3e1c14),
      new THREE.Color(0x6D4C41),
      new THREE.Color(0x4a2c2a),
      new THREE.Color(0x1a2318)
    ];

    // 6. Geometry & Instancing setup
    // OPTIMIZATION: Reduced world size. We loop at 600, so we don't need 1600 units of geometry.
    const canalLength = 1000;

    const canalGeo = new THREE.PlaneGeometry(12, canalLength, 4, 64);
    const canal = new THREE.Mesh(canalGeo, materials.water);
    canal.rotation.x = -Math.PI / 2;
    scene.add(canal);

    const createStaticStreet = (xPos: number) => {
      const g = new THREE.Group();
      const edge = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, canalLength), materials.hardsteen);
      edge.position.set(xPos > 0 ? 6.4 : -6.4, 0.3, 0);
      edge.receiveShadow = true;
      g.add(edge);
      const road = new THREE.Mesh(new THREE.BoxGeometry(8, 0.4, canalLength), materials.klinkers);
      road.position.set(xPos > 0 ? 10.8 : -10.8, 0.2, 0);
      road.receiveShadow = true;
      g.add(road);
      scene.add(g);
    };
    createStaticStreet(1);
    createStaticStreet(-1);

    // --- INSTANCED MESHES ---
    // OPTIMIZATION: Drastically reduced limits for "lighter" city
    const maxHouses = 800; // Was 1600
    const maxWindows = 15000; // Was 35000
    const maxTrees = 600;    // Was 1500
    const maxPoles = 800;    // Was 2000
    const maxBoats = 60;     // Was 150
    const maxLights = 3000;  // Was 6000
    const maxLanterns = 400; // Was 1000
    const maxBikes = 800;    // Was 2000

    const dummy = new THREE.Object3D();

    // OPTIMIZATION: Only the main house block needs to cast shadows. 
    // Gables/details are too expensive for little gain in a dark scene.
    const houseMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), materials.brickBase, maxHouses);
    houseMesh.castShadow = true;
    houseMesh.receiveShadow = true;
    scene.add(houseMesh);

    const gableBlockMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), materials.brickBase, maxHouses * 4);
    gableBlockMesh.castShadow = false; // Disable shadow casting for details
    gableBlockMesh.receiveShadow = true;
    scene.add(gableBlockMesh);

    const trimMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 0.15, 1), materials.gableTrim, maxHouses * 4);
    trimMesh.castShadow = false;
    scene.add(trimMesh);

    const spoutGeo = new THREE.CylinderGeometry(0.1, 0.8, 1, 3, 1);
    spoutGeo.rotateY(Math.PI / 4);
    const spoutMesh = new THREE.InstancedMesh(spoutGeo, materials.brickBase, maxHouses);
    spoutMesh.castShadow = false;
    scene.add(spoutMesh);

    const frameMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(0.8, 1.4, 0.1), materials.woodCream, maxWindows);
    frameMesh.castShadow = false;
    scene.add(frameMesh);
    const glassMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(0.65, 1.25, 0.05), materials.glass, maxWindows);
    scene.add(glassMesh);
    const litGlassMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(0.65, 1.25, 0.05), materials.glassLit, maxWindows);
    scene.add(litGlassMesh);

    const lightSphereGeo = new THREE.SphereGeometry(0.08, 4, 3);
    const stringLightMesh = new THREE.InstancedMesh(lightSphereGeo, materials.stringLight, maxLights);
    scene.add(stringLightMesh);

    const beamMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(0.1, 0.1, 1.2), materials.woodDark, maxHouses);
    scene.add(beamMesh);

    const treeTrunkMesh = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.15, 0.2, 3, 4), materials.woodDark, maxTrees);
    scene.add(treeTrunkMesh);
    const treeLeavesMesh = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(1.5), materials.leaves, maxTrees);
    treeLeavesMesh.castShadow = false; // Complex geometry shadows are heavy
    treeLeavesMesh.receiveShadow = true;
    scene.add(treeLeavesMesh);

    const poleGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.8, 4);
    const poleMesh = new THREE.InstancedMesh(poleGeo, materials.amsterdammertje, maxPoles);
    poleMesh.castShadow = false;
    scene.add(poleMesh);

    const lanternPostGeo = new THREE.CylinderGeometry(0.1, 0.12, 3.5, 4);
    const lanternHeadGeo = new THREE.BoxGeometry(0.4, 0.6, 0.4);
    const lanternMesh = new THREE.InstancedMesh(lanternPostGeo, materials.iron, maxLanterns);
    const lanternHeadMesh = new THREE.InstancedMesh(lanternHeadGeo, materials.iron, maxLanterns);
    scene.add(lanternMesh);
    scene.add(lanternHeadMesh);

    const dockedHullMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1.6, 0.5, 4.0), materials.boatHull, maxBoats);
    dockedHullMesh.castShadow = false;
    scene.add(dockedHullMesh);
    const dockedCoverMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1.4, 0.2, 3.0), materials.woodWarm, maxBoats);
    scene.add(dockedCoverMesh);

    const bikeGeo = new THREE.TorusGeometry(0.35, 0.03, 5, 3);
    const bikeMesh = new THREE.InstancedMesh(bikeGeo, materials.bikeFrame, maxBikes * 2);
    scene.add(bikeMesh);

    const bikeFrameGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 3);
    const bikeFrameMesh = new THREE.InstancedMesh(bikeFrameGeo, materials.bikeFrame, maxBikes);
    scene.add(bikeFrameMesh);

    const bikeHandleGeo = new THREE.TorusGeometry(0.25, 0.02, 3, 3, Math.PI);
    const bikeHandleMesh = new THREE.InstancedMesh(bikeHandleGeo, materials.chrome, maxBikes);
    scene.add(bikeHandleMesh);

    const bikeSaddleGeo = new THREE.BoxGeometry(0.2, 0.08, 0.25);
    const bikeSaddleMesh = new THREE.InstancedMesh(bikeSaddleGeo, materials.saddle, maxBikes);
    scene.add(bikeSaddleMesh);

    const bikeCarrierGeo = new THREE.BoxGeometry(0.4, 0.02, 0.15);
    const bikeCarrierMesh = new THREE.InstancedMesh(bikeCarrierGeo, materials.bikeFrame, maxBikes);
    scene.add(bikeCarrierMesh);


    // --- GENERATION LOGIC ---
    // LOOP SETUP:
    const loopLength = 600;
    const genRange = loopLength / 2; // Generate from -300 to 300

    // Counters
    let houseIdx = 0;
    let gableBlockIdx = 0;
    let trimIdx = 0;
    let spoutIdx = 0;
    let beamIdx = 0;
    let frameIdx = 0;
    let glassIdx = 0;
    let litIdx = 0;
    let treeIdx = 0;
    let poleIdx = 0;
    let boatIdx = 0;
    let lightIdx = 0;
    let lanternIdx = 0;
    let bikeIdx = 0;

    // Helper to place 3 instances for periodicity
    const addPeriodicInstance = (mesh: THREE.InstancedMesh, idxRef: { val: number }, dummyObj: THREE.Object3D, max: number) => {
      if (idxRef.val + 3 > max) return; // Safety check

      const originalZ = dummyObj.position.z;

      // 1. Center
      dummyObj.updateMatrix();
      mesh.setMatrixAt(idxRef.val++, dummyObj.matrix);

      // 2. Back (-loopLength)
      dummyObj.position.z = originalZ - loopLength;
      dummyObj.updateMatrix();
      mesh.setMatrixAt(idxRef.val++, dummyObj.matrix);

      // 3. Front (+loopLength)
      dummyObj.position.z = originalZ + loopLength;
      dummyObj.updateMatrix();
      mesh.setMatrixAt(idxRef.val++, dummyObj.matrix);

      // Restore
      dummyObj.position.z = originalZ;
    };

    // Helper for color (sets 3 times)
    const setPeriodicColor = (mesh: THREE.InstancedMesh, startIdx: number, color: THREE.Color | number) => {
      mesh.setColorAt(startIdx, new THREE.Color(color));
      mesh.setColorAt(startIdx + 1, new THREE.Color(color));
      mesh.setColorAt(startIdx + 2, new THREE.Color(color));
    };

    const populateSide = (sx: number) => {
      let cz = -genRange;
      while (cz < genRange && houseIdx < maxHouses) {
        const w = 2.0 + Math.random() * 1.8;
        const h = 7.5 + Math.random() * 4.5;
        const depth = 6;
        const x = sx;
        const z = cz + w / 2;

        const houseColor = brickColors[Math.floor(Math.random() * brickColors.length)];

        // House Body
        dummy.position.set(x, h / 2, z);
        dummy.scale.set(w, h, depth);
        dummy.rotation.set(0, 0, 0);
        addPeriodicInstance(houseMesh, { val: houseIdx }, dummy, maxHouses);
        // Note: index for setPeriodicColor needs to be the START of the triplet, which is (idx - 3) after increment
        // But simpler: just track manual index or pass ref? 
        // Let's rely on the fact that houseIdx incremented by 3.
        setPeriodicColor(houseMesh, houseIdx - 3, houseColor);

        // Beam
        const facingRot = sx > 0 ? -Math.PI / 2 : Math.PI / 2;
        const beamOffset = sx > 0 ? -depth / 2 - 0.2 : depth / 2 + 0.2;
        dummy.position.set(x + beamOffset, h - 0.3, z);
        dummy.rotation.set(0, facingRot, 0);
        dummy.scale.set(1, 1, 1);
        addPeriodicInstance(beamMesh, { val: beamIdx }, dummy, maxHouses);
        beamIdx += 2; // addPeriodicInstance increments by 3, but the variable is primitive number passed? NO.
        // JS Alert: primitives are passed by value. I need to pass an object {val: ...}.
        // Correction in logic above: I used idxRef: {val:number}.

        // Refixing the loop logic to be clean:
        // houseIdx is the global counter. 
        // I'll rewrite the counters as objects to share state properly or just update them manually.
        // Let's use objects for counters locally or just manage them carefully.

        // Actually, to keep it readable, I will manually do the 3 lines in the critical sections or wrap strictly.
        // Let's try the object wrapper approach for all indices.
      }
    };
    // RESET: The previous block was "thought" code. The tool call is the actual implementation.
    // I will rewrite the entire populate logic to be loop-aware.

    // ... redefining populateSide ...

    const populateSideCorrected = (sx: number) => {
      let cz = -genRange;
      while (cz < genRange) { // Removed houseIdx check, will check inside
        const w = 2.0 + Math.random() * 1.8;
        const h = 7.5 + Math.random() * 4.5;
        const depth = 6;
        const x = sx;
        const z = cz + w / 2;

        const houseColor = brickColors[Math.floor(Math.random() * brickColors.length)];

        // HOUSE
        if (houseIdx + 3 <= maxHouses) {
          const originalZ = z;
          [-loopLength, 0, loopLength].forEach(offset => {
            dummy.position.set(x, h / 2, originalZ + offset);
            dummy.scale.set(w, h, depth);
            dummy.rotation.set(0, 0, 0);
            dummy.updateMatrix();
            houseMesh.setMatrixAt(houseIdx, dummy.matrix);
            houseMesh.setColorAt(houseIdx++, houseColor);
          });
        }

        const facingRot = sx > 0 ? -Math.PI / 2 : Math.PI / 2;
        const beamOffset = sx > 0 ? -depth / 2 - 0.2 : depth / 2 + 0.2;

        // BEAM
        if (beamIdx + 3 <= maxHouses) {
          [-loopLength, 0, loopLength].forEach(offset => {
            dummy.position.set(x + beamOffset, h - 0.3, z + offset);
            dummy.rotation.set(0, facingRot, 0);
            dummy.scale.set(1, 1, 1);
            dummy.updateMatrix();
            beamMesh.setMatrixAt(beamIdx++, dummy.matrix);
          });
        }

        const gableType = Math.random();
        if (gableType < 0.33) {
          const steps = 3;
          const stepH = 0.5;
          for (let i = 0; i < steps; i++) {
            const sw = w * (1 - (i * 0.25));
            const sh = h + (stepH * i) + stepH / 2;

            if (gableBlockIdx + 3 <= maxHouses * 4) {
              [-loopLength, 0, loopLength].forEach(offset => {
                dummy.position.set(x, sh, z + offset);
                dummy.rotation.set(0, 0, 0);
                dummy.scale.set(sw, stepH, depth);
                dummy.updateMatrix();
                gableBlockMesh.setMatrixAt(gableBlockIdx, dummy.matrix);
                gableBlockMesh.setColorAt(gableBlockIdx++, houseColor);
              });
            }
            if (trimIdx + 3 <= maxHouses * 4) {
              [-loopLength, 0, loopLength].forEach(offset => {
                dummy.position.set(x, sh + stepH / 2 + 0.05, z + offset);
                dummy.scale.set(sw + 0.1, 0.1, depth + 0.05);
                dummy.rotation.set(0, 0, 0);
                dummy.updateMatrix();
                trimMesh.setMatrixAt(trimIdx++, dummy.matrix);
              });
            }
          }
        } else if (gableType < 0.66) {
          const neckW = w * 0.6;
          const neckH = 1.2;
          if (gableBlockIdx + 3 <= maxHouses * 4) {
            [-loopLength, 0, loopLength].forEach(offset => {
              dummy.position.set(x, h + neckH / 2, z + offset);
              dummy.scale.set(neckW, neckH, depth);
              dummy.rotation.set(0, 0, 0);
              dummy.updateMatrix();
              gableBlockMesh.setMatrixAt(gableBlockIdx, dummy.matrix);
              gableBlockMesh.setColorAt(gableBlockIdx++, houseColor);
            });
          }
          if (trimIdx + 3 <= maxHouses * 4) {
            [-loopLength, 0, loopLength].forEach(offset => {
              dummy.position.set(x, h + neckH + 0.1, z + offset);
              dummy.scale.set(neckW + 0.2, 0.2, depth + 0.1);
              dummy.rotation.set(0, 0, 0);
              dummy.updateMatrix();
              trimMesh.setMatrixAt(trimIdx++, dummy.matrix);
            });
          }
        } else {
          const spoutH = 1.5;
          if (spoutIdx + 3 <= maxHouses) {
            [-loopLength, 0, loopLength].forEach(offset => {
              dummy.position.set(x, h + spoutH / 2, z + offset);
              dummy.rotation.set(0, facingRot, 0);
              dummy.scale.set(depth, spoutH, w);
              dummy.updateMatrix();
              spoutMesh.setMatrixAt(spoutIdx, dummy.matrix);
              spoutMesh.setColorAt(spoutIdx++, houseColor);
            });
          }
        }

        const floors = Math.floor(h / 1.7);
        const cols = Math.floor(w / 1.3);
        const startXwindow = -((cols - 1) * 1.3) / 2;

        for (let f = 1; f < floors; f++) {
          for (let c = 0; c < cols; c++) {
            const wxRel = startXwindow + c * 1.3;
            const wy = f * 1.7 + 0.5;
            const winDepthOffset = depth / 2 + 0.05;
            let wxWorld, wzWorldBase;

            if (sx > 0) {
              wxWorld = x - winDepthOffset;
              wzWorldBase = z + wxRel;
              dummy.rotation.set(0, -Math.PI / 2, 0);
            } else {
              wxWorld = x + winDepthOffset;
              wzWorldBase = z - wxRel;
              dummy.rotation.set(0, Math.PI / 2, 0);
            }

            if (frameIdx + 3 <= maxWindows) {
              const isLit = Math.random() > 0.5;
              [-loopLength, 0, loopLength].forEach(offset => {
                dummy.position.set(wxWorld, wy, wzWorldBase + offset);
                dummy.scale.set(1, 1, 1);
                dummy.updateMatrix();
                frameMesh.setMatrixAt(frameIdx++, dummy.matrix);

                if (glassIdx + 3 <= maxWindows && litIdx + 3 <= maxWindows) {
                  if (isLit) {
                    litGlassMesh.setMatrixAt(litIdx++, dummy.matrix);
                  } else {
                    glassMesh.setMatrixAt(glassIdx++, dummy.matrix);
                  }
                }
              });
            }
          }
        }
        cz += w;
      }
    };

    populateSideCorrected(-16);
    populateSideCorrected(16);

    // Environment & Details Loop
    let stepCount = 0;
    for (let z = -genRange; z < genRange; z += 5) {
      stepCount++;

      if (stepCount % 2 !== 0) {
        if (treeIdx + 3 <= maxTrees) {
          [-7.8, 7.8].forEach(tx => {
            dummy.position.set(tx, 1.5, z + (Math.random() * 2));
            dummy.scale.set(1, 1, 1);
            dummy.rotation.set(0, Math.random(), 0);

            // Trunk
            // Let's do it manually for trees to ensure they sync.
            // Actually, easiest is:
            // 1. Capture current `treeIdx`.
            // 2. Add trunks (uses 0, 1, 2).
            // 3. Reset `treeIdx` locally? No, that would overwrite.
            // 4. We want to write to Trunk[0,1,2] and Leaves[0,1,2].
            // So we should pass a COPY of treeIdx to both, then increment treeIdx manually by 3.

            const idxRefTrunk = { val: treeIdx };
            const idxRefLeaves = { val: treeIdx };

            addPeriodicInstance(treeTrunkMesh, idxRefTrunk, dummy, maxTrees);

            dummy.position.set(tx, 4.0, z + (Math.random() * 2));
            dummy.scale.set(1, 1.2, 1);

            addPeriodicInstance(treeLeavesMesh, idxRefLeaves, dummy, maxTrees);

            treeIdx += 3; // Manually update global counter

            // String Lights between trees
            for (let k = 0; k < 5; k++) {
              const lx = tx + (Math.random() - 0.5) * 1.5;
              const ly = 3.5 + (Math.random() * 1.5);
              const lz = z + (Math.random() - 0.5) * 1.5;
              if (lightIdx + 3 <= maxLights) {
                dummy.position.set(lx, ly, lz);
                dummy.scale.set(0.6, 0.6, 0.6);
                dummy.rotation.set(0, 0, 0);
                addPeriodicInstance(stringLightMesh, { val: lightIdx }, dummy, maxLights);
                lightIdx += 3;
              }
            }
          });
        }
      } else {
        if (lanternIdx + 3 <= maxLanterns) {
          [-6.8, 6.8].forEach(lx => {
            dummy.position.set(lx, 1.75, z);
            dummy.scale.set(1, 1, 1);
            dummy.rotation.set(0, 0, 0);

            const idxRefPost = { val: lanternIdx };
            const idxRefHead = { val: lanternIdx }; // Reuse index for synced arrays

            addPeriodicInstance(lanternMesh, idxRefPost, dummy, maxLanterns);

            dummy.position.set(lx, 3.6, z);
            addPeriodicInstance(lanternHeadMesh, idxRefHead, dummy, maxLanterns);

            lanternIdx += 3;

            if (lightIdx + 3 <= maxLights) {
              dummy.position.set(lx, 3.6, z);
              dummy.scale.set(1.5, 1.5, 1.5);
              addPeriodicInstance(stringLightMesh, { val: lightIdx }, dummy, maxLights);
              lightIdx += 3;
            }
          });
        }
      }

      if (z % 3 === 0 && poleIdx + 3 <= maxPoles) {
        [-6.4, 6.4].forEach(px => {
          dummy.position.set(px, 0.4, z);
          dummy.scale.set(1, 1, 1);
          dummy.rotation.set(0, 0, 0);
          addPeriodicInstance(poleMesh, { val: poleIdx }, dummy, maxPoles);
          poleIdx += 3;
        });
      }

      if (bikeIdx + 3 <= maxBikes - 8) {
        [-6.2, 6.2].forEach(bx => {
          for (let b = 0; b < 2; b++) {
            const bz = z + (Math.random() * 3);
            const rot = (Math.random() - 0.5) * 0.8;
            const isLeft = bx < 0;

            // Parts need sync logic?
            // Yes, bikeMesh (wheels) uses 2x indices (front/back).
            // frame, handle, saddle, carrier use 1x.
            // Global `bikeIdx` tracks "Bikes".
            // So for Bike N:
            // Frame[N], Handle[N], etc.
            // Wheels[2N, 2N+1].

            // This is complex with periodic. 
            // 3 bikes: N, N+1, N+2? No, 3 copies of SAME bike.
            // Bike Location i:
            //   - Center: BikeIdx K
            //   - Back: BikeIdx K+1
            //   - Front: BikeIdx K+2
            // So we consume 3 "Bike Slots".

            const currentBikeIdx = bikeIdx;

            // Helper for bike parts
            const addBikePart = (mesh: THREE.InstancedMesh, partOffset: number, scaleOverride?: number) => {
              // For part meshes, we just need 3 consecutive indices from currentBikeIdx
              // Wait, we need to pass a "reset" ref every time?
              // Yes: {val: currentBikeIdx}.
            };

            // Actually, let's just use the `addPeriodicInstance` logic but being careful.

            // 1. WHEELS (Special case: 2 wheels per bike)
            // We need 3 pairs of wheels.
            // Wheel indices: [2*K, 2*K+1], [2*(K+1), ...? ]
            // The original code: `bikeMesh.setMatrixAt(bikeIdx * 2, ...)`
            // This implies bikeMesh is sized 2 * maxBikes.
            // If we increment bikeIdx by 3 (K, K+1, K+2), then:
            // Center Bike (K): Uses 2K, 2K+1.
            // Back Bike (K+1): Uses 2(K+1), ...
            // This works perfectly if we treat them as independent bikes in the arrays.

            dummy.position.set(bx, 0.95, bz - 0.45);
            dummy.rotation.set(rot, isLeft ? -0.1 : 0.1, 0);
            dummy.scale.set(1, 1, 1);

            // Front Wheel
            // We can't use `addPeriodicInstance` easily because it assumes +1 stride.
            // Wheels need +2 stride if we want to interleave or we just map carefully.
            // Actually, let's just do it manually for wheels to avoid headache.

            const offsets = [-loopLength, 0, loopLength];
            offsets.forEach((offset, i) => {
              const idx = bikeIdx + i; // K, K+1, K+2

              // Front Wheel
              dummy.position.set(bx, 0.95, bz - 0.45 + offset);
              dummy.rotation.set(rot, isLeft ? -0.1 : 0.1, 0);
              dummy.updateMatrix();
              bikeMesh.setMatrixAt(idx * 2, dummy.matrix);

              // Rear Wheel
              dummy.position.set(bx, 0.95, bz + 0.45 + offset);
              dummy.rotation.set(rot + 0.1, isLeft ? -0.4 : 0.4, 0);
              dummy.updateMatrix();
              bikeMesh.setMatrixAt(idx * 2 + 1, dummy.matrix);

              // Frame
              dummy.position.set(bx, 1.15, bz + offset);
              dummy.rotation.set(rot + Math.PI / 4, isLeft ? -0.1 : 0.1, 0);
              dummy.updateMatrix();
              bikeFrameMesh.setMatrixAt(idx, dummy.matrix);

              // Handle
              dummy.position.set(bx, 1.6, bz + 0.3 + offset);
              dummy.rotation.set(rot - 0.5, isLeft ? -0.4 : 0.4, 0);
              dummy.updateMatrix();
              bikeHandleMesh.setMatrixAt(idx, dummy.matrix);

              // Saddle
              dummy.position.set(bx, 1.5, bz - 0.2 + offset);
              dummy.rotation.set(rot, isLeft ? -0.1 : 0.1, 0);
              dummy.updateMatrix();
              bikeSaddleMesh.setMatrixAt(idx, dummy.matrix);

              // Carrier
              dummy.position.set(bx, 1.35, bz - 0.45 + offset);
              dummy.rotation.set(rot, isLeft ? -0.1 : 0.1, Math.PI / 2);
              dummy.updateMatrix();
              bikeCarrierMesh.setMatrixAt(idx, dummy.matrix);
            });

            bikeIdx += 3;
          }
        });
      }

      if (z % 25 === 0 && lightIdx + (16 * 3) <= maxLights) { // Check space for 3 copies of 16 lights
        const startX = -7.8;
        const endX = 7.8;
        const height = 4.5;
        const sag = 1.5;

        const points = 15;
        for (let i = 0; i <= points; i++) {
          const t = i / points;
          const x = startX + (endX - startX) * t;
          const y = height - (Math.sin(t * Math.PI) * sag);

          dummy.position.set(x, y, z);
          dummy.scale.set(1, 1, 1);

          addPeriodicInstance(stringLightMesh, { val: lightIdx }, dummy, maxLights);
          lightIdx += 3;
        }
      }

      if (z % 15 === 0 && Math.random() > 0.3 && boatIdx + 3 <= maxBoats) {
        const bx = 5.4;
        const isLeft = Math.random() > 0.5;

        dummy.position.set(isLeft ? -bx : bx, 0.2, z);
        dummy.rotation.set(Math.random() * 0.1, isLeft ? -0.1 : 0.1, Math.random() * 0.1);
        dummy.scale.set(1, 1, 1);

        // Hull
        addPeriodicInstance(dockedHullMesh, { val: boatIdx }, dummy, maxBoats);

        // Cover
        // This is getting messy. Cleanest is:
        // const idx = boatIdx;
        // addPeriodicInstance(hull, {val: idx}, ...);
        // addPeriodicInstance(cover, {val: idx}, ...); // Fails (val is copied)

        // Correct:
        const currentRefHull = { val: boatIdx };
        const currentRefCover = { val: boatIdx }; // Start same

        addPeriodicInstance(dockedHullMesh, currentRefHull, dummy, maxBoats);

        dummy.position.set(isLeft ? -bx : bx, 0.45, z);
        addPeriodicInstance(dockedCoverMesh, currentRefCover, dummy, maxBoats);

        boatIdx += 3;
      }
    }

    // Adjust boat loop logic
    // if (boatZ < -600) boatZ += 600; -> Logic is already correct for loopLength = 600.


    houseMesh.instanceMatrix.needsUpdate = true; houseMesh.instanceColor.needsUpdate = true;
    gableBlockMesh.instanceMatrix.needsUpdate = true; gableBlockMesh.instanceColor.needsUpdate = true;
    trimMesh.instanceMatrix.needsUpdate = true;
    spoutMesh.instanceMatrix.needsUpdate = true; spoutMesh.instanceColor.needsUpdate = true;
    beamMesh.instanceMatrix.needsUpdate = true;
    frameMesh.instanceMatrix.needsUpdate = true; glassMesh.instanceMatrix.needsUpdate = true; litGlassMesh.instanceMatrix.needsUpdate = true;
    treeTrunkMesh.instanceMatrix.needsUpdate = true; treeLeavesMesh.instanceMatrix.needsUpdate = true;
    poleMesh.instanceMatrix.needsUpdate = true; dockedHullMesh.instanceMatrix.needsUpdate = true; dockedCoverMesh.instanceMatrix.needsUpdate = true;
    stringLightMesh.instanceMatrix.needsUpdate = true;
    lanternMesh.instanceMatrix.needsUpdate = true; lanternHeadMesh.instanceMatrix.needsUpdate = true;
    bikeMesh.instanceMatrix.needsUpdate = true; bikeFrameMesh.instanceMatrix.needsUpdate = true;
    bikeHandleMesh.instanceMatrix.needsUpdate = true; bikeSaddleMesh.instanceMatrix.needsUpdate = true; bikeCarrierMesh.instanceMatrix.needsUpdate = true;

    const createSloop = () => {
      const g = new THREE.Group();

      // OPTIMIZATION: Reduced segments
      const hullGeo = new THREE.CylinderGeometry(1.4, 1.2, 9.5, 12, 1, false);
      hullGeo.scale(1, 1, 0.45);
      const hull = new THREE.Mesh(hullGeo, materials.boatHull);
      hull.rotation.set(Math.PI / 2, 0, 0);
      hull.position.y = 0.5;
      hull.castShadow = true;
      g.add(hull);

      const floor = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.1, 8.0), materials.boatInside);
      floor.position.y = 0.6;
      floor.castShadow = false; // Internal details don't need shadows
      floor.receiveShadow = true;
      g.add(floor);

      const roofGeo = new THREE.BoxGeometry(2.0, 0.1, 6.0);
      const roof = new THREE.Mesh(roofGeo, materials.boatWood);
      roof.position.set(0, 2.2, 0.5);
      roof.castShadow = true;
      g.add(roof);

      const glassPanelGeo = new THREE.BoxGeometry(1.8, 0.05, 5.8);
      const glassPanel = new THREE.Mesh(glassPanelGeo, materials.glassRoof);
      glassPanel.position.set(0, 2.25, 0.5);
      g.add(glassPanel);

      const sideWindowGeo = new THREE.BoxGeometry(0.05, 1.0, 6.0);
      const leftWindow = new THREE.Mesh(sideWindowGeo, materials.glassRoof);
      leftWindow.position.set(-1.0, 1.7, 0.5);
      g.add(leftWindow);
      const rightWindow = new THREE.Mesh(sideWindowGeo, materials.glassRoof);
      rightWindow.position.set(1.0, 1.7, 0.5);
      g.add(rightWindow);

      const postGeo = new THREE.BoxGeometry(0.1, 1.6, 0.1);
      for (let i = 0; i < 5; i++) {
        const zPos = -2.0 + i * 1.2;
        const postL = new THREE.Mesh(postGeo, materials.boatWood);
        postL.position.set(-1.0, 1.4, zPos);
        g.add(postL);
        const postR = new THREE.Mesh(postGeo, materials.boatWood);
        postR.position.set(1.0, 1.4, zPos);
        g.add(postR);
      }

      const endWindowGeo = new THREE.BoxGeometry(2.0, 1.0, 0.05);
      const frontWindow = new THREE.Mesh(endWindowGeo, materials.glassRoof);
      frontWindow.position.set(0, 1.7, 3.5);
      g.add(frontWindow);
      const backWindow = new THREE.Mesh(endWindowGeo, materials.glassRoof);
      backWindow.position.set(0, 1.7, -2.5);
      g.add(backWindow);

      const seatGeo = new THREE.BoxGeometry(0.8, 0.4, 0.5);
      const backGeo = new THREE.BoxGeometry(0.8, 0.4, 0.1);

      for (let r = 0; r < 6; r++) {
        const zPos = -2.0 + r * 0.9;
        const sl = new THREE.Mesh(seatGeo, materials.cushion);
        sl.position.set(-0.6, 0.8, zPos); g.add(sl);
        const bl = new THREE.Mesh(backGeo, materials.cushion);
        bl.position.set(-0.6, 1.1, zPos + 0.2); g.add(bl);
        const sr = new THREE.Mesh(seatGeo, materials.cushion);
        sr.position.set(0.6, 0.8, zPos); g.add(sr);
        const br = new THREE.Mesh(backGeo, materials.cushion);
        br.position.set(0.6, 1.1, zPos + 0.2); g.add(br);
      }

      const rearDeck = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.1, 1.5), materials.boatHull);
      rearDeck.position.set(0, 0.8, -3.5);
      rearDeck.receiveShadow = true;
      g.add(rearDeck);

      // OPTIMIZATION: Low poly torus
      const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.05, 6, 4), materials.iron);
      wheel.position.set(0, 1.5, -3.8); wheel.rotation.x = -0.2; g.add(wheel);

      const stripe = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.15, 8.6), materials.touristOrange);
      stripe.position.y = 0.9; g.add(stripe);

      const headLight = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 0.1), materials.glow);
      headLight.position.set(0, 0.9, 4.2); g.add(headLight);
      const spot = new THREE.SpotLight(0xffffee, 2.0, 15, 0.5, 0.5, 1);
      spot.position.set(0, 1.0, 4.0); spot.target.position.set(0, 0, 10); g.add(spot); g.add(spot.target);

      const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1.0, 6), materials.boatWood);
      chimney.position.set(0, 2.7, -3.0); g.add(chimney);

      const flagPole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.2, 4), materials.iron);
      flagPole.position.set(0, 2.8, -3.0);
      flagPole.rotation.x = -0.1;
      g.add(flagPole);

      const flagGroup = new THREE.Group();
      flagGroup.position.set(0, 3.3, -3.1);
      flagGroup.rotation.y = Math.PI / 2;

      const fMain = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.5, 0.8), materials.flagRed);
      flagGroup.add(fMain);
      const fBlack = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.16, 0.8), materials.flagBlack);
      flagGroup.add(fBlack);
      for (let x = 0; x < 3; x++) {
        const cross = new THREE.Group();
        const bar1 = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.12, 0.03), materials.flagWhite);
        bar1.rotation.x = Math.PI / 4;
        const bar2 = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.12, 0.03), materials.flagWhite);
        bar2.rotation.x = -Math.PI / 4;
        cross.add(bar1); cross.add(bar2);
        cross.position.set(0, 0, -0.25 + x * 0.25);
        flagGroup.add(cross);
      }
      g.add(flagGroup);

      return g;
    };

    boatGroup = createSloop();
    scene.add(boatGroup);


    // ANIMATION
    const startZ = 25;

    // PHYSICS VARS
    let boatZ = startZ;
    let speed = 0;
    const maxSpeed = 2.0; // Reduced speed for a more relaxed cruise feel

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Visibility Check: Stop rendering if off screen
      if (!isVisible) return;

      // OPTIMIZATION: Delta time for smooth movement regardless of FPS
      const dt = Math.min(clock.getDelta(), 0.1); // Cap delta to prevent huge jumps
      const time = clock.getElapsedTime();

      if (materials.water.userData.shader) {
        materials.water.userData.shader.uniforms.uTime.value = time;
      }

      // GAS PEDAL LOGIC:
      const throttle = Math.max(0, currentScroll);
      const targetSpeed = throttle * maxSpeed;

      // Accelerate/Decelerate smoothly using Delta Time
      // Lowered factor slightly to give the boat more "weight"
      const accelFactor = 1.0;
      speed += (targetSpeed - speed) * accelFactor * dt;

      // SAFETY: Clamp speed
      if (speed < 0.01) speed = 0;

      // Move boat forward based on speed * dt
      boatZ -= speed * 5.0 * dt;

      // INFINITE LOOP MECHANIC:
      if (boatZ < -600) {
        boatZ += 600;
      }

      if (boatGroup) {
        boatGroup.position.z = boatZ;
        boatGroup.rotation.x = Math.sin(time) * 0.002 + (speed * 0.005);
        boatGroup.rotation.z = Math.sin(time * 0.8) * 0.003;

        const camOffsetZ = 7.0; const camOffsetY = 2.4;
        const targetCamX = boatGroup.position.x;
        const targetCamY = boatGroup.position.y + camOffsetY;
        const targetCamZ = boatGroup.position.z + camOffsetZ;

        // Smooth camera follow
        const lerpFactor = 5.0 * dt;
        camera.position.x += (targetCamX - camera.position.x) * lerpFactor;
        camera.position.y += (targetCamY - camera.position.y) * lerpFactor;
        camera.position.z = targetCamZ;

        camera.lookAt(0, 1.0, boatGroup.position.z - 20);
      }
      // DYNAMIC RESOLUTION SCALING
      // If dt > 40ms (~25fps) consistently, drop resolution
      if (dt > 0.04) {
        if (renderer.getPixelRatio() > 0.75) {
          renderer.setPixelRatio(Math.max(0.75, renderer.getPixelRatio() * 0.99));
        }
      } else if (dt < 0.02 && renderer.getPixelRatio() < maxPixelRatio) {
        // Recover quality if running smooth (>50fps)
        renderer.setPixelRatio(Math.min(maxPixelRatio, renderer.getPixelRatio() + 0.001));
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      unsubscribe();
      if (observer) observer.disconnect();
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer) {
        mountRef.current.removeChild(renderer.domElement);
      }
      if (animationId) cancelAnimationFrame(animationId);

      // Cleanup helper
      const disposeNode = (node: any) => {
        if (node.geometry) node.geometry.dispose();
        if (node.material) {
          if (Array.isArray(node.material)) {
            node.material.forEach((m: any) => m.dispose());
          } else {
            node.material.dispose();
          }
        }
      };

      scene.traverse(disposeNode);
      if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss();
      }
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
});