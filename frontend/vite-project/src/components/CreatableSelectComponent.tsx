import { useEffect, useState } from "react";
import { Combobox, InputBase, useCombobox } from "@mantine/core";

interface CreatableSelectProps {
  initialData: { value: string; label: string }[];
  value: string[]; // Array of selected values
  onChange: (selectedValues: string[]) => void; // Callback to notify parent of changes
}

export default function CreatableSelect({ initialData, value, onChange }: CreatableSelectProps) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>(value);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    setSelectedOptions(value);
  }, [value]);

  const filteredOptions = data.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase().trim())
  );

  const options = filteredOptions.map((item) => (
    <Combobox.Option value={item.value} key={item.value}>
      {item.label}
    </Combobox.Option>
  ));

  const handleOptionSubmit = (val: string) => {
    if (val === "$create") {
      const newItem = { value: search, label: search };
      setData((current) => [...current, newItem]);
      if (!selectedOptions.includes(newItem.value)) {
        const updatedSelection = [...selectedOptions, newItem.value];
        setSelectedOptions(updatedSelection);
        onChange(updatedSelection); // Notify parent of new value
      }
      setSearch("");
    } else {
      if (!selectedOptions.includes(val)) {
        const updatedSelection = [...selectedOptions, val];
        setSelectedOptions(updatedSelection);
        onChange(updatedSelection); // Notify parent of selected value
      }
      setSearch("");
    }

    combobox.closeDropdown();
  };

  // Create a display label from the selected options
  const displayLabel = selectedOptions
    .map((selectedValue) => {
      const item = data.find((d) => d.value === selectedValue);
      return item ? item.label : "";
    })
    .join(", ");

  return (
    <Combobox
      store={combobox}
      withinPortal={true}
      onOptionSubmit={handleOptionSubmit}
    >
      <Combobox.Target>
        <InputBase
          rightSection={<Combobox.Chevron />}
          value={displayLabel}
          onChange={(event) => {
            combobox.openDropdown();
            combobox.updateSelectedOptionIndex();
            setSearch(event.currentTarget.value);
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => {
            combobox.closeDropdown();
            setSearch("");
          }}
          placeholder="Search value"
          rightSectionPointerEvents="none"
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {options}

          <Combobox.Option
            value="$create"
            style={{
              backgroundColor: "#e0f7fa",
              color: "#00796b",
              textAlign: "center",
              fontWeight: "bold",
              padding: "10px 0",
              width: "100%",
              display: "block",
            }}
          >
            + Add new item
          </Combobox.Option>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
