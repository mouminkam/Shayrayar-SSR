// Removed "use client" - This component only uses static JSX with an iframe which is SSR-compatible
export default function Map() {
  return (
    <section className="relative w-full h-[550px]">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28821.965472924858!2d89.07524545!3d25.4467646!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fcb92fb4d9696d%3A0x74b18fed6b93e5e5!2sNobabgonj%20National%20garden!5e0!3m2!1sen!2sbd!4v1724820772279!5m2!1sen!2sbd"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0"
      ></iframe>
    </section>
  );
}

