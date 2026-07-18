import { NextResponse } from 'next/server';
import { COMERCIOS_BARRA } from '@/lib/comercio-barra';

export async function GET() {
  try {
    // Query Overpass para Barra, Bahia (raio de 6km ao redor do centro da cidade)
    const overpassQuery = `
      [out:json][timeout:15];
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
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      signal: AbortSignal.timeout(10000), // 10s timeout
    });

    let publicComercios: any[] = [];
    if (res.ok) {
      const osmData = await res.json();
      publicComercios = (osmData.elements || [])
        .filter((el: any) => el.tags && el.tags.name)
        .map((el: any) => {
          const category = el.tags.amenity || el.tags.shop || el.tags.tourism || 'Comércio';
          const name = el.tags.name;
          const phone = el.tags.phone || el.tags['contact:phone'] || '+5574991214751';
          const street = el.tags['addr:street'] || 'Centro';
          const number = el.tags['addr:housenumber'] || '';
          
          // Se não tiver telefone próprio cadastrado no OSM, aponta para o WhatsApp do Lincoln (para captar o anunciante!)
          const isLincolnAcquisition = !el.tags.phone && !el.tags['contact:phone'];
          const description = el.tags.description || `Estabelecimento comercial localizado em Barra - BA.`;

          return {
            id: `osm-${el.id}`,
            name,
            category: category.charAt(0).toUpperCase() + category.slice(1),
            lat: el.lat,
            lng: el.lon,
            address: `${street}${number ? ', ' + number : ''}, Barra - BA`,
            phone: isLincolnAcquisition ? '+5574991214751' : phone,
            description,
            isVip: false,
          };
        });
    }

    // Mesclar com os comércios locais VIP (evitando duplicar se o nome for idêntico)
    const vipNames = new Set(COMERCIOS_BARRA.map(c => c.name.toLowerCase().trim()));
    const filteredPublic = publicComercios.filter(
      (pc: any) => !vipNames.has(pc.name.toLowerCase().trim())
    );

    const merged = [
      ...COMERCIOS_BARRA.map(c => ({ ...c, isVip: true })),
      ...filteredPublic,
    ];

    return NextResponse.json({
      comercios: merged,
      total: merged.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Comercio Local API error:', error);
    // Em caso de falha de conexão com a API de OSM, devolve os locais estáticos
    return NextResponse.json({
      comercios: COMERCIOS_BARRA.map(c => ({ ...c, isVip: true })),
      total: COMERCIOS_BARRA.length,
      error: 'Failed to fetch public OSM data. Falling back to local dataset.',
    });
  }
}
