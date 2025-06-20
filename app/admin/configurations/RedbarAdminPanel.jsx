"use client";

import React, { useState, useEffect } from "react";
import { Save, AlertCircle, Eye, EyeOff } from "lucide-react";
import { saveRedbarSettings, useRedbarSettings } from "@/app/services/settings";


const RedbarAdminPanel = () => {
  const [openText, setOpenText] = useState("WE ARE OPEN NOW");
  const [closedText, setClosedText] = useState("WE ARE CLOSED NOW");
  const [phoneNumbers, setPhoneNumbers] = useState([
    "011 2 687 687",
    "011 2 687 688",
    "077 7 687 687"
  ]);
  const [isVisible, setIsVisible] = useState(true);
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [saveStatus, setSaveStatus] = useState(null);
  
  const { data, error, isLoading: loading, refresh } = useRedbarSettings();

  useEffect(() => {
    if (data) {
      setOpenText(data.openText || "WE ARE OPEN NOW");
      setClosedText(data.closedText || "WE ARE CLOSED NOW");
      setPhoneNumbers(data.phoneNumbers || [
        "011 2 687 687",
        "011 2 687 688",
        "077 7 687 687"
      ]);
      setIsVisible(data.isVisible !== undefined ? data.isVisible : true);
    }
  }, [data]);

  const handleSaveSettings = async () => {
    setSaveStatus("saving");
    try {
      await saveRedbarSettings({
        openText,
        closedText,
        phoneNumbers,
        isVisible
      });
      await refresh(); // Refresh the SWR cache
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error("Error saving redbar settings:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const addPhoneNumber = () => {
    if (newPhoneNumber.trim()) {
      setPhoneNumbers([...phoneNumbers, newPhoneNumber.trim()]);
      setNewPhoneNumber("");
    }
  };

  const removePhoneNumber = (index) => {
    const updatedPhoneNumbers = [...phoneNumbers];
    updatedPhoneNumbers.splice(index, 1);
    setPhoneNumbers(updatedPhoneNumbers);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto mt-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Redbar Admin Settings</h1>
        
        {/* Visibility Toggle Button */}
        <button
          onClick={toggleVisibility}
          className={`flex items-center px-4 py-2 rounded-md text-white font-medium transition-colors ${
            isVisible 
              ? "bg-green-600 hover:bg-green-700" 
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {isVisible ? (
            <>
              <Eye size={18} className="mr-2" />
              Redbar Visible
            </>
          ) : (
            <>
              <EyeOff size={18} className="mr-2" />
              Redbar Hidden
            </>
          )}
        </button>
      </div>
      
      <div className="space-y-6">
        {/* Open Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Open Status Text
          </label>
          <input
            type="text"
            value={openText}
            onChange={(e) => setOpenText(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            disabled={!isVisible}
          />
        </div>
        
        {/* Closed Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Closed Status Text
          </label>
          <input
            type="text"
            value={closedText}
            onChange={(e) => setClosedText(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            disabled={!isVisible}
          />
        </div>
        
        {/* Phone Numbers */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Numbers
          </label>
          <div className="space-y-2 mb-4">
            {phoneNumbers.map((phone, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => {
                    const updatedPhoneNumbers = [...phoneNumbers];
                    updatedPhoneNumbers[index] = e.target.value;
                    setPhoneNumbers(updatedPhoneNumbers);
                  }}
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  disabled={!isVisible}
                />
                <button
                  onClick={() => removePhoneNumber(index)}
                  className="ml-2 p-2 text-red-600 hover:text-red-800 disabled:opacity-50"
                  disabled={!isVisible}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center">
            <input
              type="text"
              value={newPhoneNumber}
              onChange={(e) => setNewPhoneNumber(e.target.value)}
              placeholder="Add new phone number"
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              disabled={!isVisible}
            />
            <button
              onClick={addPhoneNumber}
              className="ml-2 p-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              disabled={!isVisible}
            >
              +
            </button>
          </div>
        </div>
      </div>
      
      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSaveSettings}
          disabled={saveStatus === "saving"}
          className={`flex items-center px-4 py-2 rounded-md ${
            saveStatus === "saving" 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-black hover:bg-opacity-80"
          } text-white`}
        >
          <Save size={18} className="mr-2" />
          {saveStatus === "saving" ? "Saving..." : "Save Settings"}
        </button>
      </div>
      
      {/* Status Message */}
      {saveStatus === "success" && (
        <div className="mt-4 p-2 bg-green-100 text-green-700 rounded-md">
          Settings saved successfully!
        </div>
      )}
      {saveStatus === "error" && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded-md flex items-center">
          <AlertCircle size={16} className="mr-2" />
          Error saving settings. Please try again.
        </div>
      )}
      
      {/* Visibility Status Info */}
      {!isVisible && (
        <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded-md border border-yellow-300">
          <div className="flex items-center">
            <EyeOff size={16} className="mr-2" />
            <span className="font-medium">Redbar is currently hidden from users</span>
          </div>
          <p className="text-sm mt-1">
            Other settings are disabled while the redbar is hidden. Toggle visibility to enable editing.
          </p>
        </div>
      )}
    </div>
  );
};

export default RedbarAdminPanel;