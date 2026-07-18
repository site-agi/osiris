import { NextResponse } from 'next/server';
import { COMERCIOS_BARRA } from '@/lib/comercio-barra';

export async function GET() {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  let comercios: any[] = [];
  let fetchedFromGoogle = false;

  // 1. Tentar carregar dados usando a API oficial do Google Places (Google Maps)
  if (apiKey) {
    try {
      const googleUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-11.0858,-43.1416&radius=6000&type=establishment&key=${apiKey}`;
      const res = await fetch(googleUrl, { signal: AbortSignal.timeout(8000) });
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'OK' && data.results) {
          comercios = data.results.map((place: any) => {
            let category = 'Comércio';
            if (place.types && place.types.length > 0) {
              const mainType = place.types[0];
              category = mainType.charAt(0).toUpperCase() + mainType.slice(1).replace(/_/g, ' ');
            }

            return {
              id: `google-${place.place_id}`,
              name: place.name,
              category,
              lat: place.geometry.location.lat,
              lng: place.geometry.location.lng,
              address: place.vicinity || 'Barra - BA',
              phone: '+5574991214751', // WhatsApp de captação padrão
              description: `Estabelecimento comercial em Barra - BA (via Google Maps). Avaliação: ${place.rating || 'N/A'} ⭐`,
              isVip: false,
            };
          });
          fetchedFromGoogle = true;
          console.log(`[DOMINIQUE] Successfully fetched ${comercios.length} places from Google Places API.`);
        } else {
          console.warn(`[DOMINIQUE] Google Places API status: ${data.status}. Message: ${data.error_message || 'None'}`);
        }
      }
    } catch (e) {
      console.error('[DOMINIQUE] Google Places API fetch failed:', e);
    }
  }

  // 2. Fallback: Se não houver chave ou o fetch do Google falhar, utiliza a Overpass API (OpenStreetMap)
  if (!fetchedFromGoogle) {
    try {
      const overpassQuery = `
        [out:json][timeout:12];
        (
          node["amenity"](around:6000,-11.0858,-43.1416);
          node["shop"](around:6000,-11.0858,-43.1416);
          node["tourism"](around:6000,-11.0858,-43.1416);
        );
        out body;
      `;
      const res = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: overpassQuery,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        signal: AbortSignal.timeout(8000),
      });

      if (res.ok) {
        const osmData = await res.json();
        comercios = (osmData.elements || [])
          .filter((el: any) => el.tags && el.tags.name)
          .map((el: any) => {
            const category = el.tags.amenity || el.tags.shop || el.tags.tourism || 'Comércio';
            return {
              id: `osm-${el.id}`,
              name: el.tags.name,
              category: category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, ' '),
              lat: el.lat,
              lng: el.lon,
              address: `${el.tags['addr:street'] || 'Centro'}, Barra - BA`,
              phone: '+5574991214751',
              description: el.tags.description || `Estabelecimento comercial em Barra - BA.`,
              isVip: false,
            };
          });
        console.log(`[DOMINIQUE] Fallback: Fetched ${comercios.length} places from OpenStreetMap API.`);
      }
    } catch (e) {
      console.error('[DOMINIQUE] OSM Fallback API fetch failed:', e);
    }
  }

  // 3. Mesclar os comércios obtidos com os nossos comércios locais VIP (evitando duplicar se o nome for idêntico)
  const vipNames = new Set(COMERCIOS_BARRA.map(c => c.name.toLowerCase().trim()));
  const filteredPublic = comercios.filter(
    (pc: any) => !vipNames.has(pc.name.toLowerCase().trim())
  );

  const merged = [
    ...COMERCIOS_BARRA.map(c => ({ ...c, isVip: true })),
    ...filteredPublic,
  ];

  return NextResponse.json({
    comercios: merged,
    total: merged.length,
    provider: fetchedFromGoogle ? 'Google Places' : 'OpenStreetMap (Fallback)',
    timestamp: new Date().toISOString(),
  });
}
