import { useState, useRef, useEffect } from 'react';

export function Dropdown({
  trigger,
  options = [],
  onSelect,
  value,
  placeholder = 'Seleccionar',
  className = '',
  disabled = false,
  searchable = false,
  renderOption,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = searchable
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={`dropdown ${className}`} ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        className={`dropdown-trigger ${disabled ? 'disabled' : ''} ${isOpen ? 'open' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={placeholder}
      >
        {trigger || (
          <>
            {selectedOption ? selectedOption.label : placeholder}
            <span className="dropdown-arrow" aria-hidden="true">▼</span>
          </>
        )}
      </button>

      {isOpen && (
        <div className="dropdown-menu" role="listbox">
          {searchable && (
            <input
              type="text"
              className="dropdown-search"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          )}
          <div className="dropdown-options" role="listbox">
            {filteredOptions.length === 0 ? (
              <div className="dropdown-empty">No se encontraron opciones</div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`dropdown-option ${option.value === value ? 'selected' : ''}`}
                  role="option"
                  aria-selected={option.value === value}
                  onClick={() => {
                    onSelect?.(option.value);
                    setIsOpen(false);
                  }}
                >
                  {renderOption ? renderOption(option) : option.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dropdown;