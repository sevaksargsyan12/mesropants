// Renders a schema.org structured-data block. `data` is JSON.stringify'd
// ourselves (not user-typed HTML), so this is safe from the usual
// dangerouslySetInnerHTML XSS concern -- there's no unsanitized string
// injected here, only a serialized plain object.
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
