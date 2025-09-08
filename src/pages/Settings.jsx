export default function Settings() {
  return (
    <div className="grid gap-4 max-w-lg">
      <h1 className="text-xl font-medium">Réglages</h1>
      <div className="grid gap-3 text-sm">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" defaultChecked readOnly />
          <span>Mode sombre par défaut</span>
        </label>
      </div>
    </div>
  );
}
