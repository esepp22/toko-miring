"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Product {
  id_produk: number;
  nama_produk: string;
  harga: number;
}

export default function LamborghiniPage() {
  const [cars, setCars] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 6;

  const router = useRouter();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/products/lamborghini");
        if (!res.ok) {
          throw new Error(`Failed to fetch cars. Status: ${res.status}`);
        }
        const data = await res.json();
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format: expected an array");
        }
        setCars(data);
      } catch (err: any) {
        console.error("Error fetching cars:", err.message);
        setError("Failed to load Lamborghini models. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const handleCarClick = (id: number) => {
    router.push(`/dashboard/customers/lamborghini/detail?id=${id}`);
  };

  const filteredCars = cars.filter((car) =>
    car.nama_produk.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logi
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);
  const startIndex = (currentPage - 1) * carsPerPage;
  const endIndex = startIndex + carsPerPage;
  const paginatedCars = filteredCars.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading) {
    return (
      <main className="min-h-screen p-8 bg-gradient-to-b from-white to-teal-100 flex justify-center items-center">
        <p>Loading Lamborghini models...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen p-8 bg-gradient-to-b from-white to-teal-100 flex justify-center items-center">
        <p className="text-red-600">{error}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-gradient-to-b from-white to-teal-100">
      <button
        onClick={() => router.back()}
        className="mb-4 px-4 py-2 text-sm bg-black text-white rounded-full hover:bg-gray-800 transition"
      >
        ← Back
      </button>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Lamborghini Models</h1>
        <input
          type="text"
          placeholder="Search car name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-teal-600"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {paginatedCars.length > 0 ? (
          paginatedCars.map((car) => (
            <div
              key={car.id_produk}
              className="flex flex-col items-center text-center cursor-pointer hover:scale-105 transition"
              onClick={() => handleCarClick(car.id_produk)}
            >
              <div className="w-full h-48 relative">
                <Image
                  src="/images/cars/lamborghini.png"
                  alt={car.nama_produk}
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
              <p className="mt-4 font-semibold">{car.nama_produk}</p>
              <p className="text-sm text-gray-600">From Rp {car.harga.toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No models found.</p>
        )}
      </div>

      {/* Pagination Controls */}
      {filteredCars.length > carsPerPage && (
        <div className="flex justify-center mt-8 gap-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-black text-white rounded disabled:bg-gray-300"
          >
            Previous
          </button>
          <span className="self-center">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-black text-white rounded disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      )}

      {/* Review Section */}
      <section className="mt-16">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Customer Reviews</h2>
          <button
            onClick={() => router.push("/dashboard/testimoni")}
            className="text-blue-600 hover:underline text-sm"
          >
            Show All →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border rounded-xl shadow-sm bg-gray-50">
            <p className="text-gray-700 italic">"Driving the Aventador is a dream come true!"</p>
            <p className="mt-2 text-sm text-gray-500">– Esep.</p>
          </div>
          <div className="p-4 border rounded-xl shadow-sm bg-gray-50">
            <p className="text-gray-700 italic">"The Huracán is both powerful and stylish. Love it!"</p>
            <p className="mt-2 text-sm text-gray-500">– Aim.</p>
          </div>
        </div>
      </section>
    </main>
  );
}