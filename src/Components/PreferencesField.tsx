import React from 'react';
import { Preferences, Fields } from '../Enums';
import Select from 'react-select';

interface IProps {
  selectedPreferences: Preferences[],
  updateField: any
}

const options = Object.keys(Preferences).map((k) =>
  ({ label: Preferences[k as keyof typeof Preferences], value: k })
)

const PreferencesField = ({ selectedPreferences, updateField }: IProps) => {
  const handleChange = (selectedOption: any) => {
    const preferences = selectedOption
                        ? selectedOption.map((x: any) => x.value)
                        : [];
    updateField(Fields.Preferences, preferences);
  };

  const value = selectedPreferences
                ? selectedPreferences.map((selected) => 
                ({ label: Preferences[selected as string as keyof typeof Preferences], value: selected as string })
                ) 
                : [];

  return (
    <div className="preferences mt0 mb3-ns">
      <h3 className="mt0" >Preferences</h3>
      <p className="fw4 tl">
        The types of clothing you would like to have in your capsule wardrobe:
      </p>
      <Select
        className="select"
        isSearchable={false}
        closeMenuOnSelect={false}
        blurInputOnSelect={false}
        value={value}
        onChange={handleChange}
        isClearable
        isMulti
        options={options}
      />
    </div>
  )
}

export default PreferencesField;