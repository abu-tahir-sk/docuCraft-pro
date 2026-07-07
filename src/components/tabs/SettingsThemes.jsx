import React from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';

const SettingsThemes = ({ appState, appSetters, themes }) => {
  const { settings, labels } = appState;
  const { setSettings, setLabels } = appSetters;

  const uploadLogo = async (file) => {

    const formData = new FormData();

    formData.append("image", file);

    const res = await axios.post(
      "http://localhost:5000/api/upload/image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    setCompany(prev => ({
      ...prev,
      logo: res.data.url
    }));

  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-200">

      {/* 1. Theme Colors */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
        <h3 className="text-[12px] font-bold text-gray-800 uppercase">1. Theme Colors</h3>
        <div className="flex gap-3">
          {Object.keys(themes || {}).map(color => (
            <button key={color} onClick={() => setSettings({ ...settings, themeColor: color })} className={`w-8 h-8 rounded-full shadow-sm border-4 ${settings.themeColor === color ? 'border-gray-800 scale-110' : 'border-transparent'} ${themes[color].bg} transition-all`} />
          ))}
        </div>
      </div>

      {/* 2. Advanced Watermark Engine */}
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm space-y-4">
        <h3 className="text-[12px] font-bold text-gray-800 uppercase border-b pb-2">2. Watermark Synthesis</h3>

        <select value={settings.watermarkType} onChange={(e) => setSettings({ ...settings, watermarkType: e.target.value })} className="w-full px-2 py-1.5 text-xs font-bold border rounded bg-gray-50 cursor-pointer">
          <option value="disabled">Disabled (No Watermark)</option>
          <option value="text">Single Text</option>
          <option value="logo">Single Logo</option>
          <option value="text-tiling">Text Tiling (Pattern)</option>
          <option value="logo-tiling">Logo Tiling (Pattern)</option>
        </select>

        {settings.watermarkType.includes('text') && (
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase">Watermark Text</label>
            <input type="text" value={settings.watermarkText} onChange={(e) => setSettings({ ...settings, watermarkText: e.target.value })} className="w-full px-2 py-1.5 text-xs border rounded" placeholder="e.g. TIME DIGITALS" />
          </div>
        )}

        {settings.watermarkType.includes('logo') && (
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Watermark Logo</label>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded cursor-pointer text-xs hover:bg-gray-200 border">
                <Upload size={12} /> Upload Logo
                <input type="file"

                  onChange={(e) => uploadLogo(e.target.files[0])} className="hidden" />
              </label>
              {settings.watermarkLogo && <button onClick={() => setSettings({ ...settings, watermarkLogo: null })} className="text-[10px] text-red-500 hover:underline">Remove</button>}
            </div>
          </div>
        )}

        {/* Sliders for Controls */}
        {settings.watermarkType !== 'disabled' && (
          <div className="space-y-4 pt-3 border-t">
            <div>
              <div className="flex justify-between"><label className="text-[10px] font-bold uppercase text-gray-600">Pattern Intensity</label><span className="text-[10px] font-bold">{settings.patternIntensity}%</span></div>
              <input type="range" min="1" max="100" value={settings.patternIntensity} onChange={(e) => setSettings({ ...settings, patternIntensity: parseInt(e.target.value) })} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
            </div>

            {settings.watermarkType.includes('tiling') && (
              <div>
                <div className="flex justify-between"><label className="text-[10px] font-bold uppercase text-gray-600">Grain & Spacing</label><span className="text-[10px] font-bold">{settings.grainSpacing}</span></div>
                <input type="range" min="50" max="500" value={settings.grainSpacing} onChange={(e) => setSettings({ ...settings, grainSpacing: parseInt(e.target.value) })} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
              </div>
            )}

            <div>
              <div className="flex justify-between"><label className="text-[10px] font-bold uppercase text-gray-600">Font/Icon Spread</label><span className="text-[10px] font-bold">{settings.fontIconSpread}</span></div>
              <input type="range" min="10" max="150" value={settings.fontIconSpread} onChange={(e) => setSettings({ ...settings, fontIconSpread: parseInt(e.target.value) })} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
export default SettingsThemes;