"use client";

import { useState, useRef, Suspense, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { insertOrder } from "@/lib/db";
import * as THREE from "three";
import { cn } from "@/lib/utils";

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
  } catch {
    return false;
  }
}

const FABRICS = [
  { id: "super-180s",     name: "Super 180s Wool",    color: "#1a2040", material: "Super 180s — Ultra-fine Italian weave", grade: "Ultra Premium" },
  { id: "super-150s",     name: "Super 150s Wool",    color: "#1e2e5a", material: "Super 150s — Silky smooth finish",      grade: "Premium" },
  { id: "super-120s",     name: "Super 120s Wool",    color: "#2d2d2d", material: "Super 120s — Classic fine weave",       grade: "Premium" },
  { id: "italian-wool",   name: "Italian Wool",        color: "#0d1b3e", material: "Italian Wool — Loro Piana inspired",   grade: "Premium" },
  { id: "english-wool",   name: "English Wool",        color: "#1a3a2a", material: "English Wool — Hardy Amies tradition", grade: "Classic" },
  { id: "woolen-blend",   name: "Woolen Blend",        color: "#3a3a4a", material: "Woolen Blend — Versatile year-round",  grade: "Everyday" },
  { id: "merino",         name: "Australian Merino",  color: "#4a3520", material: "100% Australian Merino Wool",           grade: "Classic" },
  { id: "cashmere-blend", name: "Cashmere Blend",     color: "#6b4c3b", material: "Cashmere-Wool — Exceptionally soft",   grade: "Luxury" },
  { id: "linen-summer",   name: "Summer Linen",        color: "#d4c9a8", material: "Linen-Silk Blend — Breathable",        grade: "Resort" },
  { id: "tweed",          name: "Heritage Tweed",      color: "#5a4a2a", material: "English Tweed — Country classic",      grade: "Heritage" },
  { id: "velvet",         name: "Velvet",              color: "#2a1a4a", material: "Cotton Velvet — Evening prestige",     grade: "Occasion" },
  { id: "barathea",       name: "Barathea",            color: "#111111", material: "Fine Barathea — Smooth black tie",     grade: "Black Tie" },
];

const FABRIC_COLORS = [
  { id: "navy",        name: "Navy",          hex: "#1e2e5a" },
  { id: "midnight",    name: "Midnight Blue", hex: "#0d1b3e" },
  { id: "charcoal",    name: "Charcoal",      hex: "#2d2d2d" },
  { id: "black",       name: "Black",         hex: "#111111" },
  { id: "forest",      name: "Forest Green",  hex: "#1a3a2a" },
  { id: "burgundy",    name: "Burgundy",      hex: "#5c1a1a" },
  { id: "deep-plum",   name: "Deep Plum",     hex: "#3a1a4a" },
  { id: "dark-teal",   name: "Dark Teal",     hex: "#1a3a3a" },
  { id: "grey",        name: "Steel Grey",    hex: "#5a5a6a" },
  { id: "slate",       name: "Slate Blue",    hex: "#4a6080" },
  { id: "olive",       name: "Olive",         hex: "#4a4e28" },
  { id: "brown",       name: "Chocolate",     hex: "#3a2010" },
  { id: "caramel",     name: "Caramel",       hex: "#8a5c2a" },
  { id: "racing-green",name: "Racing Green",  hex: "#0a3020" },
  { id: "royal-blue",  name: "Royal Blue",    hex: "#2040a0" },
  { id: "cobalt",      name: "Cobalt",        hex: "#1a4090" },
  { id: "stone",       name: "Stone Grey",    hex: "#7a7a7a" },
  { id: "tan",         name: "Warm Tan",      hex: "#b8924a" },
  { id: "camel",       name: "Camel",         hex: "#c19a6b" },
  { id: "ivory",       name: "Ivory",         hex: "#e8e0d0" },
  { id: "champagne",   name: "Champagne",     hex: "#d4c9a8" },
  { id: "powder-blue", name: "Powder Blue",   hex: "#8ab0d0" },
  { id: "sage",        name: "Sage",          hex: "#7a9a7a" },
  { id: "blush",       name: "Blush",         hex: "#c09a9a" },
];

