export interface Comercio {
  id: string;
  name: string;
  category: 'Restaurante' | 'Pousada' | 'Mercado' | 'Tecnologia' | 'Outros';
  lat: number;
  lng: number;
  address: string;
  phone: string;
  description: string;
}

export const COMERCIOS_BARRA: Comercio[] = [
  {
    id: 'restaurante_beira_rio',
    name: 'Restaurante Beira Rio',
    category: 'Restaurante',
    lat: -11.0885,
    lng: -43.1420,
    address: 'Av. Beira Rio, 120, Centro, Barra - BA',
    phone: '+5574991214751',
    description: 'O melhor peixe frito da região do São Francisco. Culinária típica barradeira à beira do rio.'
  },
  {
    id: 'pousada_encontro_aguas',
    name: 'Pousada Encontro das Águas',
    category: 'Pousada',
    lat: -11.0850,
    lng: -43.1435,
    address: 'Rua do Porto, 45, Barra - BA',
    phone: '+5574991214751',
    description: 'Hospedagem confortável com vista privilegiada para o encontro do Rio Grande com o Rio São Francisco.'
  },
  {
    id: 'mercado_central_barra',
    name: 'Mercado Central da Barra',
    category: 'Mercado',
    lat: -11.0895,
    lng: -43.1410,
    address: 'Praça Castro Alves, Centro, Barra - BA',
    phone: '+5574991214751',
    description: 'Artesanato local, doces típicos, cachaça artesanal e produtos frescos da agricultura familiar.'
  },
  {
    id: 'lincoln_corp_tech',
    name: 'Lincoln Corp Soluções Digitais',
    category: 'Tecnologia',
    lat: -11.0910,
    lng: -43.1390,
    address: 'Rua Coronel Alencar, 88, Centro, Barra - BA',
    phone: '+5574991214751',
    description: 'Desenvolvimento de sistemas sob medida, inteligência artificial e consultoria de alta tecnologia.'
  }
];
