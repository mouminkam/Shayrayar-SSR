/**
 * API Route: Image Proxy
 * 
 * Proxies images from shahrayar.peaklink.pro to solve CORS issues.
 * 
 * Usage:
 * GET /api/images/storage/website-slides/image.png
 * Proxies to: https://shahrayar.peaklink.pro/storage/website-slides/image.png
 * 
 * This route:
 * - Fetches images from the API server
 * - Adds proper CORS headers
 * - Implements caching for performance
 * - Handles errors gracefully
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shahrayar.peaklink.pro/api/v1';
const API_DOMAIN = API_BASE_URL.replace('/api/v1', '');

// Timeout for image fetch (reduced to 10 seconds for faster failures)
const FETCH_TIMEOUT = 10000;

// Cache duration (1 year for immutable images)
const CACHE_MAX_AGE = 31536000;

/**
 * GET handler for image proxy
 * @param {Request} request - Next.js request object
 * @param {Object} params - Route parameters containing path segments (Promise in Next.js 15+)
 */
export async function GET(request, { params }) {
  try {
    // Await params (required in Next.js 15+)
    const resolvedParams = await params;
    
    // Extract path segments from params
    const pathSegments = resolvedParams.path || [];
    const imagePath = Array.isArray(pathSegments) 
      ? pathSegments.join('/') 
      : pathSegments;

    // Validate path
    if (!imagePath || imagePath.trim() === '') {
      return new Response('Image path is required', { 
        status: 400,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }

    // Construct full URL to fetch from
    // Handle both /storage/... and storage/... paths
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    const imageUrl = `${API_DOMAIN}${cleanPath}`;

    // Validate that we're only proxying from the API domain
    if (!imageUrl.startsWith(API_DOMAIN)) {
      return new Response('Invalid image source', { 
        status: 403,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }

    // Get query parameters if any (for cache busting, etc.)
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const fullImageUrl = queryString 
      ? `${imageUrl}?${queryString}` 
      : imageUrl;

    // Fetch image with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

    try {
      // Use Next.js fetch caching for better performance
      const imageResponse = await fetch(fullImageUrl, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Next.js Image Proxy',
        },
        // Add Next.js caching
        cache: 'force-cache', // Cache the response
        next: { 
          revalidate: 31536000, // Revalidate after 1 year
        },
      });

      clearTimeout(timeoutId);

      // Handle non-OK responses
      if (!imageResponse.ok) {
        if (imageResponse.status === 404) {
          return new Response('Image not found', { 
            status: 404,
            headers: {
              'Content-Type': 'text/plain',
            },
          });
        }
        
        return new Response(`Failed to fetch image: ${imageResponse.status}`, { 
          status: imageResponse.status || 500,
          headers: {
            'Content-Type': 'text/plain',
          },
        });
      }

      // Get image data
      const imageBuffer = await imageResponse.arrayBuffer();
      
      // Get content type from response or infer from extension
      let contentType = imageResponse.headers.get('Content-Type');
      if (!contentType) {
        const extension = imagePath.split('.').pop()?.toLowerCase();
        const contentTypes = {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'gif': 'image/gif',
          'webp': 'image/webp',
          'svg': 'image/svg+xml',
          'avif': 'image/avif',
        };
        contentType = contentTypes[extension] || 'image/jpeg';
      }

      // Get content length
      const contentLength = imageResponse.headers.get('Content-Length') || imageBuffer.byteLength.toString();

      // Return image with proper headers
      return new Response(imageBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Length': contentLength,
          // CORS headers - allow all origins (or specify your domain)
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          // Caching headers for performance
          'Cache-Control': `public, max-age=${CACHE_MAX_AGE}, immutable`,
          // Additional headers
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
        },
      });

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      // Handle timeout
      if (fetchError.name === 'AbortError') {
        return new Response('Request timeout', { 
          status: 504,
          headers: {
            'Content-Type': 'text/plain',
          },
        });
      }

      // Handle other fetch errors
      console.error('Image proxy fetch error:', fetchError);
      return new Response('Failed to fetch image', { 
        status: 500,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }

  } catch (error) {
    console.error('Image proxy error:', error);
    return new Response('Internal server error', { 
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}

/**
 * OPTIONS handler for CORS preflight requests
 */
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400', // 24 hours
    },
  });
}