const LAPELS   = ["Notch Lapel", "Peak Lapel", "Shawl Lapel"];
const BUTTONS  = ["One Button", "Two Button", "Three Button", "Double Breasted"];
const POCKETS  = ["Flap Pockets", "Welt Pockets", "Patch Pockets", "Ticket Pocket"];
const CUTS     = ["Slim Fit", "Modern Fit", "Classic Fit"];
const VENTS    = ["No Vent", "Single Vent", "Double Vent"];
const TROUSERS = ["Flat Front", "Single Pleat", "Double Pleat"];
const LININGS  = [
  { name: "Champagne",  color: "#c9a85c" },
  { name: "Sky Blue",   color: "#3a7ebf" },
  { name: "Burgundy",   color: "#8c2c2c" },
  { name: "Ivory",      color: "#f5f0e8" },
  { name: "Charcoal",   color: "#444444" },
  { name: "Emerald",    color: "#1a6a3a" },
  { name: "Coral",      color: "#c05050" },
  { name: "Violet",     color: "#5a3a7a" },
  { name: "Gold",       color: "#b8930a" },
  { name: "Rose Gold",  color: "#c07060" },
  { name: "Midnight",   color: "#1a1a3a" },
  { name: "Blush Pink", color: "#d48080" },
];

const VIEWS = [
  { id: "front", label: "Front", icon: "⬆", rotY: 0 },
  { id: "left",  label: "Left",  icon: "◀", rotY: Math.PI / 2 },
  { id: "back",  label: "Back",  icon: "⬇", rotY: Math.PI },
  { id: "right", label: "Right", icon: "▶", rotY: -Math.PI / 2 },
  { id: "auto",  label: "360°",  icon: "↺", rotY: null },
];

type SuitConfig = { fabricColor: string; lapel: string; buttons: string; cut: string; liningColor: string };

