// components/ServicesGrid.tsx
import Image from "next/image";

const services = [
  {
    title: "Prendre rendez-vous",
    description: "Réservez facilement une consultation avec un professionnel de santé.",
    image: "/images/services/rendezvous.png",
  },
  {
    title: "Pharmacie en ligne",
    description: "Achetez vos médicaments et produits de santé en toute sécurité.",
    image: "/images/services/pharma.png",
  },
  {
    title: "E-commerce",
    description: "Découvrez une sélection de produits locaux et internationaux.",
    image: "/images/services/shop.png",
  },
  {
    title: "Formations",
    description: "Accédez à des contenus éducatifs et des programmes de formation.",
    image: "/images/services/formation.png",
  },
];

export default function ServicesGrid() {
  return (
    <section className="mt-12">
      <h2 className="text-xl md:text-2xl font-semibold mb-6">Explorez nos services</h2>
      <div className="space-y-6">
        {services.map((service, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row items-center gap-4 bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="w-full md:w-1/4">
              <Image
                src={service.image}
                alt={service.title}
                width={120}
                height={120}
                className="object-contain mx-auto"
              />
            </div>
            <div className="w-full md:w-3/4">
              <h3 className="text-lg font-bold text-primary">{service.title}</h3>
              <p className="text-gray-600 text-sm">{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
