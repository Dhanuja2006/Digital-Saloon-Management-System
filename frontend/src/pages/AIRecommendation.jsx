import React, { useRef, useEffect, useState } from 'react';
import { Sparkles, Camera, User, Palette, Info, Check, ChevronRight, RefreshCw, Star, ArrowRight } from 'lucide-react';

const FACE_SHAPE_RECOMMENDATIONS = {
  Oval: {
    traits: 'The ideal face shape. Balanced proportions where the height is greater than the width. Soft jawline and slightly wider forehead.',
    styles: ['Classic Pompadour', 'Side Swept Long Hair', 'Blunt Bob', 'Long Waves'],
    tips: 'Almost any hairstyle works for you. Avoid heavy fringes that might hide your balanced features. Go for volume on top if you want to emphasize your cheekbones.',
    celeb: 'Beyoncé, Ryan Gosling'
  },
  Round: {
    traits: 'Width and length are almost equal, with soft, rounded features and a circular jawline. Cheekbones are the widest part.',
    styles: ['High Volume Top', 'Asymmetric Bob', 'Side-Parted Undercut', 'Pixie with Volume'],
    tips: 'Aim for styles that add height and length to the face. Angular cuts help create definition where nature didn\'t. Avoid chin-length bobs.',
    celeb: 'Selena Gomez, Leonardo DiCaprio'
  },
  Square: {
    traits: 'Broad forehead and a strong, sharp, angular jawline. The width of forehead, cheekbones, and jaw are nearly the same.',
    styles: ['Textured Layers', 'Side-Swept Bangs', 'Buzz Cut', 'Soft Curls'],
    tips: 'Choose styles that soften the jawline. Side parts and wispy layers work best. Avoid blunt, straight-across cuts that emphasize the squareness.',
    celeb: 'Angelina Jolie, Brad Pitt'
  },
  Heart: {
    traits: 'Wide forehead and high cheekbones with a narrow, pointy chin. Similar to an inverted triangle.',
    styles: ['Long Side Swept Hair', 'Lob with Fringe', 'Chin-Length Bob', 'Textured Quiff'],
    tips: 'Add volume to the lower half of your face (near the jawline) to balance the wide forehead. Shoulder-length hair is your best friend.',
    celeb: 'Reese Witherspoon, Ryan Reynolds'
  },
  Diamond: {
    traits: 'Narrow forehead and jawline with wide, high cheekbones. This is a rare and striking face shape.',
    styles: ['Slicked Back', 'Messy Fringe', 'Long Layers', 'Side-Swept Pixie'],
    tips: 'Try to widen the appearance of your forehead and jawline with layers. Tucking hair behind your ears can show off your killer cheekbones.',
    celeb: 'Scarlett Johansson, Robert Pattinson'
  }
};

