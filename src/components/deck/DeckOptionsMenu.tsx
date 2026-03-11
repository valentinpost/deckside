import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { StoredDeck, DeckColor } from '@/types/deck';
import { DECK_COLORS } from '@/utils/deckColor';
import { exportDeckToJson, importDeckFromJson } from '@/utils/exportImport';
import { MoreHorizontalIcon } from '@/components/icons';
import { FilePickerButton } from '@/components/shared/FilePickerButton';

interface DeckOptionsMenuProps {
  deck: StoredDeck;
  onImport: (deck: StoredDeck) => void;
  onColorChange: (color: DeckColor) => void;
}

export function DeckOptionsMenu({ deck, onImport, onColorChange }: DeckOptionsMenuProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, right: 0 });

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPos({
      top: rect.bottom + 4,
      right: window.innerWidth - rect.right,
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    updatePosition();

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        dropdownRef.current && !dropdownRef.current.contains(target) &&
        triggerRef.current && !triggerRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }

    function handleScroll() {
      setOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [open, updatePosition]);

  async function handleFileSelected(file: File) {
    try {
      const imported = await importDeckFromJson(file);
      onImport(imported);
      setOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to import file');
    }
  }

  return (
    <div className="deck-options-menu">
      <button
        ref={triggerRef}
        onClick={() => setOpen(!open)}
        className="trigger-btn"
        aria-label="Deck options"
      >
        <MoreHorizontalIcon size={18} />
      </button>

      {open && createPortal(
        <div
          ref={dropdownRef}
          className="deck-options-dropdown"
          style={{ top: pos.top, right: pos.right }}
        >
          <div className="section">
            <span className="section-label">Deck Color</span>
            <div className="color-swatches">
              {DECK_COLORS.map((color) => (
                <button
                  key={color}
                  className="swatch"
                  data-color={color}
                  data-active={deck.deckColor === color || (!deck.deckColor && color === 'slate') ? '' : undefined}
                  onClick={() => { onColorChange(color); }}
                  aria-label={`Set deck color to ${color}`}
                />
              ))}
            </div>
          </div>

          <div className="divider" />

          <div className="section">
            <button
              onClick={() => { exportDeckToJson(deck); setOpen(false); }}
              className="menu-item"
            >
              Export JSON
            </button>
            <FilePickerButton
              accept=".json"
              onSelect={handleFileSelected}
              label="Import JSON"
              className="menu-item"
            />
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
