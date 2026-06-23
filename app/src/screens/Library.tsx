import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePacks } from '@/store/packs';
import { navigate } from '@/router';
import { Mascot } from '@/components/Mascot';
import type { CoursePack } from '@/types/pack';

function validatePack(obj: unknown): { ok: true; pack: CoursePack } | { ok: false; error: string } {
  if (!obj || typeof obj !== 'object') return { ok: false, error: '不是有效的 JSON 物件。' };
  const p = obj as Partial<CoursePack>;
  if (!p.id || typeof p.id !== 'string') return { ok: false, error: '缺少 id。' };
  if (!p.title) return { ok: false, error: '缺少 title。' };
  if (!Array.isArray(p.units)) return { ok: false, error: '缺少 units 陣列。' };
  return { ok: true, pack: obj as CoursePack };
}

export function Library() {
  const { packs, activeId, setActive, registerPack, loadFromUrl } = usePacks();
  const [raw, setRaw] = useState('');
  const [url, setUrl] = useState('');
  const [msg, setMsg] = useState<{ tone: 'ok' | 'err'; text: string } | null>(null);
  const list = Object.values(packs);

  const doImport = (text: string) => {
    try {
      const obj = JSON.parse(text);
      const res = validatePack(obj);
      if (!res.ok) { setMsg({ tone: 'err', text: res.error }); return; }
      registerPack(res.pack);
      setActive(res.pack.id);
      setMsg({ tone: 'ok', text: `已匯入並切換到「${res.pack.title}」` });
      setRaw('');
    } catch (e) {
      setMsg({ tone: 'err', text: 'JSON 解析失敗：' + (e as Error).message });
    }
  };

  const doUrl = async () => {
    setMsg(null);
    try {
      const pack = await loadFromUrl(url);
      setActive(pack.id);
      setMsg({ tone: 'ok', text: `已從網址載入「${pack.title}」` });
      setUrl('');
    } catch (e) {
      setMsg({ tone: 'err', text: '載入失敗：' + (e as Error).message });
    }
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => doImport(String(reader.result));
    reader.readAsText(file);
  };

  return (
    <div className="mx-auto px-4 pb-28 pt-4" style={{ maxWidth: 'var(--app-max)' }}>
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate('#/')} className="text-2xl ink-faint">←</button>
        <h1 className="font-display text-2xl font-extrabold ink">課程庫</h1>
      </div>

      {/* installed courses */}
      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        {list.map((p) => (
          <motion.div key={p.id} whileHover={{ y: -3 }} className="card p-5"
            style={{ borderColor: p.id === activeId ? (p.accent ?? '#2fd49d') : 'var(--border)' }}>
            <div className="flex items-start gap-3">
              <div className="grid place-items-center w-12 h-12 rounded-xl text-2xl flex-none"
                style={{ background: `linear-gradient(135deg, ${p.accent ?? '#2fd49d'}, ${p.accent ?? '#2fd49d'}cc)`, color: '#06241b' }}>
                {p.icon ?? '📘'}
              </div>
              <div className="min-w-0">
                <div className="font-bold ink">{p.title}</div>
                <div className="ink-faint text-xs">{p.subject} · v{p.version} · {p.units.length} 單元</div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              {p.id === activeId ? (
                <button onClick={() => navigate('#/')} className="btn3d flex-1 py-2.5 text-white text-sm"
                  style={{ background: `linear-gradient(135deg, ${p.accent}, ${p.accent}cc)`, ['--btn-shadow' as string]: '#0a7d5c' }}>
                  進入課程
                </button>
              ) : (
                <button onClick={() => { setActive(p.id); navigate('#/'); }} className="btn3d flex-1 py-2.5 ink text-sm"
                  style={{ background: 'var(--surface-2)', ['--btn-shadow' as string]: 'var(--border-strong)', border: '1px solid var(--border)' }}>
                  切換到此課程
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* import */}
      <div className="card p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-3">
          <Mascot mood="think" size={56} />
          <div>
            <h2 className="font-display text-lg font-extrabold ink">匯入課程包</h2>
            <p className="ink-faint text-sm">貼上 / 上傳 / 用網址載入一份課程包 JSON，即可新增課程，無需更新 App。</p>
          </div>
        </div>

        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder='在此貼上課程包 JSON … 例如 { "id": "...", "title": "...", "units": [...] }'
          className="w-full h-40 rounded-xl p-3 font-mono text-sm ink outline-none resize-y"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border-strong)' }}
        />
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <button onClick={() => doImport(raw)} disabled={!raw.trim()}
            className="btn3d px-5 py-2.5 text-white text-sm"
            style={{ background: raw.trim() ? 'linear-gradient(135deg,#2fd49d,#13b884)' : 'var(--border-strong)', ['--btn-shadow' as string]: '#0a7d5c' }}>
            匯入並啟用
          </button>
          <label className="btn3d px-5 py-2.5 ink text-sm cursor-pointer"
            style={{ background: 'var(--surface-2)', ['--btn-shadow' as string]: 'var(--border-strong)', border: '1px solid var(--border)' }}>
            上傳 .json
            <input type="file" accept="application/json,.json" onChange={onFile} className="hidden" />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-3">
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="或輸入課程包網址 https://…/pack.json"
            className="flex-1 min-w-[200px] rounded-xl px-3 py-2.5 text-sm ink outline-none"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border-strong)' }} />
          <button onClick={doUrl} disabled={!url.trim()}
            className="btn3d px-5 py-2.5 ink text-sm"
            style={{ background: 'var(--surface-2)', ['--btn-shadow' as string]: 'var(--border-strong)', border: '1px solid var(--border)' }}>
            從網址載入
          </button>
        </div>

        {msg && (
          <div className="mt-3 rounded-xl px-3 py-2 text-sm"
            style={{ background: msg.tone === 'ok' ? 'rgba(47,212,157,.12)' : 'rgba(255,93,126,.12)', border: `1px solid ${msg.tone === 'ok' ? 'rgba(47,212,157,.4)' : 'rgba(255,93,126,.4)'}`, color: msg.tone === 'ok' ? '#13b884' : '#ff5d7e' }}>
            {msg.text}
          </div>
        )}

        <p className="ink-faint text-xs mt-4">
          想知道課程包格式？見 <code>docs/AUTHORING.md</code>。可把題目交給 AI，依該指南產生課程包後貼到這裡。
        </p>
      </div>
    </div>
  );
}
