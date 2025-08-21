// next.config.js
// No se requiere la importación de `NextConfig`

const imagesUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

if (!imagesUrl) {
  throw new Error("La variable de entorno NEXT_PUBLIC_SUPABASE_IMAGES_URL no está definida.");
}

const url = new URL(imagesUrl);

// Ahora es un objeto normal de JavaScript
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: url.protocol.replace(":", ""),
        hostname: url.hostname,
        port: '',
        pathname: '/storage/v1/object/public/product_images/**',
      },
    ],
    domains: [
      'placehold.co',
    ],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
