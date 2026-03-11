import { useRef } from 'react';

interface FilePickerButtonProps {
  accept: string;
  onSelect: (file: File) => void;
  label: string;
  className?: string;
}

export function FilePickerButton({ accept, onSelect, label, className }: FilePickerButtonProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onSelect(file);
    if (fileRef.current) fileRef.current.value = '';
  }

  return (
    <label className={className}>
      {label}
      <input
        ref={fileRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
    </label>
  );
}