function MannequinFigure({ config, viewId }: { config: SuitConfig; viewId: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const rotYRef  = useRef(0);
  const targetRotY = VIEWS.find(v => v.id === viewId)?.rotY ?? null;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (viewId === "auto" || targetRotY === null) {
      rotYRef.current += delta * 0.45;
      groupRef.current.rotation.y = rotYRef.current;
    } else {
      rotYRef.current = THREE.MathUtils.lerp(rotYRef.current, targetRotY, 0.10);
      groupRef.current.rotation.y = rotYRef.current;
    }
  });

  const c      = new THREE.Color(config.fabricColor);
  const darker = c.clone().multiplyScalar(0.72);

  const suitMat   = <meshStandardMaterial color={c}      roughness={0.72} metalness={0.05} />;
  const panelMat  = <meshStandardMaterial color={darker} roughness={0.78} metalness={0.03} />;
  const shirtMat  = <meshStandardMaterial color="#f8f4ec" roughness={0.88} />;
  const liningMat = <meshStandardMaterial color={config.liningColor} roughness={0.55} metalness={0.04} />;
  const skinMat   = <meshStandardMaterial color="#d9b99a" roughness={0.80} />;
  const shoeMat   = <meshStandardMaterial color="#1a1208" roughness={0.35} metalness={0.15} />;
  const btnMat    = <meshStandardMaterial color="#c8b880" metalness={0.7} roughness={0.3} />;
  const standMat  = <meshStandardMaterial color="#444" metalness={0.6} roughness={0.4} />;
  const baseMat   = <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.3} />;

  const torsoW = config.cut === "Slim Fit" ? 0.85 : config.cut === "Classic Fit" ? 1.06 : 0.96;
  const lapelRot = config.lapel === "Peak Lapel" ? -0.38 : config.lapel === "Shawl Lapel" ? 0.08 : 0.28;
  const lapelH   = config.lapel === "Shawl Lapel" ? 0.65 : 0.50;
  const lapelW   = config.lapel === "Peak Lapel"  ? 0.27 : 0.22;
  const btnCount = config.buttons === "One Button" ? 1 : config.buttons === "Three Button" ? 3 : config.buttons === "Double Breasted" ? 6 : 2;
  const dbl = config.buttons === "Double Breasted";
  const btnPositions: number[] = [];
  if (btnCount === 1) btnPositions.push(0.75);
  else if (btnCount === 2) btnPositions.push(0.60, 0.88);
  else btnPositions.push(0.52, 0.74, 0.96);

  return (
    <group ref={groupRef} position={[0, -1.85, 0]}>
      <mesh position={[0, 0.22, 0]}><cylinderGeometry args={[0.04, 0.04, 0.44, 10]} />{standMat}</mesh>
      <mesh position={[0, 0.0, 0]}><cylinderGeometry args={[0.44, 0.5, 0.06, 28]} />{baseMat}</mesh>
      {[-0.23, 0.23].map((x, i) => (
        <group key={i}>
          <mesh position={[x, 0.82, 0]}><cylinderGeometry args={[0.165, 0.15, 1.1, 16]} />{suitMat}</mesh>
          <mesh position={[x, 0.18, 0]}><cylinderGeometry args={[0.13, 0.11, 0.62, 16]} />{suitMat}</mesh>
          <mesh position={[x, 0.6, 0.135]}><boxGeometry args={[0.02, 1.2, 0.01]} />{panelMat}</mesh>
          <mesh position={[x, -0.15, 0.06]}><boxGeometry args={[0.155, 0.075, 0.30]} />{shoeMat}</mesh>
          <mesh position={[x, -0.10, 0.11]}><boxGeometry args={[0.145, 0.06, 0.11]} />{shoeMat}</mesh>
        </group>
      ))}
      <mesh position={[0, 1.26, 0]}><cylinderGeometry args={[torsoW * 0.40, torsoW * 0.43, 0.24, 22]} />{suitMat}</mesh>
      <mesh position={[0, 1.72, 0]}><cylinderGeometry args={[torsoW * 0.43, torsoW * 0.41, 0.96, 22]} />{suitMat}</mesh>
      <mesh position={[0, 1.72, -torsoW * 0.39]}><boxGeometry args={[torsoW * 0.82, 0.96, 0.03]} />{panelMat}</mesh>
      {[-1, 1].map((side, i) => (
        <mesh key={i} position={[side * torsoW * 0.42, 1.72, 0]}><boxGeometry args={[0.014, 0.96, 0.88 * torsoW]} />{panelMat}</mesh>
      ))}
      <mesh position={[0, 1.26, 0]}><cylinderGeometry args={[torsoW * 0.425, torsoW * 0.425, 0.03, 22]} />{liningMat}</mesh>
      <mesh position={[0, 1.72, torsoW * 0.415]}><boxGeometry args={[0.175, 0.80, 0.025]} />{shirtMat}</mesh>
      {[1.35, 1.56, 1.77, 1.98].map((y, i) => (
        <mesh key={i} position={[0, y, torsoW * 0.42]}><sphereGeometry args={[0.014, 8, 6]} /><meshStandardMaterial color="#d0c8b0" roughness={0.5} /></mesh>
      ))}
      <mesh position={[0, 2.22, 0]}><cylinderGeometry args={[torsoW * 0.44, torsoW * 0.43, 0.52, 22]} />{suitMat}</mesh>
      {[-1, 1].map((side, i) => (
        <group key={i}>
          <mesh position={[side * (torsoW * 0.44 + 0.12), 2.40, 0]}><boxGeometry args={[0.24, 0.12, 0.44]} />{suitMat}</mesh>
          <mesh position={[side * (torsoW * 0.44 + 0.12), 2.44, 0]}><boxGeometry args={[0.22, 0.014, 0.42]} />{panelMat}</mesh>
        </group>
      ))}
      {[-1, 1].map((side, i) => (
        <group key={i}>
          <mesh position={[side * (torsoW * 0.44 + 0.22), 2.02, 0]} rotation={[0, 0, side * 0.10]}><cylinderGeometry args={[0.13, 0.12, 0.75, 14]} />{suitMat}</mesh>
          <mesh position={[side * (torsoW * 0.44 + 0.26), 1.45, 0]} rotation={[0, 0, side * 0.05]}><cylinderGeometry args={[0.105, 0.095, 0.64, 14]} />{suitMat}</mesh>
          {[1.17, 1.27, 1.37].map((y, j) => (
            <mesh key={j} position={[side * (torsoW * 0.44 + 0.26 + 0.09), y, side * 0.01]}><cylinderGeometry args={[0.018, 0.018, 0.014, 10]} />{btnMat}</mesh>
          ))}
          <mesh position={[side * (torsoW * 0.44 + 0.27), 1.13, 0]}><cylinderGeometry args={[0.095, 0.095, 0.07, 14]} />{shirtMat}</mesh>
          <mesh position={[side * (torsoW * 0.44 + 0.27), 1.00, 0]}><sphereGeometry args={[0.085, 12, 10]} />{skinMat}</mesh>
        </group>
      ))}
      {[-1, 1].map((side, i) => (
        <group key={i}>
          <mesh position={[side * 0.16, 2.26, torsoW * 0.40]} rotation={[0, 0, side * lapelRot]}><boxGeometry args={[lapelW, lapelH, 0.04]} />{suitMat}</mesh>
          <mesh position={[side * 0.025, 2.32, torsoW * 0.405]} rotation={[0.15, 0, side * 0.35]}><cylinderGeometry args={[0.012, 0.012, lapelH * 0.7, 8]} />{panelMat}</mesh>
        </group>
      ))}
      {btnPositions.map((y, i) => {
        const xs = dbl ? [-0.085, 0.085] : [0];
        return xs.map((x, j) => (
          <mesh key={`${i}-${j}`} position={[x, y, torsoW * 0.432]}><cylinderGeometry args={[0.024, 0.024, 0.016, 12]} />{btnMat}</mesh>
        ));
      })}
      <mesh position={[-(torsoW * 0.36), 2.12, torsoW * 0.42]}><boxGeometry args={[0.07, 0.065, 0.012]} />{liningMat}</mesh>
      <mesh position={[-(torsoW * 0.36), 2.165, torsoW * 0.422]} rotation={[0, 0, 0.3]}><boxGeometry args={[0.025, 0.04, 0.01]} />{liningMat}</mesh>
      <mesh position={[-(torsoW * 0.36), 2.09, torsoW * 0.42]}><boxGeometry args={[0.09, 0.014, 0.012]} />{panelMat}</mesh>
      {[-0.20, 0.20].map((x, i) => (
        <mesh key={i} position={[x * torsoW, 1.48, torsoW * 0.42]}><boxGeometry args={[0.19, 0.025, 0.015]} />{panelMat}</mesh>
      ))}
      <mesh position={[0, 2.66, 0]}><cylinderGeometry args={[0.095, 0.11, 0.26, 14]} />{skinMat}</mesh>
      {[-1, 1].map((side, i) => (
        <mesh key={i} position={[side * 0.07, 2.54, 0.10]} rotation={[0.08, 0, side * (-0.35)]}><boxGeometry args={[0.10, 0.10, 0.025]} />{shirtMat}</mesh>
      ))}
      <mesh position={[0, 2.97, 0]}><sphereGeometry args={[0.27, 22, 18]} />{skinMat}</mesh>
      <mesh position={[0, 2.96, 0.265]} rotation={[0.1, 0, 0]}><boxGeometry args={[0.14, 0.18, 0.03]} /><meshStandardMaterial color="#d0ad8a" roughness={0.85} /></mesh>
      <mesh position={[0, 1.94, torsoW * 0.408]} rotation={[0.04, 0, 0]}><boxGeometry args={[0.055, 0.60, 0.012]} /><meshStandardMaterial color="#2a1a0a" roughness={0.7} /></mesh>
      <mesh position={[0, 2.22, torsoW * 0.409]} rotation={[0.04, 0, 0]}><boxGeometry args={[0.042, 0.10, 0.011]} /><meshStandardMaterial color="#2a1a0a" roughness={0.7} /></mesh>
    </group>
  );
}

