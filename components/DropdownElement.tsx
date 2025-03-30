import React from "react";
import { useState } from "react";
import styles from "../styles/components/DropdownElement.module.css";

const DropdownElement = ({
  label,
  options,
  onChange,
}: {
  label: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}) => {
  const [selected, setSelected] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelected(value);
    onChange(value); // Notify parent of the change
  };

  return (
    <div className="relative">
      <select
        value={selected}
        onChange={handleChange}
        className={styles.dropdownSelect}
      >
        <option value="">{label}</option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="text-black"
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownElement;
