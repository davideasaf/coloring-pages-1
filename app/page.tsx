"use client";
import Image from "next/image";
import { useState } from "react";

const sampleImages = [
  "https://openclipart.org/download/319290/1546396811.svg",
  "https://openclipart.org/download/335981/1549396478.svg",
  "https://openclipart.org/download/325896/1546862088.svg",
  "https://openclipart.org/download/320051/1546442390.svg",
];

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  async function generate(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setImageUrl(data.url);
    } catch (err) {
      console.error(err);
      alert("Failed to generate image");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen p-8 space-y-8">
      <h1 className="text-3xl font-bold text-center">Coloring Pages</h1>
      <form onSubmit={generate} className="flex justify-center gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe a coloring page..."
          className="border p-2 w-2/3 rounded text-black"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>
      {imageUrl ? (
        <div className="flex flex-col items-center gap-4">
          <Image
            src={imageUrl}
            alt="Generated coloring"
            width={512}
            height={512}
          />
          <button
            type="button"
            onClick={() => window.print()}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Print
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sampleImages.map((src) => (
            <Image
              key={src}
              src={src}
              alt="Sample coloring page"
              width={300}
              height={300}
            />
          ))}
        </div>
      )}
    </div>
  );
}
