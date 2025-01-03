"use client";

import React from "react";
import Form from "./components/Form";
import ListView from "./components/ListView";

export default function page() {
  return (
    <main className="p-5 flex flex-col md:flex-row gap-5">
      <Form />
      <ListView />
    </main>
  );
}
