'use client';

import React, { useState, useEffect } from 'react';
import MaskEditor from '@/components/admin/MaskEditor';

type StyleKey = 'clean' | 'festive' | 'bridal';
type PoseKey = 'front' | 'three_quarter' | 'close_up' | 'back' | 'lifestyle';

const POSE_PRESETS: Record<PoseKey, string> = {
  front: 'standing gracefully facing the camera, hands relaxed at sides, showcasing the full front design of the garment.',
  three_quarter: 'standing at a three-quarter angle, showing an elegant side profile and detailed sleeve drape.',
  close_up: 'focusing closely on the fine hand-embroidery, mirror work, and neckline details of the garment, capturing textures in rich detail.',
  back: 'standing with her back to the camera, looking slightly over her shoulder, hair swept up to highlight the intricate back neckline design and tasselled details of the blouse.',
  lifestyle: 'adjusting a traditional piece of jewelry or holding a pooja thali, displaying a warm welcoming posture in a festive home setting.',
};

type PhotoItem = string;

type GenerationResult = {
  url: string;
  prompt: string;
  seed: number | null;
};

export default function CatalogAutomationPage() {
  // Config & API Keys
  const [apiKey, setApiKey] = useState(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
  const [vertexAi, setVertexAi] = useState(false);
  const [project, setProject] = useState('');
  const [location, setLocation] = useState('us-central1');
  const [model, setModel] = useState('imagen-3.0-capability-001');
  const [mockMode, setMockMode] = useState(false); // Default to real generation mode now that billing/credits are active
  const [activePose, setActivePose] = useState<PoseKey>('front');
  
  // Library State
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [photoSearch, setPhotoSearch] = useState('');
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(true);

  // Masking State
  const [fgUrl, setFgUrl] = useState<string | null>(null);
  const [maskUrl, setMaskUrl] = useState<string | null>(null);
  const [editedMaskUrl, setEditedMaskUrl] = useState<string | null>(null);
  const [isMaskLoading, setIsMaskLoading] = useState(false);
  const [maskError, setMaskError] = useState<string | null>(null);

  // Prompt / Style State
  const [activeStyle, setActiveStyle] = useState<StyleKey>('clean');
  const [customDetails, setCustomDetails] = useState('');
  const [customModelDescription, setCustomModelDescription] = useState(
    'A 25-year-old South Asian female fashion model with sharp cheekbones, olive skin, traditional styling, dark brown hair pulled back into a sleek, clean bun. Neutral, elegant facial expression.'
  );
  const [seed, setSeed] = useState<string>('42'); // Fixed seed default to lock faces
  const [batchCount, setBatchCount] = useState<number>(3); // Standard batch size

  // Generation Workflow
  const [generations, setGenerations] = useState<GenerationResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [genError, setGenError] = useState<string | null>(null);

  // Save State
  const [saveTitle, setSaveTitle] = useState('');
  const [saveCategory, setSaveCategory] = useState('Blouses');
  const [saveDescription, setSaveDescription] = useState('');
  const [saveTags, setSaveTags] = useState('bridal, handmade, embroidery');
  const [saveOccasions, setSaveOccasions] = useState('Wedding, Festivals');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Active step navigation: 'select' | 'mask' | 'generate'
  const [activeStep, setActiveStep] = useState<'select' | 'mask' | 'generate'>('select');

  // Load photos from raw library
  useEffect(() => {
    async function loadPhotos() {
      try {
        setIsLoadingPhotos(true);
        const res = await fetch('/api/admin/photos');
        const data = await res.json();
        if (data.photos) {
          setPhotos(data.photos);
        }
      } catch (err) {
        console.error('Failed to load photos:', err);
      } finally {
        setIsLoadingPhotos(false);
      }
    }
    loadPhotos();
  }, []);

  // Update predefined prompts based on selected style and pose focus
  const getFullPrompt = (styleKey: StyleKey, poseKey: PoseKey) => {
    const garmentClause = 'The model is wearing the provided garment cleanly.';
    const poseDescription = POSE_PRESETS[poseKey];
    const customDetailsClause = customDetails ? ` ${customDetails.trim()}` : '';
    
    let styleDescription = '';
    if (styleKey === 'clean') {
      styleDescription = 'High-end editorial studio background with grey neutral tones, soft professional octobox lighting, highly detailed, photorealistic 4k resolution.';
    } else if (styleKey === 'festive') {
      styleDescription = 'Soft warm tones, subtle traditional Indian decor elements in the blurred background, festive lights, highly detailed, photorealistic 4k resolution.';
    } else if (styleKey === 'bridal') {
      styleDescription = 'Soft morning light, aesthetic indoor bridal preparation setting, traditional gold mirrors, warm ambient glow, highly detailed, photorealistic 4k resolution.';
    }
    
    return `${customModelDescription.trim()} ${garmentClause} The model is ${poseDescription}${customDetailsClause} ${styleDescription}`;
  };

  // Generate background removal mask
  const generateMask = async () => {
    if (!selectedPhoto) return;
    try {
      setIsMaskLoading(true);
      setMaskError(null);
      setFgUrl(null);
      setMaskUrl(null);
      setEditedMaskUrl(null);

      const res = await fetch('/api/admin/mask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: selectedPhoto }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setFgUrl(data.fgUrl);
        setMaskUrl(data.maskUrl);
        setEditedMaskUrl(data.maskUrl); // Set initial mask
        setActiveStep('mask');
      } else {
        setMaskError(data.error || 'Failed to generate mask.');
      }
    } catch (err: any) {
      setMaskError(err.message || 'An error occurred during masking.');
    } finally {
      setIsMaskLoading(false);
    }
  };

  // Run the generator (batch processing)
  const generateImages = async () => {
    if (!selectedPhoto || !editedMaskUrl) return;
    
    setIsGenerating(true);
    setGenError(null);
    setGenerations([]);
    setGenProgress(0);
    setActiveStep('generate');

    const promptText = getFullPrompt(activeStyle, activePose);
    const results: GenerationResult[] = [];
    
    // Convert seed state to number
    const numericSeed = seed ? parseInt(seed) : Math.floor(Math.random() * 100000);

    for (let i = 0; i < batchCount; i++) {
      // Calculate individual seed. If fixed, we add i. If random, each gets random.
      const currentSeed = seed ? numericSeed + i : Math.floor(Math.random() * 100000);
      
      try {
        setGenProgress(Math.round(((i) / batchCount) * 100));
        
        const res = await fetch('/api/admin/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: selectedPhoto,
            maskDataUrl: editedMaskUrl,
            prompt: promptText,
            style: activeStyle,
            seed: currentSeed,
            apiKey: apiKey,
            vertexAi: vertexAi,
            project: project,
            location: location,
            model: model,
            mock: mockMode,
          }),
        });

        const data = await res.json();
        
        if (res.ok && data.success) {
          results.push({
            url: data.imageUrl,
            prompt: promptText,
            seed: currentSeed,
          });
          setGenerations([...results]);
        } else {
          setGenError(data.error || `Failed on image ${i + 1}`);
          break;
        }
      } catch (err: any) {
        setGenError(err.message || `Error on image ${i + 1}`);
        break;
      }
    }
    
    setGenProgress(100);
    setIsGenerating(false);
  };

  // Save generated item to Catalog Gallery
  const saveToCatalog = async () => {
    if (generations.length === 0) return;
    
    // Generate clean ID slug
    const cleanId = saveTitle
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    setIsSaving(true);
    setSaveSuccessMessage(null);

    const mainImg = generations[0].url;
    const alternateImgs = generations.slice(1).map(g => g.url);

    try {
      const res = await fetch('/api/admin/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: cleanId,
          title: saveTitle,
          category: saveCategory,
          description: saveDescription,
          tags: saveTags.split(',').map(t => t.trim()).filter(Boolean),
          occasions: saveOccasions.split(',').map(o => o.trim()).filter(Boolean),
          mainImage: mainImg,
          alternateImages: alternateImgs,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSaveSuccessMessage(`Successfully saved "${saveTitle}" to the website catalog with ${alternateImgs.length} alternate views!`);
      } else {
        alert(data.error || 'Failed to save to catalog.');
      }
    } catch (err: any) {
      alert(err.message || 'Error saving to catalog.');
    } finally {
      setIsSaving(false);
    }
  };

  // Filtered list of raw library photos
  const filteredPhotos = photos.filter(photo =>
    photo.toLowerCase().includes(photoSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-ivory text-ink font-body p-6 md:p-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Luxury Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gold/30 pb-6 gap-4">
          <div>
            <h1 className="font-display text-4xl text-maroon font-light tracking-wide uppercase">
              Sonal Studio
            </h1>
            <p className="font-editorial text-lg text-gold italic mt-1">
              AI Fashion Catalog Automation Dashboard
            </p>
          </div>
          
          {/* Mock Mode Alert */}
          <div className="flex items-center gap-3 bg-cream px-4 py-2 rounded-tag border border-gold/25 shadow-soft">
            <span className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              {mockMode ? 'Mock Generation Mode Active' : 'Real Vertex/Gemini Active'}
            </span>
            <button
              onClick={() => setMockMode(!mockMode)}
              className="text-[10px] bg-maroon text-ivory px-2 py-0.5 rounded-tag hover:bg-wine cursor-pointer transition-colors"
            >
              Toggle Mode
            </button>
          </div>
        </div>

        {/* Workspace Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Settings & Image Browser */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            {/* API Config Panel */}
            <details className="bg-cream border border-gold/20 rounded-card p-4 shadow-soft">
              <summary className="font-display text-sm text-maroon font-semibold cursor-pointer list-none flex items-center justify-between">
                <span>✦ Configuration & Keys</span>
                <span className="text-[10px] text-gold">▼</span>
              </summary>
              
              <div className="flex flex-col gap-3 mt-4 text-xs">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-muted">Gemini API Key</label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter AI Studio Key (AQ...)"
                    className="w-full bg-ivory border border-gold/30 rounded-tag p-2 focus:border-gold outline-none"
                  />
                </div>
                
                <div className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    id="vertex-toggle"
                    checked={vertexAi}
                    onChange={(e) => setVertexAi(e.target.checked)}
                    className="accent-gold"
                  />
                  <label htmlFor="vertex-toggle" className="font-semibold text-muted cursor-pointer">
                    Enable GCP Vertex AI Mode
                  </label>
                </div>

                {vertexAi && (
                  <>
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-muted">GCP Project ID</label>
                      <input
                        type="text"
                        value={project}
                        onChange={(e) => setProject(e.target.value)}
                        placeholder="your-project-id"
                        className="w-full bg-ivory border border-gold/30 rounded-tag p-2 focus:border-gold outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-muted">GCP Location</label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="us-central1"
                        className="w-full bg-ivory border border-gold/30 rounded-tag p-2 focus:border-gold outline-none"
                      />
                    </div>
                  </>
                )}

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-muted">Target Model</label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="imagen-3.0-generate-002"
                    className="w-full bg-ivory border border-gold/30 rounded-tag p-2 focus:border-gold outline-none"
                  />
                </div>
              </div>
            </details>

            {/* Image Library Browser */}
            <div className="bg-cream border border-gold/20 rounded-card p-4 shadow-soft flex flex-col gap-4 max-h-[500px]">
              <h3 className="font-display text-sm text-maroon font-semibold">
                ✦ Raw Photo Library
              </h3>
              
              <input
                type="text"
                placeholder="Search images..."
                value={photoSearch}
                onChange={(e) => setPhotoSearch(e.target.value)}
                className="w-full bg-ivory border border-gold/30 rounded-tag p-2 text-xs focus:border-gold outline-none"
              />

              {isLoadingPhotos ? (
                <div className="flex justify-center py-8">
                  <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="overflow-y-auto flex flex-col gap-2 pr-1 max-h-[380px] scrollbar-thin">
                  {filteredPhotos.map((photo) => (
                    <button
                      key={photo}
                      onClick={() => {
                        setSelectedPhoto(photo);
                        setFgUrl(null);
                        setMaskUrl(null);
                        setActiveStep('select');
                      }}
                      className={`text-left text-xs p-2.5 rounded-tag border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                        selectedPhoto === photo
                          ? 'bg-maroon text-ivory border-maroon'
                          : 'bg-ivory text-ink border-gold/10 hover:border-gold/50'
                      }`}
                    >
                      <span className="truncate max-w-[160px]">{photo}</span>
                      <span className="text-[10px] text-gold">
                        {photo.toLowerCase().endsWith('.heic') ? 'HEIC' : 'IMG'}
                      </span>
                    </button>
                  ))}
                  {filteredPhotos.length === 0 && (
                    <p className="text-xs text-muted text-center py-4 italic">No matches found</p>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Main Workspace Area */}
          <div className="lg:col-span-3 flex flex-col gap-8">
            
            {/* Selected Image & Mask Preview Workspace */}
            {selectedPhoto ? (
              <div className="flex flex-col gap-6">
                
                {/* Steps Navigator */}
                <div className="flex items-center gap-2 border-b border-gold/15 pb-2 text-xs">
                  <button
                    onClick={() => setActiveStep('select')}
                    className={`pb-2 px-3 font-semibold transition-all duration-300 border-b-2 cursor-pointer ${
                      activeStep === 'select'
                        ? 'border-maroon text-maroon'
                        : 'border-transparent text-muted hover:text-ink'
                    }`}
                  >
                    1. Select Garment
                  </button>
                  <span className="text-gold">✦</span>
                  <button
                    disabled={!maskUrl}
                    onClick={() => setActiveStep('mask')}
                    className={`pb-2 px-3 font-semibold transition-all duration-300 border-b-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                      activeStep === 'mask'
                        ? 'border-maroon text-maroon'
                        : 'border-transparent text-muted hover:text-ink'
                    }`}
                  >
                    2. Edit Mask
                  </button>
                  <span className="text-gold">✦</span>
                  <button
                    disabled={!editedMaskUrl}
                    onClick={() => setActiveStep('generate')}
                    className={`pb-2 px-3 font-semibold transition-all duration-300 border-b-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                      activeStep === 'generate'
                        ? 'border-maroon text-maroon'
                        : 'border-transparent text-muted hover:text-ink'
                    }`}
                  >
                    3. Generate & Save
                  </button>
                </div>

                {/* Step Content: Select / Generate Mask */}
                {activeStep === 'select' && (
                  <div className="bg-cream border border-gold/20 rounded-card p-6 shadow-soft flex flex-col md:flex-row gap-8 items-center">
                    <div className="w-full md:w-1/2 aspect-square max-h-[360px] bg-ivory rounded-tag overflow-hidden border border-gold/30 relative flex items-center justify-center">
                      <img
                        src={`/api/admin/photos?name=${encodeURIComponent(selectedPhoto)}`}
                        alt={selectedPhoto}
                        className="object-contain max-h-full max-w-full"
                      />
                    </div>
                    
                    <div className="w-full md:w-1/2 flex flex-col gap-5">
                      <div className="border-b border-gold/10 pb-3">
                        <h2 className="font-display text-2xl text-maroon leading-tight">
                          {selectedPhoto}
                        </h2>
                        <p className="font-editorial text-sm text-gold italic">
                          Selected Raw Garment Photo
                        </p>
                      </div>

                      <p className="text-sm text-muted leading-relaxed">
                        To place this garment onto a photorealistic model, we must first run background removal to segment the clothing. Click "Generate Mask" below to start.
                      </p>

                      <button
                        onClick={generateMask}
                        disabled={isMaskLoading}
                        className="bg-maroon hover:bg-wine text-ivory font-display text-sm tracking-widest uppercase py-3.5 px-6 rounded-btn border border-maroon hover:border-wine transition-all duration-300 shadow-md disabled:bg-muted disabled:border-muted disabled:cursor-not-allowed flex items-center justify-center gap-3 cursor-pointer"
                      >
                        {isMaskLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-ivory border-t-transparent rounded-full animate-spin"></div>
                            Removing Background...
                          </>
                        ) : (
                          '✦ Generate Mask'
                        )}
                      </button>
                      
                      {maskError && (
                        <div className="bg-maroon/5 border border-maroon/20 rounded-tag p-3 text-xs text-maroon">
                          <strong>Error:</strong> {maskError}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step Content: Edit Mask (Canvas Editor) */}
                {activeStep === 'mask' && fgUrl && maskUrl && (
                  <div className="flex flex-col gap-4">
                    <MaskEditor
                      imageUrl={fgUrl}
                      maskUrl={maskUrl}
                      onSaveMask={(dataUrl) => setEditedMaskUrl(dataUrl)}
                    />
                    
                    <div className="flex justify-end gap-3 mt-2">
                      <button
                        onClick={() => setActiveStep('select')}
                        className="bg-ivory border border-gold/30 hover:border-gold text-ink text-xs px-5 py-2.5 rounded-pill transition-all duration-300 cursor-pointer"
                      >
                        ◀ Back
                      </button>
                      <button
                        onClick={() => setActiveStep('generate')}
                        className="bg-maroon hover:bg-wine border border-maroon text-ivory text-xs px-6 py-2.5 rounded-pill transition-all duration-300 shadow-md cursor-pointer"
                      >
                        Configure Prompt Matrix ▶
                      </button>
                    </div>
                  </div>
                )}

                {/* Step Content: Configure Prompt & Generate */}
                {activeStep === 'generate' && (
                  <div className="flex flex-col gap-8">
                    
                    {/* Prompt Matrix Selector */}
                    <div className="bg-cream border border-gold/20 rounded-card p-6 shadow-soft flex flex-col gap-6">
                      <h3 className="font-display text-lg text-maroon font-semibold border-b border-gold/10 pb-3">
                        ✦ Prompt & Style Configuration
                      </h3>

                      {/* Style Presets */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-muted">1. Style Presets (Prompt Matrix)</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {[
                            { key: 'clean', label: 'Clean Studio E-commerce', desc: 'Grey background, octobox studio lighting.' },
                            { key: 'festive', label: 'Festive Editorial', desc: 'Warm tones, blurred traditional Indian decor.' },
                            { key: 'bridal', label: 'Bridal Preparation', desc: 'Soft morning light, gold mirrors, warm glow.' },
                          ].map((st) => (
                            <button
                              key={st.key}
                              onClick={() => setActiveStyle(st.key as StyleKey)}
                              className={`p-4 rounded-card border text-left transition-all duration-300 flex flex-col gap-1.5 cursor-pointer ${
                                activeStyle === st.key
                                  ? 'bg-maroon text-ivory border-maroon shadow-md'
                                  : 'bg-ivory text-ink border-gold/15 hover:border-gold/55'
                              }`}
                            >
                              <span className="font-display text-sm font-semibold">{st.label}</span>
                              <span className={`text-[10px] leading-relaxed ${
                                activeStyle === st.key ? 'text-ivory/80' : 'text-muted'
                              }`}>
                                {st.desc}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Pose & Framing presets */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-muted">2. Pose & Framing Focus (Vary poses & keep face consistent)</label>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
                          {[
                            { key: 'front', label: '✦ Front View', desc: 'Full standard' },
                            { key: 'three_quarter', label: '✉ 3/4 Angle', desc: 'Sleeve & side drape' },
                            { key: 'close_up', label: '✦ Close-Up', desc: 'Embroidery details' },
                            { key: 'back', label: '✉ Back Design', desc: 'Show neck & details' },
                            { key: 'lifestyle', label: '✦ Lifestyle Pose', desc: 'Warm active posture' },
                          ].map((ps) => (
                            <button
                              key={ps.key}
                              onClick={() => setActivePose(ps.key as PoseKey)}
                              className={`p-3 rounded-card border text-left transition-all duration-300 flex flex-col gap-1 cursor-pointer ${
                                activePose === ps.key
                                  ? 'bg-maroon text-ivory border-maroon shadow-md'
                                  : 'bg-ivory text-ink border-gold/15 hover:border-gold/55'
                              }`}
                            >
                              <span className="font-display text-xs font-semibold">{ps.label}</span>
                              <span className={`text-[9px] leading-relaxed ${
                                activePose === ps.key ? 'text-ivory/80' : 'text-muted'
                              }`}>
                                {ps.desc}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Custom Model Descriptor */}
                      <div className="flex flex-col gap-1.5 text-xs">
                        <label className="font-semibold text-muted">3. Model Persona / Demographic Traits (Locks face characteristics)</label>
                        <textarea
                          rows={3}
                          value={customModelDescription}
                          onChange={(e) => setCustomModelDescription(e.target.value)}
                          className="w-full bg-ivory border border-gold/30 rounded-tag p-3 focus:border-gold outline-none text-ink font-body leading-relaxed"
                          placeholder="Describe the model demographics (e.g. South Asian, olive skin...)"
                        />
                      </div>

                      {/* Custom Scene Details Override */}
                      <div className="flex flex-col gap-1.5 text-xs">
                        <label className="font-semibold text-muted">4. Add Custom Scene Details (Optional)</label>
                        <input
                          type="text"
                          value={customDetails}
                          onChange={(e) => setCustomDetails(e.target.value)}
                          placeholder="e.g., standing gracefully near a golden arch, looking slightly away from the camera"
                          className="w-full bg-ivory border border-gold/30 rounded-tag p-3 focus:border-gold outline-none"
                        />
                      </div>

                      {/* Controls grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gold/10 pt-4 text-xs">
                        
                        <div className="flex flex-col gap-1">
                          <label className="font-semibold text-muted">Lock Face Seed</label>
                          <input
                            type="text"
                            value={seed}
                            onChange={(e) => setSeed(e.target.value)}
                            placeholder="Enter number to keep face consistent"
                            className="w-full bg-ivory border border-gold/30 rounded-tag p-2.5 focus:border-gold outline-none"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="font-semibold text-muted">Number of Photos</label>
                          <select
                            value={batchCount}
                            onChange={(e) => setBatchCount(parseInt(e.target.value))}
                            className="w-full bg-ivory border border-gold/30 rounded-tag p-2.5 focus:border-gold outline-none cursor-pointer"
                          >
                            <option value="1">1 Output (Single style)</option>
                            <option value="3">3 Outputs (Recommended)</option>
                            <option value="5">5 Outputs</option>
                            <option value="8">8 Outputs (Full Catalog Batch)</option>
                          </select>
                        </div>

                        <div className="flex items-end">
                          <button
                            onClick={generateImages}
                            disabled={isGenerating}
                            className="w-full bg-maroon hover:bg-wine text-ivory font-display text-xs tracking-widest uppercase py-3.5 rounded-btn border border-maroon hover:border-wine transition-all duration-300 shadow-md disabled:bg-muted disabled:border-muted disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                          >
                            {isGenerating ? 'Generating...' : '✦ Trigger Generation'}
                          </button>
                        </div>

                      </div>

                      {/* Display compiled Prompt */}
                      <div className="bg-ivory border border-gold/15 rounded-tag p-3 text-[10px] leading-relaxed text-muted">
                        <strong>Compiled prompt to model:</strong> "{getFullPrompt(activeStyle, activePose)}"
                      </div>

                    </div>

                    {/* Progress Indicator */}
                    {isGenerating && (
                      <div className="bg-cream border border-gold/25 rounded-card p-6 shadow-soft flex flex-col gap-3">
                        <div className="flex justify-between text-xs font-semibold text-muted">
                          <span>Generating Catalog Batch...</span>
                          <span>{genProgress}%</span>
                        </div>
                        <div className="w-full bg-gold/15 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-maroon h-full transition-all duration-500 rounded-full"
                            style={{ width: `${genProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-[10px] text-muted italic text-center animate-pulse mt-1">
                          Calling inpainting API using selected seed for model consistency. Please stand by...
                        </p>
                      </div>
                    )}

                    {genError && (
                      <div className="bg-maroon/5 border border-maroon/20 rounded-tag p-4 text-xs text-maroon leading-relaxed">
                        <strong>Generation Error:</strong> {genError}
                        <p className="mt-2 text-[10px] text-muted">
                          Ensure billing or credits are active for real generation, or toggle **Mock Mode** in the header to run mock generations.
                        </p>
                      </div>
                    )}

                    {/* Generated Outputs Grid */}
                    {generations.length > 0 && (
                      <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between border-b border-gold/15 pb-2">
                          <h3 className="font-display text-lg text-maroon font-semibold">
                            ✦ Generated Catalog Images ({generations.length})
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {generations.map((gen, idx) => (
                            <div
                              key={idx}
                              className="bg-cream border border-gold/20 rounded-card overflow-hidden shadow-soft flex flex-col group hover:shadow-luxury transition-all duration-300"
                            >
                              <div className="aspect-square bg-ivory flex items-center justify-center border-b border-gold/15 relative overflow-hidden">
                                <img
                                  src={gen.url}
                                  alt={`Gen ${idx + 1}`}
                                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                />
                                <span className="absolute bottom-2 right-2 bg-cream/90 border border-gold/20 px-2 py-0.5 rounded-pill text-[9px] text-ink font-semibold">
                                  Seed: {gen.seed}
                                </span>
                              </div>
                              <div className="p-3 text-[10px] text-muted flex flex-col gap-2 flex-grow">
                                <p className="line-clamp-2 italic leading-relaxed">"{gen.prompt}"</p>
                                <a
                                  href={gen.url}
                                  download={`sonal_catalog_gen_${idx + 1}.jpg`}
                                  className="mt-auto block text-center bg-ivory border border-gold/30 hover:border-gold text-ink py-1 rounded-tag transition-colors"
                                >
                                  Download Image
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Save to Catalog Gallery Section */}
                        <div className="bg-cream border border-gold/25 rounded-card p-6 shadow-soft flex flex-col gap-6 mt-4">
                          <div className="border-b border-gold/10 pb-3">
                            <h4 className="font-display text-md text-maroon font-semibold">
                              ✦ Save to Website Gallery
                            </h4>
                            <p className="font-body text-xs text-muted mt-0.5">
                              Add the first image as the main catalog image, and the other generated photos as alternate views.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div className="flex flex-col gap-1">
                              <label className="font-semibold text-muted">Product Title</label>
                              <input
                                type="text"
                                value={saveTitle}
                                onChange={(e) => setSaveTitle(e.target.value)}
                                placeholder="e.g. Mirror Work Festive Blouse"
                                className="w-full bg-ivory border border-gold/30 rounded-tag p-2.5 focus:border-gold outline-none"
                              />
                            </div>
                            
                            <div className="flex flex-col gap-1">
                              <label className="font-semibold text-muted">Category</label>
                              <select
                                value={saveCategory}
                                onChange={(e) => setSaveCategory(e.target.value)}
                                className="w-full bg-ivory border border-gold/30 rounded-tag p-2.5 focus:border-gold outline-none cursor-pointer"
                              >
                                <option value="Blouses">Blouses</option>
                                <option value="Lehengas">Lehengas</option>
                                <option value="Gowns">Gowns</option>
                                <option value="Fashion">Fashion (General)</option>
                                <option value="Wedding Essentials">Wedding Essentials</option>
                                <option value="Pooja Thalis">Pooja Thalis</option>
                                <option value="Kalash Decor">Kalash Decor</option>
                                <option value="Festive Decor">Festive Decor</option>
                                <option value="Styling Ideas">Styling Ideas</option>
                              </select>
                            </div>

                            <div className="flex flex-col gap-1 md:col-span-2">
                              <label className="font-semibold text-muted">Description</label>
                              <textarea
                                rows={2}
                                value={saveDescription}
                                onChange={(e) => setSaveDescription(e.target.value)}
                                placeholder="Write a description for your catalog product..."
                                className="w-full bg-ivory border border-gold/30 rounded-tag p-2.5 focus:border-gold outline-none font-body leading-relaxed"
                              />
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="font-semibold text-muted">Occasions (comma-separated)</label>
                              <input
                                type="text"
                                value={saveOccasions}
                                onChange={(e) => setSaveOccasions(e.target.value)}
                                className="w-full bg-ivory border border-gold/30 rounded-tag p-2.5 focus:border-gold outline-none"
                              />
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="font-semibold text-muted">Tags (comma-separated)</label>
                              <input
                                type="text"
                                value={saveTags}
                                onChange={(e) => setSaveTags(e.target.value)}
                                className="w-full bg-ivory border border-gold/30 rounded-tag p-2.5 focus:border-gold outline-none"
                              />
                            </div>
                          </div>

                          <button
                            onClick={saveToCatalog}
                            disabled={isSaving || !saveTitle.trim()}
                            className="bg-maroon hover:bg-wine text-ivory font-display text-sm tracking-widest uppercase py-3.5 px-6 rounded-btn border border-maroon hover:border-wine transition-all duration-300 shadow-md disabled:bg-muted disabled:border-muted disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2"
                          >
                            {isSaving ? 'Saving to Catalog Database...' : '✦ Save to Catalog'}
                          </button>

                          {saveSuccessMessage && (
                            <div className="bg-gold/10 border border-gold/30 rounded-tag p-4 text-xs text-ink leading-relaxed">
                              <strong>Success:</strong> {saveSuccessMessage}
                              <p className="mt-2 text-[10px] text-muted">
                                The file was copied, the code in `src/data/gallery.ts` was updated, and the new item is now live in the Sonal Studio gallery!
                              </p>
                            </div>
                          )}
                        </div>

                      </div>
                    )}

                  </div>
                )}

              </div>
            ) : (
              // Empty State Workspace
              <div className="bg-cream border border-gold/20 rounded-card p-12 shadow-soft flex flex-col items-center justify-center text-center gap-4 min-h-[400px]">
                <div className="w-16 h-16 rounded-full border border-gold/30 flex items-center justify-center text-gold text-2xl font-light">
                  ✦
                </div>
                <div>
                  <h3 className="font-display text-xl text-maroon">No Garment Selected</h3>
                  <p className="font-editorial text-sm text-gold italic mt-0.5">
                    Select a photo from the sidebar to start the automation pipeline
                  </p>
                </div>
                <p className="font-body text-xs text-muted max-w-[400px] leading-relaxed mt-2">
                  Browse the Sonal Studio photo library in the sidebar to load flat-lay or mannequin shots of blouses, lehengas, or decor items, then remove backgrounds and build beautiful catalog imagery.
                </p>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