const AIRecommendation = () => {
  const videoRef = useRef(null);
  const cameraInstance = useRef(null);
  
  const [faceShape, setFaceShape] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [result, setResult] = useState(null);
  const [hairType, setHairType] = useState('Straight');
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const checkAndInit = () => {
      if (window.FaceMesh && window.Camera) {
        if (isMounted) {
          setInitializing(false);
          startPreview();
        }
      } else {
        setTimeout(checkAndInit, 1000);
      }
    };

    const startPreview = () => {
      if (videoRef.current && window.Camera) {
        cameraInstance.current = new window.Camera(videoRef.current, {
          onFrame: async () => {},
          width: 640,
          height: 480,
        });
        cameraInstance.current.start().catch(() => {
          if (isMounted) setError("Camera access denied.");
        });
      }
    };

    checkAndInit();

    return () => {
      isMounted = false;
      if (cameraInstance.current) cameraInstance.current.stop();
    };
  }, []);

  const analyzeFace = async () => {
    if (!window.FaceMesh) return;
    
    setAnalyzing(true);
    setResult(null);
    setFaceShape(null);

    try {
      const fm = new window.FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      });

      fm.setOptions({
        maxNumFaces: 1,
        refineLandmarks: false, // CPU OPTIMIZED
        minDetectionConfidence: 0.6,
      });

      fm.onResults((results) => {
        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
          const landmarks = results.multiFaceLandmarks[0];
          const shape = calculateFaceShape(landmarks);
          setFaceShape(shape);
          setResult(FACE_SHAPE_RECOMMENDATIONS[shape]);
          setAnalyzing(false);
          fm.close();
        }
      });

      // Capture one frame and analyze
      await fm.send({ image: videoRef.current });

    } catch (err) {
      setError("Analysis failed. Try again.");
      setAnalyzing(false);
    }
  };

  const calculateFaceShape = (landmarks) => {
    // MediaPipe landmarks: 
    // Forehead (103, 332), Cheekbones (234, 454), Jawline (58, 288), Length (10, 152)
    const foreheadWidth = Math.abs(landmarks[332].x - landmarks[103].x);
    const cheekboneWidth = Math.abs(landmarks[454].x - landmarks[234].x);
    const jawlineWidth = Math.abs(landmarks[288].x - landmarks[58].x);
    const faceLength = Math.abs(landmarks[152].y - landmarks[10].y);
    const ratio = faceLength / cheekboneWidth;

    // Diamond: Cheekbones are significantly wider than forehead and jaw
    if (cheekboneWidth > foreheadWidth * 1.1 && cheekboneWidth > jawlineWidth * 1.1) {
      return 'Diamond';
    }
    
    // Heart: Forehead is wider than jawline
    if (foreheadWidth > jawlineWidth * 1.1) {
      return 'Heart';
    }

    // Square: Jawline is broad, ratio is short
    if (jawlineWidth > foreheadWidth * 0.9 && ratio < 1.3) {
      return 'Square';
    }

    // Round: Ratio is very short, features are soft (not square)
    if (ratio < 1.25) {
      return 'Round';
    }

    // Oval: Height is about 1.5 times width
    if (ratio > 1.35 && ratio < 1.65) {
      return 'Oval';
    }

    // Default to Oval if it's a balanced shape, but fallback to something else if very long
    return ratio > 1.65 ? 'Oval' : 'Oval'; 
  };

  return (
    <div className="main-content" style={{ background: '#050505', minHeight: '100vh', padding: '4rem 0' }}>
      <div className="container">
        <div className="text-center mb-12">
          <h1 style={{ fontSize: '3.5rem' }}>AI Style <span className="text-primary">Match</span></h1>
          <p className="text-secondary">Personalized recommendations optimized for your CPU.</p>
        </div>

        <div className="grid-2 gap-12" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="flex flex-col gap-6">
            <div className="glass-card" style={{ padding: '0.5rem', background: '#111', position: 'relative' }}>
              <video ref={videoRef} autoPlay playsInline muted className="w-full rounded-lg" style={{ aspectRatio: '16/9', objectFit: 'cover', transform: 'scaleX(-1)' }} />
              
              {initializing && !error && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-lg">
                  <RefreshCw className="animate-spin text-primary mb-4" size={32} />
                  <p className="text-sm">Initializing AI...</p>
                </div>
              )}

              {!faceShape && !analyzing && !initializing && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <button onClick={analyzeFace} className="btn btn-primary px-8 py-4 text-lg shadow-2xl">Scan My Face</button>
                </div>
              )}

              {analyzing && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center rounded-lg">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-sm font-bold text-primary animate-pulse tracking-widest">ANALYZING...</p>
                </div>
              )}
            </div>

            <div className="glass-card">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-secondary">Hair Type</h3>
              <div className="grid-2 gap-3">
                {['Straight', 'Wavy', 'Curly', 'Coily'].map(type => (
                  <button key={type} onClick={() => setHairType(type)} className={`p-3 rounded-lg border text-sm transition-all ${hairType === type ? 'border-primary bg-primary/10' : 'border-white/5 bg-white/5'}`}>{type}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {result ? (
              <div className="glass-card animate-in slide-in-from-right duration-500" style={{ borderLeft: '4px solid var(--primary)' }}>
                <h2 className="mb-2">{faceShape} Face</h2>
                <p className="text-sm text-secondary mb-6">{result.traits}</p>
                
                <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Top Recommendations</h4>
                <div className="grid-2 gap-2 mb-6">
                  {result.styles.map(s => <div key={s} className="bg-white/5 p-3 rounded border border-white/10 text-xs font-medium">{s}</div>)}
                </div>

                <div className="p-4 bg-primary/5 rounded border border-primary/20 italic text-sm text-secondary">"{result.tips}"</div>
                
                <button onClick={() => {setResult(null); setFaceShape(null);}} className="btn btn-secondary btn-full mt-8">Reset</button>
              </div>
            ) : (
              <div className="glass-card h-full flex flex-col items-center justify-center text-center p-12 border-dashed border-2 border-white/10">
                <Sparkles size={48} className="text-white/10 mb-4" />
                <p className="text-white/30 text-sm">Scan your face to see signature styles recommended for your structure.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendation;
