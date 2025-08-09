export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t py-6 px-4 mt-10 text-sm text-gray-600">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between gap-4">
        <div>© {new Date().getFullYear()} MultiPlateforme. Tous droits réservés.</div>
        <div className="flex gap-4">
          <a href="/a-propos" className="hover:underline">À propos</a>
          <a href="/contact" className="hover:underline">Contact</a>
          <a href="/politique" className="hover:underline">Politique</a>
        </div>
      </div>
    </footer>
  );
}
