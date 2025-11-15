export default function Breadcrumb({ title = "Wishlist" }) {
  return (
    <section className="relative">
      <div
        className="relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/img/bg/breadcumb.jpg')",
        }}
      >

        <div
          className="absolute inset-0 pointer-events-none z-5"
          style={{
            background: `
              linear-gradient(to left, rgba(0,0,0,0.7) 0%, transparent 30%),
              linear-gradient(to right, rgba(0,0,0,0.7) 0%, transparent 30%),
              linear-gradient(to top, rgba(0,0,0,1) 0%, transparent 40%)
            `,
            backgroundBlendMode: 'normal'
          }}
        ></div>


        <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <div className="py-40 text-center">
            <h1 className="text-white font-['Epilogue',sans-serif] text-4xl sm:text-5xl lg:text-6xl font-black leading-tight uppercase mb-4">
              {title}
            </h1>
            
          </div>
        </div>
      </div>
    </section>
  );
}

