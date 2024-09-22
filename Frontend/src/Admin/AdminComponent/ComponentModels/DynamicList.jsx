import React from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import InputField from "./InputField";

const DynamicList = ({
  items,
  section,
  fields,
  editingItem,
  setEditingItem,
  handleArrayItemChange,
  handleRemoveItem,
  isAddingNew,
  setIsAddingNew,
  newItem,
  setNewItem,
  handleAddItem,
}) => {
  const renderListItem = (item) => (
    <div
      key={item.id}
      className="mb-2 p-3 bg-gray-50 rounded-lg flex justify-between items-center"
    >
      <div>
        {fields.map((field) => (
          <p key={field.name} className="text-sm">
            <span className="font-medium">{field.label}:</span>{" "}
            {item[field.name]}
          </p>
        ))}
      </div>
      <div>
        <button
          onClick={() => setEditingItem(item)}
          className="text-blue-600 hover:text-blue-800 mr-2"
        >
          <FaEdit />
        </button>
        <button
          onClick={() => handleRemoveItem(section, item.id)}
          className="text-red-600 hover:text-red-800"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );

  const renderEditForm = (item) => (
    <div className="mb-4 p-4 bg-blue-50 rounded-lg">
      {fields.map((field) => (
        <InputField
          key={field.name}
          label={field.label}
          value={item[field.name] || ""}
          onChange={(e) =>
            handleArrayItemChange(section, item.id, field.name, e.target.value)
          }
          type={field.type || "text"}
          placeholder={`Enter ${field.label.toLowerCase()}`}
        />
      ))}
      <button
        onClick={() => setEditingItem(null)}
        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200"
      >
        Save Changes
      </button>
    </div>
  );

  const renderAddForm = () => (
    <div className="mb-4 p-4 bg-blue-50 rounded-lg">
      {fields.map((field) => (
        <InputField
          key={field.name}
          label={field.label}
          value={newItem[field.name] || ""}
          onChange={(e) =>
            setNewItem({ ...newItem, [field.name]: e.target.value })
          }
          type={field.type || "text"}
          placeholder={`Enter ${field.label.toLowerCase()}`}
        />
      ))}
      <div className="flex justify-end mt-4">
        <button
          onClick={() => setIsAddingNew(false)}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors duration-200 mr-2"
        >
          Cancel
        </button>
        <button
          onClick={() => handleAddItem(section)}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200"
        >
          Add
        </button>
      </div>
    </div>
  );

  return (
    <div>
      {items.map((item) =>
        editingItem && editingItem.id === item.id
          ? renderEditForm(item)
          : renderListItem(item)
      )}
      {isAddingNew ? (
        renderAddForm()
      ) : (
        <button
          onClick={() => {
            setIsAddingNew(true);
            setNewItem({});
          }}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200 flex items-center"
        >
          <FaPlus className="mr-2" /> Add New {section.slice(0, -1)}
        </button>
      )}
    </div>
  );
};

export default DynamicList;
