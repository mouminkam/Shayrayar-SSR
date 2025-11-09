"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import ShopSidebar from "./ShopSidebar";
import SortBar from "./SortBar";
import ProductCard from "./ProductCard";
import Pagination from "../blog/Pagination";

export default function ShopSection() {
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;
    const [viewMode, setViewMode] = useState("grid");
    const itemsPerPage = 12;

    // Sample products data - replace with actual data from API/backend
    const allProducts = [
        {
            id: 1,
            title: "Chicken Pizza",
            image: "/img/dishes/dishes2_1.png",
            price: 24.0,
            rating: "/img/icon/star2.svg",
            description: "The registration fee",
        },
        {
            id: 2,
            title: "Egg and Cucumber",
            image: "/img/dishes/dishes2_2.png",
            price: 28.0,
            rating: "/img/icon/star2.svg",
            description: "The registration fee",
        },
        {
            id: 3,
            title: "Chicken Fried Rice",
            image: "/img/dishes/dishes2_3.png",
            price: 20.0,
            rating: "/img/icon/star2.svg",
            description: "The registration fee",
        },
        {
            id: 4,
            title: "Chicken Leg Piece",
            image: "/img/dishes/dishes2_4.png",
            price: 58.0,
            rating: "/img/icon/star2.svg",
            description: "The registration fee",
        },
        {
            id: 5,
            title: "Chicken Pizza",
            image: "/img/dishes/dishes2_1.png",
            price: 24.0,
            rating: "/img/icon/star2.svg",
            description: "The registration fee",
        },
        {
            id: 6,
            title: "Egg and Cucumber",
            image: "/img/dishes/dishes2_2.png",
            price: 28.0,
            rating: "/img/icon/star2.svg",
            description: "The registration fee",
        },
        {
            id: 7,
            title: "Chicken Fried Rice",
            image: "/img/dishes/dishes2_3.png",
            price: 20.0,
            rating: "/img/icon/star2.svg",
            description: "The registration fee",
        },
        {
            id: 8,
            title: "Chicken Leg Piece",
            image: "/img/dishes/dishes2_4.png",
            price: 58.0,
            rating: "/img/icon/star2.svg",
            description: "The registration fee",
        },
        {
            id: 9,
            title: "Chicken Pizza",
            image: "/img/dishes/dishes2_4.png",
            price: 24.0,
            rating: "/img/icon/star2.svg",
            description: "The registration fee",
        },
        {
            id: 10,
            title: "Egg and Cucumber",
            image: "/img/dishes/dishes2_5.png",
            price: 28.0,
            rating: "/img/icon/star2.svg",
            description: "The registration fee",
        },
        {
            id: 11,
            title: "Chicken Fried Rice",
            image: "/img/dishes/dishes2_3.png",
            price: 20.00,
            rating: "/img/icon/star2.svg",
            description: "The registration fee",
        },
        {
            id: 12,
            title: "Chicken Leg Piece",
            image: "/img/dishes/dishes2_4.png",
            price: 58.0,
            rating: "/img/icon/star2.svg",
            description: "The registration fee",
        },
        // Add more products as needed
        ...Array.from({ length: 18 }, (_, i) => ({
            id: 13 + i,
            title: `Product ${13 + i}`,
            image: "/img/dishes/dishes2_1.png",
            price: 20 + i * 5,
            rating: "/img/icon/star2.svg",
            description: "The registration fee",
        })),
    ];

    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = allProducts.slice(startIndex, endIndex);

    return (
        <section className="shop-section py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
            <div className="shop-wrapper style1">
                <div className="container mx-auto px-4 sm:px-6 ">
                    <div className="row grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                        {/* Sidebar */}
                        <div className="lg:col-span-3 order-2 lg:order-1">
                            <ShopSidebar />
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-9 order-1 lg:order-2">
                            <SortBar
                                totalItems={allProducts.length}
                                currentPage={currentPage}
                                itemsPerPage={itemsPerPage}
                                onViewChange={setViewMode}
                                viewMode={viewMode}
                            />

                            {/* Products Grid/List */}
                            <div className="tab-content">
                                {viewMode === "grid" ? (
                                    <div className="dishes-card-wrap style2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 sm:gap-8 mb-8">
                                        {currentProducts.map((product) => (
                                            <ProductCard key={product.id} product={product} viewMode="grid" />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="dishes-card-wrap style3 flex flex-col gap-6 sm:gap-8 mb-8">
                                        {currentProducts.map((product) => (
                                            <ProductCard key={product.id} product={product} viewMode="list" />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            <Pagination totalItems={allProducts.length} itemsPerPage={itemsPerPage} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

