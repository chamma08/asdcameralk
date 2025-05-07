"use client";

import React, { useState } from "react";
import RedbarAdminPanel from "./RedbarAdminPanel";
import FooterAdminPanel from "./FooterAdminPane";

const page = () => {
  const [activeTab, setActiveTab] = useState("redbar");

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 ">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Admin Configuration Settings
        </h1>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "redbar"
                ? "text-red-600 border-b-2 border-red-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("redbar")}
          >
            Redbar Settings
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "footer"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("footer")}
          >
            Footer Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden p-4">
          {activeTab === "redbar" && (
            <div>
              <div className="p-4 bg-red-600 text-white">
                <h2 className="text-xl font-semibold">Redbar Settings</h2>
                <p className="text-sm opacity-80">
                  Customize the announcement bar text and phone numbers
                </p>
              </div>
              <RedbarAdminPanel />
            </div>
          )}

          {activeTab === "footer" && (
            <div>
              <div className="p-4 bg-blue-600 text-white">
                <h2 className="text-xl font-semibold">Footer Settings</h2>
                <p className="text-sm opacity-80">
                  Manage branches, phone numbers and contact information
                </p>
              </div>
              <FooterAdminPanel />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
