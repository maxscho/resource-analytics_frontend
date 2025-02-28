'use client'

import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch('http://localhost:9090/units', {
      method: 'GET',
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => setMessage(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <>
      <h1>Home</h1>
      <h1>{message}</h1>
    </>
  );
}