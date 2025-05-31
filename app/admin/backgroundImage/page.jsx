"use client";

import { useState } from "react";
import Form from "./components/Form";
import ListView from "./components/ListView";

export default function Page() {
  const [editingImage, setEditingImage] = useState(null);

  const handleEditImage = (image) => {
    setEditingImage(image);
  };

  const handleEditComplete = () => {
    setEditingImage(null);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-7xl mx-auto">
        
        
        <div className="flex flex-col lg:flex-row gap-6">
          <Form 
            editingImage={editingImage} 
            onEditComplete={handleEditComplete}
          />
          <ListView 
            onEditImage={handleEditImage}
          />
        </div>
      </div>
    </main>
  );
}