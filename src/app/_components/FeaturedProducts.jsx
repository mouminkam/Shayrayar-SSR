import FeaturedHeaderSection from "./FeaturedHeaderSection";
import FeaturedProductCard from "./FeaturedProductCard";

export default function FeaturedProducts({ headerData, products = [] }) {
  // Default products data if not provided
  const defaultProducts = [
    {
      image: "/images/img25.png",
      alt: "Featured Product 2",
      name: "Classic Heel Collection",
      originalPrice: "$299.99",
      discountedPrice: "$199.99",
      width: 600,
      height: 800,
    },
    {
      image: "/images/img26.png",
      alt: "Featured Product 3",
      name: "Elegant Stiletto",
      originalPrice: "$349.99",
      discountedPrice: "$249.99",
      width: 600,
      height: 800,
    },
    {
      image: "/images/img23.jpg",
      alt: "Featured Product 5",
      name: "Premium High Heel",
      originalPrice: "$399.99",
      discountedPrice: "$299.99",
      colSpan: "md:col-span-2 xl:col-span-2",
      rowSpan: "xl:row-span-4",
      width: 600,
      height: 1200,
    },
    {
      image: "/images/img24.jpg",
      alt: "Featured Product 6",
      name: "Designer Heel",
      originalPrice: "$279.99",
      discountedPrice: "$179.99",
      colSpan: "md:col-span-2 xl:col-span-2",
      rowSpan: "xl:row-span-2",
      width: 600,
      height: 800,
    },
    {
      image: "/images/img26.png",
      alt: "Featured Product 8",
      name: "Luxury Heel",
      originalPrice: "$329.99",
      discountedPrice: "$229.99",
      width: 600,
      height: 800,
    },
    {
      image: "/images/img25.png",
      alt: "Featured Product 9",
      name: "Modern Stiletto",
      originalPrice: "$269.99",
      discountedPrice: "$169.99",
      width: 600,
      height: 800,
    },
  ];
  const defaultProducts1 = [
    {
      image: "/images/img26.png",
      alt: "Featured Product 2",
      name: "Classic Heel Collection",
      originalPrice: "$299.99",
      colSpan: "md:col-span-2 xl:col-span-2",
      discountedPrice: "$199.99",
      width: 600,
      height: 800,
    },

    {
      image: "/images/img29.jpg",
      alt: "Featured Product 5",
      name: "Premium High Heel",
      originalPrice: "$399.99",
      discountedPrice: "$299.99",
      colSpan: "md:col-span-2 xl:col-span-2",
      rowSpan: "xl:row-span-4",
      width: 600,
      height: 1200,
    },
    {
      image: "/images/img30.jpg",
      alt: "Featured Product 6",
      name: "Designer Heel",
      originalPrice: "$279.99",
      discountedPrice: "$179.99",
      colSpan: "md:col-span-2 xl:col-span-2",
      rowSpan: "xl:row-span-2",
      width: 600,
      height: 800,
    },
    {
      image: "/images/img21.png",
      alt: "Featured Product 8",
      name: "Luxury Heel",
      originalPrice: "$329.99",
      discountedPrice: "$229.99",
      width: 600,
      height: 800,
    },
    {
      image: "/images/img29.jpg",
      alt: "Featured Product 9",
      name: "Modern Stiletto",
      originalPrice: "$269.99",
      discountedPrice: "$169.99",
      width: 600,
      height: 800,
    },
  ];

  const productsToRender = products.length > 0 ? products : defaultProducts;

  const defaultHeaderData = {
    title: "FEATURED PRODUCTS",
    subtitle: "MAGIC SHOE STILETTO",
    description:
      "Figma ipsum component variant main layer. Prototype distribute plugin vertical scale union. Connection fill component variant connection selection project team. Layer variant vertical union frame.",
    buttonText: "See more",
    buttonLink: "#",
  };
  const defaultHeaderData1 = {
    title: "ON SALE",
    subtitle: "SAVE UP TO 30% WITH MAGIC SHOE",
    description:
      "Figma ipsum component variant main layer. Prototype distribute plugin vertical scale union. Connection fill component variant connection selection project team. Layer variant vertical union frame.",
    buttonText: "See more",
    buttonLink: "#",
  };

  return (
    <>
      <section className="w-full overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 xl:grid-rows-4 w-full h-auto xl:h-[200vh] mb-20">
          {/* Header Section */}
          <FeaturedHeaderSection headerData={headerData || defaultHeaderData} />

          {/* Products */}
          {productsToRender.map((product, index) => (
            <FeaturedProductCard key={index} product={product} />
          ))}
        </div>
      </section>

      <section className="w-full overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 xl:grid-rows-4 w-full h-auto xl:h-[200vh] mb-20">
          {/* Header Section */}
          <FeaturedHeaderSection
            headerData={headerData || defaultHeaderData1}
          />

          {/* Products */}
          {defaultProducts1.map((product, index) => (
            <FeaturedProductCard key={index} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
