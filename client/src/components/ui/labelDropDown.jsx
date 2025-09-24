"use client"

import { useState } from "react"
import { Plus, Tag, X } from "lucide-react"
import "../../assets/css/labelDropDown.css"

function LabelsManager() {
  const [labels, setLabels] = useState([
    { id: "1", name: "read", checked: false },
    { id: "2", name: "Important", checked: true },
    { id: "3", name: "eshe", checked: true },
  ])
  const [newLabel, setNewLabel] = useState("")

  const handleAddLabel = () => {
    if (newLabel.trim()) {
      const newLabelObj = {
        id: Date.now().toString(),
        name: newLabel.trim(),
        checked: false,
      }
      setLabels([...labels, newLabelObj])
      setNewLabel("")
    }
  }

  const handleToggleLabel = (id) => {
    setLabels(labels.map((label) => (label.id === id ? { ...label, checked: !label.checked } : label)))
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddLabel()
    }
  }

  return (
    <div className="labels-container">
      {/* Header */}
      <div className="labels-header">
        <h2 className="labels-title">Labels</h2>
        <div>
          <button className="add-button" onClick={handleAddLabel} type="button">
            <Plus className="h-4 w-4" />
          </button>
          <button className="add-button" onClick={handleAddLabel} type="button">
            <X className="h-4 w-4"/>
          </button>
        </div>
      </div>

      {/* Input field */}
      <div className="input-section">
        <input
          type="text"
          placeholder="Type a label"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyPress={handleKeyPress}
          className="label-input"
        />
      </div>

      {/* Labels list */}
      <div className="labels-list">
        {labels.map((label) => (
          <div key={label.id} className="label-item">
            <Tag className="label-icon" />
            <span className="label-text">{label.name}</span>
            <input
              type="checkbox"
              checked={label.checked}
              onChange={() => handleToggleLabel(label.id)}
              className="label-checkbox"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default LabelsManager;