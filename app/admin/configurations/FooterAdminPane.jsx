"use client";

import React, { useState, useEffect } from "react";
import { Save, AlertCircle, PlusCircle, Trash2 } from "lucide-react";
import { saveFooterSettings, useFooterSettings } from "@/app/services/settings";


const FooterAdminPanel = () => {
  const [phoneNumbers, setPhoneNumbers] = useState({
    "JaEla": [
      "(+94) 70 300 9000",
      "(+94) 76 300 9000",
      "(+94) 70 400 9005"
    ],
    "Kurunegala": [
      "(+94) 70 400 9000",
      "(+94) 76 400 9000"
    ],
    "Colombo": [
      "(+94) 72 500 9000"
    ]
  });
  
  const [email, setEmail] = useState("asdcameralk@gmail.com");
  const [newBranchName, setNewBranchName] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [saveStatus, setSaveStatus] = useState(null);
  
  const { data, error, isLoading: loading, refresh } = useFooterSettings();

  useEffect(() => {
    if (data) {
      setPhoneNumbers(data.phoneNumbers || {});
      setEmail(data.email || "asdcameralk@gmail.com");
      
      // Select the first branch by default if none is selected
      if (!selectedBranch && Object.keys(data.phoneNumbers || {}).length > 0) {
        setSelectedBranch(Object.keys(data.phoneNumbers)[0]);
      }
    }
  }, [data]);

  const handleSaveSettings = async () => {
    setSaveStatus("saving");
    try {
      await saveFooterSettings({
        phoneNumbers,
        email
      });
      await refresh(); // Refresh the SWR cache
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error("Error saving footer settings:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const addBranch = () => {
    if (newBranchName.trim()) {
      setPhoneNumbers(prevPhoneNumbers => ({
        ...prevPhoneNumbers,
        [newBranchName.trim()]: []
      }));
      setSelectedBranch(newBranchName.trim());
      setNewBranchName("");
    }
  };

  const removeBranch = (branch) => {
    // Create a new object without the specified branch
    const updatedPhoneNumbers = { ...phoneNumbers };
    delete updatedPhoneNumbers[branch];
    
    // Update the state with the new object
    setPhoneNumbers(updatedPhoneNumbers);
    
    // If the deleted branch was selected, select another branch
    if (selectedBranch === branch) {
      const branches = Object.keys(updatedPhoneNumbers);
      setSelectedBranch(branches.length > 0 ? branches[0] : "");
    }
  };

  const addPhoneNumber = () => {
    if (selectedBranch && newPhoneNumber.trim()) {
      setPhoneNumbers(prevPhoneNumbers => {
        const updatedPhoneNumbers = { ...prevPhoneNumbers };
        updatedPhoneNumbers[selectedBranch] = [
          ...(updatedPhoneNumbers[selectedBranch] || []),
          newPhoneNumber.trim()
        ];
        return updatedPhoneNumbers;
      });
      setNewPhoneNumber("");
    }
  };

  const removePhoneNumber = (branch, index) => {
    setPhoneNumbers(prevPhoneNumbers => {
      const updatedPhoneNumbers = { ...prevPhoneNumbers };
      updatedPhoneNumbers[branch] = updatedPhoneNumbers[branch].filter((_, i) => i !== index);
      return updatedPhoneNumbers;
    });
  };

  const updatePhoneNumber = (branch, index, value) => {
    setPhoneNumbers(prevPhoneNumbers => {
      const updatedPhoneNumbers = { ...prevPhoneNumbers };
      updatedPhoneNumbers[branch][index] = value;
      return updatedPhoneNumbers;
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto mt-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Footer Settings</h1>
      
      <div className="space-y-6">
        {/* Email Setting */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Branches and Phone Numbers */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <label className="text-sm font-medium text-gray-700">Branches:</label>
            {Object.keys(phoneNumbers).map(branch => (
              <button
                key={branch}
                onClick={() => setSelectedBranch(branch)}
                className={`px-3 py-1 text-sm rounded-full ${
                  selectedBranch === branch 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {branch}
              </button>
            ))}
          </div>
          
          {/* Add New Branch */}
          <div className="flex items-center mb-6">
            <input
              type="text"
              value={newBranchName}
              onChange={(e) => setNewBranchName(e.target.value)}
              placeholder="Add new branch"
              className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addBranch}
              className="p-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
            >
              <PlusCircle size={20} />
            </button>
          </div>

          {/* Selected Branch Phone Numbers */}
          {selectedBranch && (
            <div className="border rounded-md p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">{selectedBranch}</h3>
                <button
                  onClick={() => removeBranch(selectedBranch)}
                  className="p-1 text-red-600 hover:text-red-800"
                  title="Remove Branch"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              <div className="space-y-2 mb-4">
                {phoneNumbers[selectedBranch]?.map((phone, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => updatePhoneNumber(selectedBranch, index, e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => removePhoneNumber(selectedBranch, index)}
                      className="ml-2 p-2 text-red-600 hover:text-red-800"
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
                  className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={addPhoneNumber}
                  className="p-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                >
                  <PlusCircle size={20} />
                </button>
              </div>
            </div>
          )}
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
              : "bg-blue-600 hover:bg-blue-700"
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
    </div>
  );
};

export default FooterAdminPanel;