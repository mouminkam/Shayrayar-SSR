"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function FoodMenuSection() {
  const [activeTab, setActiveTab] = useState("FastFood");

  const menuItems = {
    FastFood: [
      { id: 1, title: "Chinese Pasta", description: "It's a testament to our.", price: 15.99, image: "/img/menu/menuThumb1_1.png" },
      { id: 2, title: "Chicken Fried Rice", description: "It's a testament to our.", price: 25.99, image: "/img/menu/menuThumb1_2.png" },
      { id: 3, title: "Chicken Pizza", description: "It's a testament to our.", price: 115.99, image: "/img/menu/menuThumb1_3.png" },
      { id: 4, title: "Chicken Noodles", description: "It's a testament to our.", price: 154.99, image: "/img/menu/menuThumb1_4.png" },
      { id: 5, title: "Grilled Chicken", description: "It's a testament to our.", price: 55.99, image: "/img/menu/menuThumb1_5.png" },
      { id: 6, title: "Egg and Cucumber", description: "It's a testament to our.", price: 65.99, image: "/img/menu/menuThumb1_6.png" },
      { id: 7, title: "Chicken White Rice", description: "It's a testament to our.", price: 135.99, image: "/img/menu/menuThumb1_7.png" },
      { id: 8, title: "Spatial Barger", description: "It's a testament to our.", price: 95.99, image: "/img/menu/menuThumb1_8.png" },
      { id: 9, title: "Vegetables Burger", description: "It's a testament to our.", price: 75.99, image: "/img/menu/menuThumb1_9.png" },
      { id: 10, title: "Brief Chicken", description: "It's a testament to our.", price: 44.99, image: "/img/menu/menuThumb1_10.png" },
    ],
    DrinkJuice: [
      { id: 1, title: "Chinese Pasta", description: "It's a testament to our.", price: 15.99, image: "/img/menu/menuThumb1_1.png" },
      { id: 2, title: "Chicken Fried Rice", description: "It's a testament to our.", price: 25.99, image: "/img/menu/menuThumb1_2.png" },
      { id: 3, title: "Chicken Pizza", description: "It's a testament to our.", price: 115.99, image: "/img/menu/menuThumb1_3.png" },
      { id: 4, title: "Chicken Noodles", description: "It's a testament to our.", price: 154.99, image: "/img/menu/menuThumb1_4.png" },
      { id: 5, title: "Grilled Chicken", description: "It's a testament to our.", price: 55.99, image: "/img/menu/menuThumb1_5.png" },
      { id: 6, title: "Egg and Cucumber", description: "It's a testament to our.", price: 65.99, image: "/img/menu/menuThumb1_6.png" },
      { id: 7, title: "Chicken White Rice", description: "It's a testament to our.", price: 135.99, image: "/img/menu/menuThumb1_7.png" },
      { id: 8, title: "Spatial Barger", description: "It's a testament to our.", price: 95.99, image: "/img/menu/menuThumb1_8.png" },
      { id: 9, title: "Vegetables Burger", description: "It's a testament to our.", price: 75.99, image: "/img/menu/menuThumb1_9.png" },
      { id: 10, title: "Brief Chicken", description: "It's a testament to our.", price: 44.99, image: "/img/menu/menuThumb1_10.png" },
    ],
    ChickenPizza: [
      { id: 1, title: "Chinese Pasta", description: "It's a testament to our.", price: 15.99, image: "/img/menu/menuThumb1_1.png" },
      { id: 2, title: "Chicken Fried Rice", description: "It's a testament to our.", price: 25.99, image: "/img/menu/menuThumb1_2.png" },
      { id: 3, title: "Chicken Pizza", description: "It's a testament to our.", price: 115.99, image: "/img/menu/menuThumb1_3.png" },
      { id: 4, title: "Chicken Noodles", description: "It's a testament to our.", price: 154.99, image: "/img/menu/menuThumb1_4.png" },
      { id: 5, title: "Grilled Chicken", description: "It's a testament to our.", price: 55.99, image: "/img/menu/menuThumb1_5.png" },
      { id: 6, title: "Egg and Cucumber", description: "It's a testament to our.", price: 65.99, image: "/img/menu/menuThumb1_6.png" },
      { id: 7, title: "Chicken White Rice", description: "It's a testament to our.", price: 135.99, image: "/img/menu/menuThumb1_7.png" },
      { id: 8, title: "Spatial Barger", description: "It's a testament to our.", price: 95.99, image: "/img/menu/menuThumb1_8.png" },
      { id: 9, title: "Vegetables Burger", description: "It's a testament to our.", price: 75.99, image: "/img/menu/menuThumb1_9.png" },
      { id: 10, title: "Brief Chicken", description: "It's a testament to our.", price: 44.99, image: "/img/menu/menuThumb1_10.png" },
    ],
    FreshPasta: [
      { id: 1, title: "Chinese Pasta", description: "It's a testament to our.", price: 15.99, image: "/img/menu/menuThumb1_1.png" },
      { id: 2, title: "Chicken Fried Rice", description: "It's a testament to our.", price: 25.99, image: "/img/menu/menuThumb1_2.png" },
      { id: 3, title: "Chicken Pizza", description: "It's a testament to our.", price: 115.99, image: "/img/menu/menuThumb1_3.png" },
      { id: 4, title: "Chicken Noodles", description: "It's a testament to our.", price: 154.99, image: "/img/menu/menuThumb1_4.png" },
      { id: 5, title: "Grilled Chicken", description: "It's a testament to our.", price: 55.99, image: "/img/menu/menuThumb1_5.png" },
      { id: 6, title: "Egg and Cucumber", description: "It's a testament to our.", price: 65.99, image: "/img/menu/menuThumb1_6.png" },
      { id: 7, title: "Chicken White Rice", description: "It's a testament to our.", price: 135.99, image: "/img/menu/menuThumb1_7.png" },
      { id: 8, title: "Spatial Barger", description: "It's a testament to our.", price: 95.99, image: "/img/menu/menuThumb1_8.png" },
      { id: 9, title: "Vegetables Burger", description: "It's a testament to our.", price: 75.99, image: "/img/menu/menuThumb1_9.png" },
      { id: 10, title: "Brief Chicken", description: "It's a testament to our.", price: 44.99, image: "/img/menu/menuThumb1_10.png" },
    ],
  };

  const tabs = [
    { id: "FastFood", label: "Fast Food", icon: "/img/menu/menuIcon1_1.png" },
    { id: "DrinkJuice", label: "Drink & Juice", icon: "/img/menu/menuIcon1_2.png" },
    { id: "ChickenPizza", label: "Chicken Pizza", icon: "/img/menu/menuIcon1_3.png" },
    { id: "FreshPasta", label: "Fresh Pasta", icon: "/img/menu/menuIcon1_4.png" },
  ];

  const currentItems = menuItems[activeTab] || [];

  return (
    <section className="food-menu-section fix section-padding py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="food-menu-wrapper style1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="food-menu-tab-wrapper">
            {/* Title Area */}
            <div className="title-area text-center mb-12 lg:mb-16">
              <div className="sub-title text-theme2 font-epilogue text-base font-bold uppercase mb-4 flex items-center justify-center gap-2">
                <Image
                  className="me-1"
                  src="/img/icon/titleIcon.svg"
                  alt="icon"
                  width={20}
                  height={20}
                  unoptimized={true}
                />
                FOOD MENU
                <Image
                  className="ms-1"
                  src="/img/icon/titleIcon.svg"
                  alt="icon"
                  width={20}
                  height={20}
                  unoptimized={true}
                />
              </div>
              <h2 className="title text-white font-epilogue text-3xl sm:text-4xl lg:text-5xl font-black">
                Fresheat Foods Menu
              </h2>
            </div>

            {/* Tabs */}
            <div className="food-menu-tab mb-8">
              <ul className="nav nav-pills flex flex-wrap justify-center gap-4 mb-8" role="tablist">
                {tabs.map((tab) => (
                  <li key={tab.id} className="nav-item mb-10" role="presentation">
                    <button
                      className={`nav-link px-6 py-3 rounded-xl font-epilogue text-base font-medium transition-all duration-300 flex items-center gap-2 ${activeTab === tab.id
                        ? "bg-theme text-white"
                        : "text-white hover:bg-theme hover:text-white"
                        }`}
                      onClick={() => setActiveTab(tab.id)}
                      type="button"
                      role="tab"
                    >
                      <Image
                        src={tab.icon}
                        alt={tab.label}
                        width={24}
                        height={24}
                        unoptimized={true}
                      />
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>

              {/* Tab Content */}
              <div className="tab-content px-20">
                <div
                  className={`tab-pane ${activeTab === "FastFood" ? "show active" : ""}`}
                  role="tabpanel"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {currentItems.map((item) => (
                      <div key={item.id} className="single-menu-items  flex items-center gap-6 p-4 rounded-2xl  shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="menu-item-thumb shrink-0">
                          <Image
                            src={item.image}
                            alt={item.title}
                            width={100}
                            height={100}
                            className="w-24 h-24 object-cover rounded-full"
                            unoptimized={true}
                          />
                        </div>
                        <div className="menu-content flex-1">
                          <Link href="/menu">
                            <h3 className={`text-white font-epilogue text-lg font-bold mb-2 hover:text-theme transition-colors duration-300 ${activeTab === "FastFood" && item.id === 1 ? "text-theme" : ""}`}>
                              {item.title}
                            </h3>
                          </Link>
                          <p className="text-text font-roboto text-sm">{item.description}</p>
                        </div>
                        <h6 className="text-theme font-epilogue text-xl font-bold shrink-0">
                          ${item.price.toFixed(2)}
                        </h6>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