function SelectionGrid({ label, options, selected, onSelect }: {
  label: string; options: string[]; selected: string; onSelect: (v: string) => void;
}) {
  return (
    <div>
      <h4 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3">{label}</h4>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className={cn(
              "px-3 py-1.5 rounded-lg border text-sm transition-all",
              selected === opt ? "bg-primary text-white border-primary shadow-sm" : "bg-background border-border hover:border-primary text-foreground"
            )}
          >{opt}</button>
        ))}
      </div>
    </div>
  );
}

export default function SuitBuilder() {
  const { toast } = useToast();
  const [fabric, setFabric] = useState(FABRICS[1]);
  const [colorOverride, setColorOverride] = useState<string | null>(null);
  const [customHex, setCustomHex] = useState("#1e2e5a");
  const [selectedColor, setSelectedColor] = useState(FABRIC_COLORS[0]);
  const [lapel, setLapel]       = useState(LAPELS[0]);
  const [buttons, setButtons]   = useState(BUTTONS[1]);
  const [pockets, setPockets]   = useState(POCKETS[0]);
  const [cut, setCut]           = useState(CUTS[0]);
  const [vent, setVent]         = useState(VENTS[1]);
  const [trouser, setTrouser]   = useState(TROUSERS[0]);
  const [lining, setLining]     = useState(LININGS[0]);
  const [monogram, setMonogram] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [viewId, setViewId]     = useState("auto");
  const [useCustom, setUseCustom] = useState(false);

  const activeFabricColor = useCustom ? customHex : (colorOverride ?? selectedColor.hex);

  const config = { fabricColor: activeFabricColor, lapel, buttons, cut, liningColor: lining.color };

  const mutation = useMutation({
    mutationFn: async () => {
      const colorLabel = useCustom ? `Custom (${customHex})` : selectedColor.name;
      return insertOrder({
        customer_name: customerName || "Online Design",
        product_type: "Bespoke Suit",
        fabric_name: fabric.name,
        color: activeFabricColor,
        lapel_style: lapel,
        button_style: buttons,
        pocket_style: pockets,
        lining_color: lining.name,
        monogram: monogram || null,
        design_notes: `Fabric: ${fabric.name} (${fabric.material}) | Colour: ${colorLabel} | Cut: ${cut} | Lapel: ${lapel} | Buttons: ${buttons} | Pockets: ${pockets} | Vent: ${vent} | Trouser: ${trouser} | Lining: ${lining.name}`,
      });
    },
    onSuccess: (result) => {
      toast({ title: "Design Saved!", description: "Your bespoke suit design has been saved. We'll be in touch to begin your journey." });
      fetch("/api/send-order-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerName || "Online Design",
          productType: "Bespoke Suit",
          fabricName: fabric.name,
          color: useCustom ? `Custom (${customHex})` : selectedColor.name,
          lapelStyle: lapel,
          buttonStyle: buttons,
          pocketStyle: pockets,
          liningColor: lining.name,
          monogram: monogram || null,
          designNotes: result?.design_notes,
        }),
      }).catch((err) => console.warn("Order email failed (non-blocking):", err));
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save your design. Please try again.", variant: "destructive" });
    },
  });

  const handleSave = () => {
    if (!customerName) {
      toast({ title: "Almost there", description: "Please enter your name to save your design.", variant: "destructive" });
      return;
    }
    mutation.mutate();
  };

  const webgl = hasWebGL();

  return (
    <div className="w-full">
      <section className="relative h-48 bg-primary flex items-center justify-center">
        <div className="relative z-10 text-center">
          <h1 className="font-display text-2xl sm:text-4xl md:text-5xl text-white font-bold">Interactive Suit Builder</h1>
          <p className="text-white/80 mt-2">Design your perfect bespoke suit in real-time</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">

          {/* 3D Preview Panel */}
          <div className="lg:sticky lg:top-24 space-y-4">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {VIEWS.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setViewId(v.id)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg border text-xs font-semibold uppercase tracking-widest transition-all",
                    viewId === v.id ? "bg-primary text-white border-primary shadow-md" : "bg-background border-border hover:border-accent text-foreground"
                  )}
                >{v.label}</button>
              ))}
            </div>

            <div className="aspect-[3/4] bg-gradient-to-b from-secondary/60 via-background to-muted rounded-2xl overflow-hidden border border-border shadow-2xl">
              {webgl ? (
                <Canvas camera={{ position: [0, 1.2, 5.8], fov: 40 }}>
                  <Suspense fallback={null}>
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[3, 8, 4]} intensity={1.4} castShadow />
                    <directionalLight position={[-4, 4, -4]} intensity={0.35} />
                    <pointLight position={[0, 6, 2]} intensity={0.55} color="#c9a85c" />
                    <pointLight position={[0, 2, -3]} intensity={0.2} color="#aac0ff" />
                    <MannequinFigure config={config} viewId={viewId} />
                    <OrbitControls enablePan={false} minDistance={3.2} maxDistance={9} target={[0, 0.8, 0]} />
                    <Environment preset="apartment" />
                  </Suspense>
                </Canvas>
              ) : (
                <div className="w-full h-full flex items-center justify-center flex-col gap-6 p-8">
                  <div className="w-28 h-44 rounded-xl shadow-xl border-2 border-accent/30" style={{ backgroundColor: activeFabricColor }} />
                  <div className="w-16 h-4 rounded-lg" style={{ backgroundColor: lining.color }} />
                  <p className="text-sm text-muted-foreground">3D preview requires WebGL support</p>
                </div>
              )}
            </div>

            <p className="text-center text-xs text-muted-foreground">Use view buttons above · Drag to orbit · Scroll to zoom</p>

            <div className="bg-card rounded-xl border border-border p-5">
              <h4 className="font-display text-lg text-primary mb-3">Your Current Design</h4>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
                {[
                  ["Fabric",  fabric.name],
                  ["Grade",   fabric.grade],
                  ["Colour",  useCustom ? `Custom (${customHex})` : selectedColor.name],
                  ["Cut",     cut],
                  ["Lapel",   lapel],
                  ["Buttons", buttons],
                  ["Pockets", pockets],
                  ["Vent",    vent],
                  ["Trouser", trouser],
                  ["Lining",  lining.name],
                  ...(monogram ? [["Monogram", monogram]] : []),
                ].map(([k, v]) => (
                  <div key={k} className="contents">
                    <span className="text-muted-foreground">{k}:</span>
                    <span className="font-medium text-foreground">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customisation Panel */}
          <div className="space-y-6">
            {/* Fabric Type */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-display text-xl text-primary mb-1">Fabric Type</h3>
              <p className="text-xs text-muted-foreground mb-4">Choose your fabric grade — the figure updates instantly</p>
              <div className="space-y-2">
                {FABRICS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => { setFabric(f); if (!useCustom) { setColorOverride(f.color); } }}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg border text-sm transition-all text-left",
                      fabric.id === f.id ? "border-accent bg-accent/10 ring-1 ring-accent/30" : "border-border hover:border-accent/40 bg-background"
                    )}
                  >
                    <div className="w-7 h-7 rounded-md flex-shrink-0 border border-border/50" style={{ backgroundColor: f.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{f.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{f.material}</p>
                    </div>
                    <span className={cn(
                      "text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0",
                      f.grade === "Ultra Premium" ? "bg-amber-100 text-amber-800" :
                      f.grade === "Luxury"        ? "bg-purple-100 text-purple-800" :
                      f.grade === "Premium"       ? "bg-green-100 text-green-800" :
                      f.grade === "Black Tie"     ? "bg-gray-900 text-white" :
                      "bg-muted text-muted-foreground"
                    )}>{f.grade}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Colour */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-display text-xl text-primary mb-1">Colour</h3>
              <p className="text-xs text-muted-foreground mb-4">Pick a colour — or dial in your own custom shade</p>
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 mb-4">
                {FABRIC_COLORS.map((fc) => (
                  <button
                    key={fc.id}
                    onClick={() => { setSelectedColor(fc); setColorOverride(fc.hex); setUseCustom(false); }}
                    className={cn(
                      "aspect-square rounded-xl border-2 transition-all shadow-sm hover:scale-110",
                      !useCustom && selectedColor.id === fc.id ? "border-accent ring-2 ring-accent/40 scale-110" : "border-transparent hover:border-accent/40"
                    )}
                    style={{ backgroundColor: fc.hex }}
                    title={fc.name}
                  />
                ))}
              </div>
              {!useCustom && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg mb-4">
                  <div className="w-7 h-7 rounded-lg border border-border flex-shrink-0" style={{ backgroundColor: selectedColor.hex }} />
                  <p className="text-sm font-semibold text-foreground">{selectedColor.name}</p>
                </div>
              )}
              <div className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">Custom Colour</p>
                  <button
                    onClick={() => setUseCustom((p) => !p)}
                    className={cn("text-xs px-3 py-1 rounded-full border font-semibold transition-all", useCustom ? "bg-primary text-white border-primary" : "bg-background border-border hover:border-primary")}
                  >{useCustom ? "Custom active" : "Use custom"}</button>
                </div>
                <div className="flex items-center gap-3">
                  <input type="color" value={customHex} onChange={(e) => { setCustomHex(e.target.value); setUseCustom(true); }} className="w-12 h-10 rounded-lg border border-border cursor-pointer bg-background p-0.5" />
                  <input
                    type="text"
                    value={customHex}
                    onChange={(e) => { const v = e.target.value; setCustomHex(v); if (/^#[0-9a-fA-F]{6}$/.test(v)) setUseCustom(true); }}
                    placeholder="#1e2e5a"
                    className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  {useCustom && <div className="w-9 h-9 rounded-lg border border-border flex-shrink-0" style={{ backgroundColor: customHex }} />}
                </div>
                <p className="text-xs text-muted-foreground">Drag the colour picker or type any hex code to preview on the figure.</p>
              </div>
            </div>

            {/* Cut & Style */}
            <div className="bg-card rounded-xl border border-border p-6 space-y-5">
              <h3 className="font-display text-xl text-primary">Suit Style & Cut</h3>
              <SelectionGrid label="Suit Cut"             options={CUTS}    selected={cut}     onSelect={setCut} />
              <SelectionGrid label="Lapel Style"          options={LAPELS}  selected={lapel}   onSelect={setLapel} />
              <SelectionGrid label="Button Configuration" options={BUTTONS} selected={buttons} onSelect={setButtons} />
            </div>

            {/* Jacket Details */}
            <div className="bg-card rounded-xl border border-border p-6 space-y-5">
              <h3 className="font-display text-xl text-primary">Jacket Details</h3>
              <SelectionGrid label="Pocket Style" options={POCKETS} selected={pockets} onSelect={setPockets} />
              <SelectionGrid label="Vent Style"   options={VENTS}   selected={vent}    onSelect={setVent} />
            </div>

            {/* Trousers */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-display text-xl text-primary mb-5">Trouser Style</h3>
              <SelectionGrid label="Pleat Style" options={TROUSERS} selected={trouser} onSelect={setTrouser} />
            </div>

            {/* Lining */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-display text-xl text-primary mb-4">Lining Colour</h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {LININGS.map((l) => (
                  <button
                    key={l.name}
                    onClick={() => setLining(l)}
                    className={cn("aspect-square rounded-xl border-2 transition-all shadow-sm hover:scale-110", lining.name === l.name ? "border-accent ring-2 ring-accent/40 scale-110" : "border-transparent hover:border-accent/40")}
                    style={{ backgroundColor: l.color }}
                    title={l.name}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-3">Selected: <span className="font-medium text-foreground">{lining.name}</span></p>
            </div>

            {/* Monogram */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-display text-xl text-primary mb-2">Monogram</h3>
              <p className="text-xs text-muted-foreground mb-4">Embroidered on the inner lining — up to 4 characters</p>
              <input
                value={monogram}
                onChange={(e) => setMonogram(e.target.value.toUpperCase().slice(0, 4))}
                placeholder="e.g. JS"
                maxLength={4}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background font-display text-2xl tracking-[0.3em] text-center focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Save Design */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-display text-xl text-primary mb-1">Save Your Design</h3>
              <p className="text-sm text-muted-foreground mb-4">Enter your name and we'll hold your design for your consultation</p>
              <label className="text-sm font-medium text-foreground block mb-1.5">Your Name *</label>
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="John Smith"
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring mb-4"
              />
              <Button className="w-full uppercase tracking-wider" onClick={handleSave} disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : "Save Design & Request a Fitting"}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
