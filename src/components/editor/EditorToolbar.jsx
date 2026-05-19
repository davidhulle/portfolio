import { motion, AnimatePresence } from 'framer-motion'
import { useEditor } from '../../context/EditorContext'
import StylePanel from './StylePanel'

export default function EditorToolbar() {
  const { editMode, setEditMode, panelOpen, setPanelOpen, closePanel } = useEditor()

  const toggleEditMode = () => {
    if (panelOpen) { closePanel(); return }
    if (editMode)  { setEditMode(false); return }
    setEditMode(true)
  }

  return (
    <>
      {/* ── Editable element highlight styles (injected when edit mode on) ── */}
      {editMode && !panelOpen && (
        <style>{`
          [data-editable] {
            outline: 1.5px dashed rgba(239,53,55,0.25);
            outline-offset: 6px;
            transition: outline-color 0.15s ease;
          }
          [data-editable]:hover {
            outline-color: rgba(239,53,55,0.75) !important;
            outline-width: 2px !important;
            cursor: pointer !important;
          }
        `}</style>
      )}

      {/* ── Floating action button ── */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, type: 'spring', stiffness: 300, damping: 26 }}
        className="fixed bottom-6 right-6 z-[89] flex flex-col items-center gap-1.5"
      >
        <motion.button
          onClick={toggleEditMode}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          className="w-12 h-12 rounded-full shadow-2xl flex items-center justify-center transition-colors"
          style={{
            background: editMode ? '#EF3537' : '#111',
            border: `1.5px solid ${editMode ? '#EF3537' : 'rgba(255,255,255,0.15)'}`,
            cursor: 'pointer',
          }}
          title={editMode ? 'Fechar editor' : 'Editar textos'}
        >
          <AnimatePresence mode="wait">
            {editMode ? (
              <motion.span key="x"
                initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </motion.span>
            ) : (
              <motion.span key="edit"
                initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Hint label */}
        <AnimatePresence>
          {!editMode && (
            <motion.span
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="text-[9px] font-bold tracking-widest uppercase text-center"
              style={{ color: 'rgba(255,255,255,0.25)' }}
            >
              Editor
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Hint bar at top when in edit mode */}
      <AnimatePresence>
        {editMode && !panelOpen && (
          <motion.div
            initial={{ y: -40 }} animate={{ y: 0 }} exit={{ y: -40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 right-0 z-[88] flex items-center justify-center gap-3 py-2 text-white text-xs font-bold"
            style={{ background: 'rgba(239,53,55,0.9)', backdropFilter: 'blur(8px)' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Clique em qualquer texto para editar
            <button
              onClick={() => setEditMode(false)}
              className="ml-4 text-white/70 hover:text-white transition-colors"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px' }}
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Style panel ── */}
      <StylePanel />
    </>
  )
}
